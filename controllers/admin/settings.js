var express = require('express');
var router = express.Router();
//var mongoose = require('../../db.js');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var Setting = require('../../models/admin/settings.js');

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

// define the add page route
router.get('/site', function (req, res) {
  Setting.find({}, function(err, data){
    if(err) throw err;
    var settings = {};
    data.forEach(function(item){
      settings[item.setName] = item.setValue;
    });
    console.log(settings);
    res.render('admin/template', {page_name: 'setting_site', page_title: 'Site Settings', settings: settings});
  });

});

// define the add page route
router.get('/email', function (req, res) {
  Setting.find({}, function(err, data){
    if(err) throw err;
    var settings = {};
    data.forEach(function(item){
      settings[item.setName] = item.setValue;
    });
    //console.log(settings);
    res.render('admin/template', {page_name: 'setting_email', page_title: 'Email Settings', settings: settings});
  });

});

// define the save page route
router.post('/save', urlencodedParser, function (req, res) {
  var currentDate = new Date();
  console.log(req.body);
  for (var prop in req.body) {
    var setName = prop.split("settings_");
    if(typeof setName[1] !='undefined'){
      var settings = {setName: setName[1], setValue: req.body[prop], updated_at: currentDate};
      //console.log(settings);
      Setting.update({setName: setName[1]}, settings, {upsert: true}, function (err) {
        if (err) {
          //console.log(err);
          throw err;
        };
      });
    }
  }

  res.redirect("/admin/settings/site");
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

router.post('/upload_logo', urlencodedParser, function (req, res) {
  console.log(req.files);
  var currentDate = new Date();
  var settings = {setName: 'logo', setValue: req.files[0]['filename'], updated_at: currentDate};

  Setting.update({setName: 'logo'}, settings, {upsert: true}, function (err) {
    if (err) {
      //console.log(err);
      throw err;
    };
    res.json('success');
  });

});

module.exports = router
