import {promises as fs} from 'fs'
import express from 'express';
var router = express.Router();

router.post("/", async (req, res) => {
  try{
    console.log(req.body)

    // save new document to database
    const newUser = new req.models.User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      favorite_ice_cream: req.body.favorite_ice_cream
    })
    await newUser.save()

    res.send("success")
  } catch(error){
    console.log("Error:", error)
    res.status(500).json({"status": "error", "error": error})
  }
})


router.get('/', async function(req, res, next) {
  try{
    let allUsers = await req.models.User.find()
    res.json(allUsers)
  } catch(error){
    console.log("Error:", error)
    res.status(500).json({"status": "error", "error": error})
  }
});



export default router;
