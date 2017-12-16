var express = require('express');
var router = express.Router();
var fs = require('fs');

router.use(express.static('uploads'));

//var mongoose = require('../../db.js');
var multer = require('multer');
var storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './assets/admin/uploads/slideshow/');
      },
      filename: function (req, file, callback) {
        //console.log(file);
        callback(null, Date.now()+'-' + file.originalname);
      }
});

router.use(multer({storage: storage}).any());

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var expressValidator = require('express-validator');
var Slideshow = require('../../models/admin/slideshow.js');

router.use(expressValidator());

// define the home page route
router.get('/(\\list)?', function (req, res) {
  Slideshow.find({}, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'slideshow_manager', page_title: 'Slideshow List', pages: data});
  });

});

// define the add page route
router.get('/add', function (req, res) {
  res.render('admin/template', {page_name: 'slideshow_add', page_title: 'Slideshow Add'});
});

// define the save page route
router.post('/add', urlencodedParser, function (req, res) {
  console.log('files detail-');
  console.log(req.files);
  req.body['image_name'] = req.files[0]['filename'];
  //console.log(req.files[0]['filename']);
  console.log('form other data');
  //delete req.body.null;
  if(typeof req.body.null != 'undefined'){
    delete req.body.null;
  }

  console.log(req.body);

  req.check('title',"Title is required").notEmpty();

    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
      fs.unlinkSync(req.files[0]['path']);
      res.send(JSON.stringify(errors));
    }
    else{

      Slideshow(req.body).save(function(err, data){
          if(err) throw err;
          res.json('success');
        });
    }

});

// define the edit category page route
router.get('/edit', function (req, res) {

  var slideshow_details = Slideshow.findById(req.query.id, function(err, data){
    console.log(data);
    if(err) throw err;
    res.render('admin/template', {page_name: 'slideshow_edit', page_title: 'Slideshow Edit', page_details: data});
  });

});

// define the update slideshow page route
router.post('/edit', urlencodedParser, function (req, res) {

  console.log('files detail-');
  console.log(req.files);
  if(typeof req.files != 'undefined'){
    req.body['image_name'] = req.files[0]['filename'];
  }
  else{
    req.body['image_name'] = req.body.old_img;
  }

  //console.log(req.files[0]['filename']);
  console.log('form other data');
  //delete req.body.null;
  if(typeof req.body.null != 'undefined'){
    delete req.body.null;
  }

  console.log(req.body);

  req.check('title',"Title is required").notEmpty();

    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
      if(typeof req.files != 'undefined'){
        fs.unlinkSync(req.files[0]['path']);
      }

      res.send(JSON.stringify(errors));
    }
    else{
      Slideshow.findByIdAndUpdate( req.body.id, { $set: { title: req.body.title, image_name: req.body.image_name } }, { new: true }, function(err, data) {
          if(err) throw err;
          res.json('success');
        });
    }

  /*Page.findByIdAndUpdate( req.body.id, { $set: { title: req.body.title, category: req.body.category, description: req.body.description } }, { new: true }, function(err, data) {
    if(err) throw err;
    res.redirect("/admin/slideshow_manager/list");
  });*/

});

// define the delete page route
router.delete('/delete_slideshow', urlencodedParser, function (req, res) {
  console.log(req.body.id);
  Slideshow.findByIdAndRemove(req.body.id, function(err, data){
    if(err) throw err;
    console.log(data);
    res.json(data);
  });
});

module.exports = router
