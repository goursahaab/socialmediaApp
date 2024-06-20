var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'home | SocialMedia' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about | SocialMedia' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'contact | SocialMedia' });
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'log in | SocialMedia' });
});

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register | SocialMedia' });
});

/* GET home page. */
router.get('/forgot', function(req, res, next) {
  res.render('forgot', { title: 'forgot| SocialMedia ' });
});


router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'profile| SocialMedia ' });
});
module.exports = router;
