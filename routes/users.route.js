var express = require('express');
var router = express.Router();

const userCollection=require('../models/user.schema');
const localStategy=require('passport-local');
const passport=require('passport');

passport.use(new localStategy(userCollection.authenticate()));


/* GET users listing. */


router.post('/register',async function(req, res, next) {
try {
  res.json(req.body);
} catch (error) {
  console.log(error);
  res.send(error.message)
}
});

module.exports = router;
