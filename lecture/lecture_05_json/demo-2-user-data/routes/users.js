import {promises as fs} from 'fs'
import express from 'express';
var router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body)

  // save info to a file
  await fs.writeFile("data/userData.json", JSON.stringify(req.body))

  res.send("success")
})


router.get('/', async function(req, res, next) {
  res.type("json")
  res.send(await fs.readFile("data/userData.json"));
});



export default router;
