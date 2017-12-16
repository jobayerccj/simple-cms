var express = require('express');
var router = express.Router();
var fs = require('fs');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var expressValidator = require('express-validator');
var Menu = require('../../models/admin/menu.js');

router.use(expressValidator());

// define the home menu route
router.get('/(\\list)?', function (req, res) {
  Menu.find({}, function(err, data){
    if(err) throw err;
    res.render('admin/template', {page_name: 'menu_manager', page_title: 'Menu List', menus: data});
  });

});

// define the add menu route
router.get('/add', function (req, res) {
  res.render('admin/template', {page_name: 'menu_add', page_title: 'Menu Add'});
});


router.post('/add', urlencodedParser, function (req, res) {
  //console.log(req.files[0]['filename']);
  console.log('form other data');

  console.log(req.body);

  req.check('name',"Name is required").notEmpty();

    var errors = req.validationErrors();
    console.log(errors);
    if(errors){
      Category.find({}, function(err, data){
        if(err) throw err;
        res.send(JSON.stringify(errors));
          //res.render('admin/template', {page_name: 'page_add', page_title: 'Page Add', categories: data, error_msg: JSON.stringify(errors)});
      });
    }
    else{
      Menu(req.body).save(function(err, data){
          if(err) throw err;

          res.redirect("/admin/menu_manager/list");
        });
    }

});


router.get('/detail', function (req, res) {

  Menu.findById(req.query.id, function(err, data){
    if(err) throw err;
    //console.log(data);
    res.render('admin/template', {page_name: 'menu_detail', page_title: 'Menu Details', menu_details: data});
  });
});


// define the update menu page route
router.post('/editMenu', urlencodedParser, function (req, res) {

  console.log(req.body);

  req.check('name',"Name is required").notEmpty();

    var errors = req.validationErrors();

    if(errors){
      res.send(JSON.stringify(errors));
    }
    else{
      Menu.findByIdAndUpdate(req.body.editted_menu_id, { $set: { name: req.body.name} }, { new: true },function(err, data){
          if(err) throw err;
          res.json('success');
        });
    }

});

// define the delete menu route
router.delete('/delete_menu', urlencodedParser, function (req, res) {
  //console.log(req.body.id);
  Menu.findByIdAndRemove(req.body.id, function(err, data){
    if(err) throw err;
    //console.log(data);
    res.json(data);
  });
});

// define the save menu route
router.post('/addMenuItem', urlencodedParser, function (req, res) {

  req.check('name',"Name is required").notEmpty();
  req.check('link',"Link is required").notEmpty();
  var errors = req.validationErrors();

    if(errors){
        res.json(JSON.stringify(errors));
    }
    else{
      Menu.update({_id:req.body.menu_id},
        {$push: {pages: {name: req.body.name, link: req.body.link, parent_id: req.body.parent_id}}}, { multi: true }, function (err, raw) {
        if (err) return handleError(err);
        res.json('success');

      });
    }
});

router.post('/deleteMenuItem', urlencodedParser, function (req, res) {

  Menu.update({_id:req.body.id}, {$pull: {pages: {name: req.body.page_name}}} , function (err, raw) {
    if (err) return handleError(err);
    res.send("ok");

  });

});

router.post('/editMenuItem', urlencodedParser, function (req, res) {

  req.check('editted_menu_name',"Name is required").notEmpty();
  req.check('link',"Link is required").notEmpty();
  var errors = req.validationErrors();

  if(errors){
    res.json(JSON.stringify(errors));
  }
  else{
    Menu.update({_id:req.body.menu_id}, {$pull: {pages: {name: req.body.edit_menu_name}}} , function (err, raw) {
      if (err) return handleError(err);
      Menu.update({_id:req.body.menu_id}, {$push: {"pages": {$each: [{name: req.body.editted_menu_name, link: req.body.link, parent_id: req.body.parent_id}], $position: parseInt(req.body.menu_item_position)}}}, function (err, raw) {
        if (err)
        res.send(JSON.stringify(err));
        res.json('success');
      });
    });
  }


});

router.post('/sort_menu_items', urlencodedParser, function (req, res) {
  if(req.body.menus){
    var menus = JSON.parse(req.body.menus);
    var i = 0;
    menus.forEach(function(menu){
      Menu.findOne({'_id': req.body.menu_id, pages: {$elemMatch: {name: menu}}},{_id:0, "pages.$": 1}, function(err, data){
        var menuData = data.pages;
        Menu.update({'_id': req.body.menu_id}, {$pull: {pages: {name: menu}}}, function(err, data1){
          //console.log(data);
          Menu.update({'_id': req.body.menu_id}, {$push: {"pages": {$each: menuData, $position: i}}}, function(err, data){

          });

        });
      });

      i++;
    });
  }
  res.send('ok');
});


router.post('/getParentMenuItem', urlencodedParser, function (req, res) {

  Menu.find({'_id': req.body.menu_id, pages: {$elemMatch: {parent_id: "0"}}},{_id:0, name:0}, function(err, data){
    if(err) throw err;

    res.json(data);
  });
});

module.exports = router
