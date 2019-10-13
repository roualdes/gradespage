var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('grades', { title: 'grades' });
});

module.exports = router;
