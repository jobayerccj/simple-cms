var express = require('express');
var router = express.Router();
var fs = require('fs');

//var mongoose = require('../../db.js');
var multer = require('multer');
var storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './uploads/');
      },
      filename: function (req, file, callback) {
        //console.log(file);
        callback(null, Date.now()+'-' + file.originalname);
      }
});

router.use(multer({storage: storage}).any());

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var Category = require('../../models/admin/category.js');
var Page = require('../../models/admin/page.js');

var expressValidator = require('express-validator');
router.use(expressValidator());

// define the home page route
router.get('/(\\list)?', function (req, res) {
  Page.find({}, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'page_manager', page_title: 'Page List', pages: data});
  });

});

// define the add page route
router.get('/add', function (req, res) {
  Category.find({}, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'page_add', page_title: 'Page Add', categories: data});
  });

});

// define the save page route
router.post('/add', urlencodedParser, function (req, res) {
  console.log('files detail-');
  console.log(req.files);
  if(typeof req.files === 'undefined'){
    req.body['featured_image'] = "";
  }
  else{
    req.body['featured_image'] = req.files[0]['filename'];
  }

  //console.log(req.files[0]['filename']);
  console.log('form other data');
  //delete req.body.null;
  if(typeof req.body.null != 'undefined'){
    delete req.body.null;
  }

  console.log(req.body);

  req.check('title',"Title is required").notEmpty();
  req.check('alias',"Alias is required").notEmpty();
    /*if(req.body.title == ""){
      Category.find({}, function(err, data){
        if(err) throw err;
          res.render('admin/template', {page_name: 'page_add', page_title: 'Page Add', categories: data, error_msg: "Title field can't be empty!"});
      });

    }*/
    //var errors = req.getValidationResult();
    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
      if(typeof req.files != 'undefined'){
        fs.unlinkSync(req.files[0]['path']);
      }

      Category.find({}, function(err, data){
        if(err) throw err;
        res.send(JSON.stringify(errors));
          //res.render('admin/template', {page_name: 'page_add', page_title: 'Page Add', categories: data, error_msg: JSON.stringify(errors)});
      });
    }
    else{
      var currentDate = new Date();
      req.body.created_at = currentDate;

      Page(req.body).save(function(err, data){
          if(err) throw err;
          res.json('success');
          //return 'success';
          //res.redirect("/admin/page_manager/list");
        });
    }

});

// define the edit category page route
router.get('/edit', function (req, res) {
var categories = "";
  var page_details = Page.findById(req.query.id, function(err, data){
    if(err) throw err;
    Category.find({}, function(cat_err, category_list){
      if(cat_err) throw cat_err;
      console.log(data);
      categories = category_list;
      res.render('admin/template', {page_name: 'page_edit', page_title: 'Page Edit', categories: categories, page_details: data});
    });
  });
});

// define the update category page route
router.post('/edit', urlencodedParser, function (req, res) {

  if(typeof req.files != 'undefined'){
    req.body['featured_image'] = req.files[0]['filename'];
  }
  else{
    req.body['featured_image'] = req.body.old_featured_img;
  }

  //console.log(req.files[0]['filename']);
  console.log('form other data');
  //delete req.body.null;
  if(typeof req.body.null != 'undefined'){
    delete req.body.null;
  }

  console.log(req.body);

  req.check('title',"Title is required").notEmpty();
  req.check('alias',"Alias is required").notEmpty();
    /*if(req.body.title == ""){
      Category.find({}, function(err, data){
        if(err) throw err;
          res.render('admin/template', {page_name: 'page_add', page_title: 'Page Add', categories: data, error_msg: "Title field can't be empty!"});
      });

    }*/
    //var errors = req.getValidationResult();
    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
      if(typeof req.files != 'undefined'){
        fs.unlinkSync(req.files[0]['path']);
      }

      Category.find({}, function(err, data){
        if(err) throw err;
        res.send(JSON.stringify(errors));
          //res.render('admin/template', {page_name: 'page_add', page_title: 'Page Add', categories: data, error_msg: JSON.stringify(errors)});
      });
    }
    else{
      var currentDate = new Date();
      
      Page.findByIdAndUpdate(req.body.id, { $set: { title: req.body.title, alias: req.body.alias, category: req.body.category, description: req.body.description, featured_image: req.body.featured_image, updated_at: currentDate } }, { new: true },function(err, data){
          if(err) throw err;
          res.json('success');
          //return 'success';
          //res.redirect("/admin/page_manager/list");
        });
    }
  /*var newCategoryName = req.body.category_name;
  var oldCategoryName = req.body.old_category_name;

  Page.findByIdAndUpdate( req.body.id, { $set: { title: req.body.title, category: req.body.category, description: req.body.description } }, { new: true }, function(err, data) {
    if(err) throw err;
    res.redirect("/admin/page_manager/list");
  });*/

});

// define the delete page route
router.delete('/delete_page', urlencodedParser, function (req, res) {
  console.log(req.body.id);
  Page.findByIdAndRemove(req.body.id, function(err, data){
    if(err) throw err;
    console.log(data);
    res.json(data);
  });
});

// define the add category page route
router.get('/add_category', function (req, res) {
  res.render('admin/template', {page_name: 'category_add', page_title: 'Category Add'});
});

// define the save category page route
router.post('/add_category', urlencodedParser, function (req, res) {
  Category.find({category_name: req.body.category_name}, function(err, data){
    if(data.length > 0) {
      res.render('admin/template', {page_name: 'category_add', page_title: 'Category Add', 'error_msg': "This category is already available, choose a different name! "});
    }
    else{
      var newCategory = Category(req.body).save(function(err, data){
        if(err) throw err;
        res.redirect("/admin/page_manager/categories");
      })
    }
  });

});

// define the edit category page route
router.get('/edit_category', function (req, res) {
  res.render('admin/template', {page_name: 'category_edit', page_title: 'Category Edit', category_name: req.query.category_name});
});

// define the update category page route
router.post('/edit_category', urlencodedParser, function (req, res) {
  var newCategoryName = req.body.category_name;
  var oldCategoryName = req.body.old_category_name;

  if(newCategoryName == ""){
    res.render('admin/template', {page_name: 'category_edit', page_title: 'Category Edit', category_name: oldCategoryName, error_msg: "Category name field can't be empty!"});
  }
  else{
      Category.findOneAndUpdate({ category_name: oldCategoryName }, { $set: { category_name: newCategoryName } }, { new: true }, function(err, data) {
        if(err) throw err;
        res.redirect("/admin/page_manager/categories");
      });
  }


});

// define the categories list page route
router.get('/categories', function (req, res) {
  Category.find({}, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'category_manager', page_title: 'Category List', categories: data});
  });
});

// define the category delete page route
router.delete('/delete_category', urlencodedParser, function (req, res) {
  console.log(req.body.id);
  Category.findByIdAndRemove(req.body.id, function(err, data){
    if(err) throw err;
    console.log(data);
    res.json(data);
  });
});

module.exports = router
