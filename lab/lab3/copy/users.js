var express = require('express');
var router = express.Router();
var User = require('./userSchema');

router.post('/add', async function(req, res) {
  const firstName = "weifan";
  const lastName = "wu";
  const age = 21;
  const user = new User({firstName, lastName, age});
  await user.save();
  res.send('add the user to database');
});

module.exports = router;