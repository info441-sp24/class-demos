import express from 'express';
var router = express.Router();

router.get("/", async(req, res) => {
    let allItems = await req.models.Item.find()
    res.json(allItems)
})

router.post("/saveCart", async(req, res) => {
    console.log("saving cart, session currently is: ", req.session)

    let cartInfo = req.body

    //save cart info in session 
    // (as a string, cause it didn't work otherwise)
    // TODO: for security, probably make sure it's just item id and count
    req.session.cartInfo = JSON.stringify(cartInfo)

    console.log("session is now: ", req.session)

    res.json({status: "success"})
})

async function addPricesToCart(cartInfo, models){
    // cartInfo currently looks like: [{itemId: 345, itemCount: 2}, {itemId: 643, itemCount: 5}]

    // look up in the db all the items in my cart
    let cartItemIds = cartInfo.map(cartItem => cartItem.itemId)
    let itemsInfo = await models.Item.find().where('_id').in(cartItemIds).exec()

    // itemsInfo will be an array of json, like this:
    // [{_id: 234, name: "orange", price: ...}, {_id: 53, name: "m&ms", ...}, ...]


    // take that itemsInfo and make it an object, so I can look up by id
    let itemsInfoById = {}
    itemsInfo.forEach(itemInfo => {
        itemsInfoById[itemInfo.id] = itemInfo
    })

    // itemsInfById will look like:
    // {
    //    234: {_id: 234, name: "orange", price: ...}
    //    53: {_id: 53, name: "m&ms", ...}
    //    ...
    // }

    // take the cart Info and for each item, make a new object with the name and price included
    let combinedCartInfo = cartInfo.map(cartItem => {
        return {
            itemId: cartItem.itemId,
            itemCount: cartItem.itemCount,
            name: itemsInfoById[cartItem.itemId].name,
            price: itemsInfoById[cartItem.itemId].price
        }
    })

    return combinedCartInfo
}

router.get("/getCart", async(req, res) => {
    if(!req.session || !req.session.cartInfo){
        // no session, no cart info, just return empty
        res.json([])
        return
    }

    let cartInfo = JSON.parse(req.session.cartInfo)
    // Note: just itemID and count

    // add item names and prices to the cart info
    let combinedCartInfo = await addPricesToCart(cartInfo, req.models)

    res.json(combinedCartInfo)

})

async function calculateOrderAmount(req){
    let cartInfo = JSON.parse(req.session.cartInfo)

    let combinedCartInfo = await addPricesToCart(cartInfo, req.models)

    let totalCost = combinedCartInfo
        .map(item => item.price * item.itemCount)
        .reduce((prev, curr) => prev + curr)

    return totalCost
}


router.post("/create-payment-intent", async (req, res) => {
    let orderAmount = await calculateOrderAmount(req)
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

export default router;
