import express from 'express'
var router = express.Router()

router.get('/', (req, res) => {
    res.send("This is the desserts section")
})

router.get('/1', (req, res) => {
    res.send("Chocolate Cake")
})

// broken endpoint, to show error 
router.get('/2', async (req, res) => {

    // Fake an error to pretend our database failed or something
    throw(new Error("Loading dessert to failed!"))

    res.send("dessert 2")
})

// error handling done correctly
router.get('/3', async (req, res) => {
    try{
        // Fake an error to pretend our database failed or something
        throw(new Error("Loading dessert to failed!"))

        res.send("dessert 3")
    } catch(err) {
        console.log(err)
        res.status(500).send("Error loading dessert")
    }
})


export default router