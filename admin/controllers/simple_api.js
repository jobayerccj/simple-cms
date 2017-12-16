var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var commonHelper = require('../helpers/common.js');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var expressValidator = require('express-validator');
router.use(expressValidator());

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// define the home page route
router.get('/', function (req, res) {
  res.json({"test": "done"});
    //commonHelper.getImagesByAlbum('Home','Slideshow').exec(function(err,slideshow){
});

router.get('/get_images_by_album', function (req, res) {
  commonHelper.getImagesByAlbum(req.query.album_name,req.query.cat_name).exec(function(err,slideshow){
    res.json(slideshow);
  });
});

router.get('/get_page_by_alias', function (req, res) {

  commonHelper.getPageSingle(req.query.page_alias).exec(function(err,data){
    console.log(data);
    res.json(data);
  });
});

router.get('/get_images_by_cat', function (req, res) {

  commonHelper.getImagesByCat(req.query.cat_name).exec(function(err,images){
    var all_images = [];
    images.forEach(function(img){
      all_images.push(img.images);
    });
    //console.log(all_images);
    res.json(all_images);
  });
});

router.get('/get_menu_by_name', function (req, res) {

  commonHelper.getMenuByName(req.query.menu_name).exec(function(err,menuItems){
    //console.log(menuItems);
    res.json(menuItems);
  });
});

router.get('/get_submenu_by_name', function (req, res) {

  commonHelper.getSubmenu(req.query.main_menu_name, req.query.parent_name).exec(function(err,menuItems){
    console.log(menuItems);
    //res.json(menuItems);
  });
});

router.get('/get_page_list_by_cat',function(req,res){
  commonHelper.getPagesByCat(req.query.cat_name, req.query.limit, req.query.offset).exec(function(err,data){
    res.json(data);
  });
});

router.get('/get_page_count_by_cat',function(req,res){
  commonHelper.getPageCountByCat(req.query.cat_name).exec(function(err,data){
    res.json({total_records:data});
  });
});

router.get('/submit_contact_data',function(req,res){
  //console.log(req.query.email + req.query.message);
  req.check('email',"Email is required").notEmpty();
  req.check('email',"It should be a valid email address").isEmail();
  req.check('message',"Message is required").notEmpty();
  var errors = req.validationErrors();

  if(errors){
    res.json({result:'error', error_list: errors});
  }
  else{
    var port;
    commonHelper.getEmailSetting().exec(function(err,data){

      console.log(data[0]['setName']);
      var settings_data = [];

      for(var i=0; i< 5; i++){
        switch(data[i]['setName']){
          case 'smtp_port':
            settings_data['port'] = data[i]['setValue'];
            break;

          case 'smtp_host':
            settings_data['host'] = data[i]['setValue'];
            break;

            case 'smtp_user':
              settings_data['user'] = data[i]['setValue'];
              break;

            case 'smtp_pass':
                settings_data['pass'] = data[i]['setValue'];
                break;

            case 'email_noti':
                settings_data['email_noti'] = data[i]['setValue'];
                break;
        }
      }

      console.log(settings_data);
      commonHelper.submitContactData(
        req.query.name, req.query.email, req.query.phone, req.query.message,
        settings_data
      );

      //res.json({result:data.setValue});
      res.json({result:port});
    });
    //console.log('port' + port);

  }

});

router.get('/get_single_setting',function(req,res){
  commonHelper.getSettingSingle(req.query.set_name).exec(function(err,data){
    res.json({result:data.setValue});
  });
});

router.get('/get_setting_all',function(req,res){
  commonHelper.getSettingAll().exec(function(err,data){
    var settings = {};
    data.forEach(function(setting){
      settings[setting.setName] = setting.setValue;
    });
    res.json(settings);
  });
});

module.exports = router
