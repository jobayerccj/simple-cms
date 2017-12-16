var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var adminController = require('./controllers/admin/index.js');
var frontController = require('./controllers/index.js');
var apiHelper = require('./controllers/simple_api.js');

app.set('view engine','ejs');

app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

app.use('/admin', adminController);

app.use('/simple_api', apiHelper);

app.use('/', adminController);



/*app.get('/',function(req,res){
  //res.send("This is Front Page!");

  commonHelper.getPageCategories().exec(function(err,data){
    res.send(data);
  });

});*/



app.listen(3000);
console.log('Listening to port 3000');
