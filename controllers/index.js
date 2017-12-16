var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var commonHelper = require('../helpers/common.js');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// define the home page route
router.get('/', function (req, res) {
  commonHelper.getImagesByAlbum('Home','Slideshow').exec(function(err,slideshow){

    res.render('public/template',{page_name: 'home', page_title: 'Home Page', slideshow: slideshow});
  });

});

module.exports = router
