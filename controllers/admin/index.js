var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('../../db.js');
var User = require('../../models/admin/user.js');

var Page = require('../../models/admin/page.js');
var ImageAlbum = require('../../models/admin/image_album.js');
var Menu = require('../../models/admin/menu.js');

router.use(session({
  secret: 'SecretKEYforSimpleCMS',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60 * 60 * 1000},
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

router.use(function (req, res, next) {
  var user_email = req.session.user_email;
  if(req.url !== "/login" && req.url !== "/logout" && !user_email){
    res.redirect("/admin/login");
  }else{
    res.locals.user_email = req.session.user_email;
    res.locals.user_firstName = req.session.user_firstName;
    res.locals.user_id = req.session.user_id;
    next();
  }
});

//Start Routing different controllers
router.use('/page_manager', require('./page_manager.js'));
router.use('/slideshow_manager', require('./slideshow_manager.js'));
router.use('/image_manager', require('./image_manager.js'));
router.use('/user_manager', require('./user_manager.js'));
router.use('/settings', require('./settings.js'));
router.use('/menu_manager', require('./menu_manager.js'));
//End routing different controllers

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
// define the home page route
router.get('/', function (req, res) {
  User.count({}, function(err, total_user){
    Page.count({}, function(err, total_page){
      ImageAlbum.count({}, function(err, total_album){
        Menu.count({}, function(err, total_menu){
          res.render('admin/template',{
            page_name: 'dashboard',
            page_title: 'Dashboard',
            total_user: total_user,
            total_page: total_page,
            total_album: total_album,
            total_menu: total_menu
          });
        });

      })

    });

  });

});
// define the about route
router.get('/login', function (req, res) {
  User.count({},function(err,c){
    //checking if user table is empty, then inserting a dummy user
      if(!c){
        var currentDate = new Date();

        bcrypt.hash("123456", 10, function(err, hash) {
          var sample_user = User({
              email: "admin@example.com",
              firstName: "Administrator",
              lastName: "",
              password: hash,
              created_at: currentDate,
              updated_at: currentDate,
              active: true
          });
          // save the user
          sample_user.save(function(err) {
            if (err) throw err;

            console.log('Sample User created!');
          });
        });

      }
  });
  res.render('admin/login',{page_title: 'Login'});
});

router.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({email: email}, function(err, usr){

    if (err) throw err;
    if(usr){
      bcrypt.compare(password, usr.password, function(err, pwcmp) {
          if(pwcmp == true){
            req.session.user_email = usr.email;
            req.session.user_firstName = usr.firstName;
            req.session.user_id = usr._id;
            console.log('Successfully LoggedIn!');
            res.redirect('/admin');
          }else{
            res.render('admin/login',{page_title: 'Login', page_alert: "Wrong Password! Please Try Again.", page_alert_type: "error"});
          }
      });

    }else{
      res.render('admin/login',{page_title: 'Login', page_alert: "User not found!", page_alert_type: "error"});
    }
  });

});

router.get('/logout', function (req, res) {
  req.session.destroy(function(err) {
    console.log("Successfully Logged Out!");
    res.redirect('/admin/login');
  })
});

module.exports = router
