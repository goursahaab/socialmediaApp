var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'home page' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about page' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'contact' });
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'log in ' });
});

module.exports = router;
