import cache from 'memory-cache'
import express from 'express';
var router = express.Router();

// artificially slow down getting the items from the database
// to pretend that this is a really slow, difficult query, so
// we can see the benefits of caching
async function getItemsSlow(req){
    // get all items from the database
    let allItems = await req.models.Item.find()

    // pause for 5 seconds to pretend this was a difficult query
    let sleepSeconds = 5
    await new Promise(r => setTimeout(r, sleepSeconds * 1000))

    // return
    return allItems
}

router.get("/", async(req, res) => {
    console.log("got a get request for all items, first checking cache...")
    //check if we already have the answer cached 
    let allItems = cache.get('allItems')
    if(allItems){
        console.log("cache hit: found items in my cache")
    } else {// otherwise, look up info from database and save it 
        console.log("cache miss, doing the slow db lookup")
        // artificially slowed getting items from database
        allItems = await getItemsSlow(req)
        console.log("found items in the db, saving to cache")
        cache.put('allItems', allItems, 30*1000)
    }

    //Try to stop browser caching for testing purposes: https://stackoverflow.com/questions/66856405/how-to-disable-caching-for-some-routes-in-the-express-4-applications
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader( 'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate' );
    res.setHeader('Expires', '0');

    // set caching rule for browser
    // res.set('Cache-Control', 'public, max-age=30')
    res.json(allItems)
})

router.post("/saveCart", async(req, res) => {
    console.log("saving cart, session currently is: ", req.session)

    let cartInfo = req.body
    // TODO: make sure cart only has item IDs and counts

    // for some reason if I saved the object, it got deleted later
    req.session.cartInfo = JSON.stringify(cartInfo)

    console.log("session is now: ", req.session)

    res.json({status: "success"})
})

async function addPricesToCart(cartInfo, models){
    // cartInfo should start like: [{itemId: 342, itemCount: 2}, {itemId: 3423, itemCount 2}, ...]

    // look up in the db all the items listed in my cart
    let cartItemIds = cartInfo.map(cartItem => cartItem.itemId)
    let itemsInfo = await models.Item.find().where("_id").in(cartItemIds).exec()

    // itemsInfo will be an array of json, like this:
    // [{_id:342, name: "orange", price: ...}, {_id: 3423, name: "apple", ...}...]

    // transform the itemsInfo into an object where I can look up info by the id
    let itemsInfoById = {}
    itemsInfo.forEach(itemInfo => {
        itemsInfoById[itemInfo._id] = itemInfo
    })

    // itemsInfoById will look like
    // {
    //     342: {_id:342, name: "orange", price: ...},
    //     3423: {_id: 3423, name: "apple", ...}
    //     ...
    // }

    // take the cartInfo, and for each item, make a new object that incudes the name and price
    let combinedCartInfo = cartInfo.map(cartItem => {
        return {
            itemId: cartItem.itemId, // from user cart
            itemCount: cartItem.itemCount, // from user cart
            name: itemsInfoById[cartItem.itemId].name, // from the db
            price: itemsInfoById[cartItem.itemId].price // from the db
        }
    })

    return combinedCartInfo
}

router.get('/getCart', async(req, res) => {
    if(!req.session || !req.session.cartInfo){
        // if there is no session or saved cart, just return empty cart
        res.json([])
        return
    }

    let cartInfo = JSON.parse(req.session.cartInfo)

    // add item names and prices to the cart info
    let combinedCartInfo = await addPricesToCart(cartInfo, req.models)

    res.json(combinedCartInfo)
})

async function calculateOrderAmount(req){
    // get cart Info, combine with prices, calculate total price
    let cartInfo = JSON.parse(req.session.cartInfo)

    let combinedCartInfo = await addPricesToCart(cartInfo, req.models)

    let totalCost = combinedCartInfo
        .map(item => item.price * item.itemCount) // get costs for each item
        .reduce((prev, curr) => prev + curr)

    return totalCost
}

router.post('/create-payment-intent', async(req, res) => {
    // look up the order amount
    let orderAmount = await calculateOrderAmount(req)

    //create a PaymentIntent object with order amount
    const paymentIntent = await req.stripe.paymentIntents.create({
        amount: orderAmount * 100,
        currency: "usd", // 'usd' is actually US cents for some reason (US dollars * 100) 
        automatic_payment_methods: {
            enabled: true
        }
    })

    res.send({
        clientSecret: paymentIntent.client_secret,
      });
})

export default router;
