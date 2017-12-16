var express = require('express');
var router = express.Router();
var fs = require('fs');
var resizer = require('resizer');
var sharp = require('sharp');

router.use(express.static('uploads'));

//var mongoose = require('../../db.js');
var multer = require('multer');
var now = Date.now();
var storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './uploads/images/');
      },
      filename: function (req, file, callback) {
        callback(null, now + '_' + file.originalname.replace(/[- )(]_/g,'').toLowerCase());
      }
});



//router.use(multer({storage: storage}).any());


var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var expressValidator = require('express-validator');
var ImgCategory = require('../../models/admin/img_category.js');
var ImageAlbum = require('../../models/admin/image_album.js');

router.use(expressValidator());

router.get('/category_list', function (req, res) {
  ImgCategory.find({}, function(err, data){
    if(err) throw err;
    console.log(data);
    res.render('admin/template', {page_name: 'image_category_list', page_title: 'Image Category List', categories: data});
  });

});

// define the category add page route
router.get('/add_category', function (req, res) {
  res.render('admin/template', {page_name: 'image_category_add', page_title: 'Image Category Add'});
});

// define the category save page route
router.post('/add_category', urlencodedParser, function (req, res) {

  //delete req.body.null;
  if(typeof req.body.null != 'undefined'){
    delete req.body.null;
  }

  console.log(req.body);

  req.check('category_name',"Category name is required").notEmpty();
    var errors = req.validationErrors();
    console.log(errors);

    if(errors){
      res.render('admin/template', {page_name: 'image_category_add', page_title: 'Image Category Add', error_msg: errors});
      //res.send(JSON.stringify(errors));
    }
    else{
      ImgCategory(req.body).save(function(err, data){
          if(err) throw err;
          res.redirect("/admin/image_manager/category_list");
        });
    }

});

// define the edit category page route
router.get('/edit_image_category', function (req, res) {

  var img_category_details = ImgCategory.findById(req.query.id, function(err, data){
    console.log(data);
    if(err) throw err;
    res.render('admin/template', {page_name: 'image_category_edit', page_title: 'Image Category Edit', page_details: data});
  });

});

// define the update slideshow page route
router.post('/edit_image_category', urlencodedParser, function (req, res) {

  console.log('form other data');
  //delete req.body.null;
  if(typeof req.body.null != 'undefined'){
    delete req.body.null;
  }

  console.log(req.body);

  req.check('category_name',"category name is required").notEmpty();

    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
      ImgCategory.findById(req.body.id, function(err, data){
        res.render('admin/template', {page_name: 'image_category_edit', page_title: 'Image Category Edit', page_details: data, error_msg: errors});
      });
      //res.render('admin/template', {page_name: 'image_category_edit', page_title: 'Image Category Edit', error_msg: errors});
      //res.send(JSON.stringify(errors));
    }
    else{
      ImgCategory.findByIdAndUpdate( req.body.id, {
        $set: {
          category_name: req.body.category_name,
          bigger_img_width: req.body.bigger_img_width,
          bigger_img_height: req.body.bigger_img_height,
          thumb_img_width: req.body.thumb_img_width,
          thumb_img_height: req.body.thumb_img_height
          } }, { new: true }, function(err, data) {
          if(err) throw err;
          res.redirect("/admin/image_manager/category_list");
        });
    }
});

router.delete('/delete_category', urlencodedParser, function (req, res) {
  console.log(req.body.id);
  ImgCategory.findByIdAndRemove(req.body.id, function(err, data){
    if(err) throw err;
    console.log(data);
    res.json(data);
  });
});

router.get('/album_list', function (req, res) {
  ImageAlbum.find({}, function(err, data){
    if(err) throw err;
    console.log(data);
    res.render('admin/template', {page_name: 'album_list', page_title: 'Album List', album_list: data});
  });

});

// define the category add page route
router.get('/add_album', function (req, res) {

  ImgCategory.find({}, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'album_add', page_title: 'Album Add', categories: data});

  });


});

// define the category save page route
router.post('/add_album', urlencodedParser, function (req, res) {

  //delete req.body.null;
  if(typeof req.body.null != 'undefined'){
    delete req.body.null;
  }

  console.log(req.body);

  req.check('album_name',"Album name is required").notEmpty();
  req.getValidationResult().then(function(errors){
    if(!errors.isEmpty()){

      /*var errors = result.array().map(function(elem){
        return elem.msg;
      });*/
      console.log(errors.array());

      ImgCategory.find({}, function(err, data){
        if(err) throw err;
        res.render('admin/template', {page_name: 'album_add', page_title: 'Album Add', error_msg: errors.array(),categories: data});

      });
    }

    else{
      ImageAlbum(req.body).save(function(err, data){
          if(err) throw err;
          res.redirect("/admin/image_manager/album_list");
        });
    }
  });

});

// define the edit category page route
router.get('/edit_album', function (req, res) {

  ImageAlbum.findById(req.query.id, function(err, data){
    ImgCategory.find({}, function(err, category_list){
      console.log(data);
      if(err) throw err;
      res.render('admin/template', {page_name: 'album_edit', page_title: 'Album Edit', album_detail: data, categories: category_list});
    });

  });

});

// define the update slideshow page route
router.post('/edit_album', urlencodedParser, function (req, res) {

  console.log('form other data');
  //delete req.body.null;
  if(typeof req.body.null != 'undefined'){
    delete req.body.null;
  }

  console.log(req.body);

  req.check('album_name',"Album name is required").notEmpty();

    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
      ImageAlbum.findById(req.body.id, function(err, data){
        ImgCategory.find({}, function(err, category_list){
          res.render('admin/template', {page_name: 'album_edit', page_title: 'Album Edit', album_detail: data, error_msg: errors, categories: category_list});
        });

      });
      //res.render('admin/template', {page_name: 'image_category_edit', page_title: 'Image Category Edit', error_msg: errors});
      //res.send(JSON.stringify(errors));
    }
    else{
      ImageAlbum.findByIdAndUpdate( req.body.id, {
        $set: {
          album_name: req.body.album_name,
          description: req.body.description,
          category_name: req.body.category_name,
          status: req.body.status
          } }, { new: true }, function(err, data) {
          if(err) throw err;
          res.redirect("/admin/image_manager/album_list");
        });
    }
});

router.delete('/delete_album', urlencodedParser, function (req, res) {
  console.log(req.body.id);
  ImageAlbum.findByIdAndRemove(req.body.id, function(err, data){
    if(err) throw err;
    console.log(data);
    res.json(data);
  });
});


// define the edit category page route
router.get('/upload_images', function (req, res) {

  if(!req.query.id){
    var albq = {};
  }else{
    var albq = {_id: req.query.id};
  }
  ImageAlbum.findOne(albq, function(err, data){
    console.log(data);
    ImgCategory.findOne({category_name: data.category_name}, function(err, category){
    //  console.log(category);
      if(err) throw err;
      ImageAlbum.find({}, function(err, album_list){
        if(err) throw err;

        res.render('admin/template', {page_name: 'upload_images', page_title: 'Upload Images', album_detail: data, category: category, albums: album_list, album_id: data.id});
      });
    });

  });

});

router.post('/upload', multer({storage: storage}).any(), function (req, res) {
  //console.log(req.body); //return false;

    req.files.forEach(function(file){
      generate_thumbs(file.filename, parseInt(req.body.thumb_img_width), parseInt(req.body.thumb_img_height));

      ImageAlbum.update({_id:req.body.album_id},
        {$push: {images: {name: file.filename, title: ""}}}, { multi: true }, function (err, raw) {
        if (err) return handleError(err);

        //console.log('The raw response from Mongo was ', raw);
      });
    });

    res.json(req.files);
});

function generate_thumbs(filename, thumb_width, thumb_height){
//console.log(thumb_img_width);
  sharp('./uploads/images/' + filename)
  .resize(thumb_width, thumb_height)
  .toFile('./uploads/images/thumbs/' + filename, function(err) {

    // output.jpg is a 200 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });
}

router.post('/generate_thumbs', urlencodedParser, function (req, res) {
  res.json(req.body);
});

router.post('/delete_image', urlencodedParser, function (req, res) {
//  console.log(req.body);
  ImageAlbum.update({_id:req.body.album_id},{$pull: {images: {name: req.body.imgname}}}, { multi: false }, function (err, raw) {
    if (err) return handleError(err);
    res.send("ok");
    //console.log('The raw response from Mongo was ', raw);
  });

});

router.get('/add_image_data', function (req, res) {
  ImageAlbum.findOne({'_id': req.query.album_id, images: {$elemMatch: {name: req.query.image_name}}},{_id:0, "images.$": 1}, function(err, data){
    //console.log(data.images);
    res.render('admin/add_image_data', {image: data.images[0], album_id: req.query.album_id});

  });
});

router.post('/add_image_data', urlencodedParser, function (req, res) {
  console.log(req.body);
  ImageAlbum.update({'_id': req.body.album_id, images: {$elemMatch: {name: req.body.image_name}}}, {$set: {"images.$.title": req.body.image_title,"images.$.description": req.body.image_description}}, function(err, data){
    //console.log(data.images[0].name);
    res.send('ok');

  });
});

router.post('/sort_images', urlencodedParser, function (req, res) {
  if(req.body.images){
    var images = JSON.parse(req.body.images);
    var i = 0;
    images.forEach(function(image){
      ImageAlbum.findOne({'_id': req.body.album_id, images: {$elemMatch: {name: image}}},{_id:0, "images.$": 1}, function(err, data){
        var imgdata = data.images;
        ImageAlbum.update({'_id': req.body.album_id}, {$pull: {images: {name: image}}}, function(err, data1){
          //console.log(data);
          ImageAlbum.update({'_id': req.body.album_id}, {$push: {"images": {$each: imgdata, $position: i}}}, function(err, data){});

        });
      });

      i++;
    });
  }
  res.send('ok');
});

module.exports = router
