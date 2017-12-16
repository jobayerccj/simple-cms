var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
//var mongoose = require('../../db.js');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var Category = require('../../models/admin/category.js');
var Page = require('../../models/admin/page.js');
var User = require('../../models/admin/user.js');

// define the home page route
router.get('/(\\list)?', function (req, res) {
  User.find({}, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'user_manager', page_title: 'User List', users: data});
  });

});

// define the add page route
router.get('/add', function (req, res) {
  Category.find({}, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'user_add', page_title: 'User Add'});
  });

});

// define the save page route
router.post('/add', urlencodedParser, function (req, res) {
  var currentDate = new Date();

  bcrypt.hash(req.body.password, 10, function(err, hash) {
    var new_user = User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hash,
        created_at: currentDate,
        updated_at: currentDate,
        active: req.body.active?true:false
    });
    // save the user
    new_user.save(function(error) {
      if (error) {
        //console.log(err);
        throw error;
      };

      console.log('New User created!');
      res.redirect("/admin/user_manager/list");
    });
  });

});

// define the edit category page route
router.get('/edit', function (req, res) {

  var user_details = User.findById(req.query.id, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'user_edit', page_title: 'User Edit', user_details: data});
  });
});

// define the update category page route
router.post('/edit', urlencodedParser, function (req, res) {
  if(req.body.password){
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }else{
    delete req.body.password;
  }
  console.log(req.body);
  User.findByIdAndUpdate( req.body.id, { $set: req.body }, { new: true }, function(err, data) {
    if(err) throw err;
    res.redirect("/admin/user_manager/list");
  });

});

// define the delete page route
router.delete('/delete_user', urlencodedParser, function (req, res) {
  console.log(req.body.id);
  User.findByIdAndRemove(req.body.id, function(err, data){
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
      console.log(data);
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
