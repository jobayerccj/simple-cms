
var exports = module.exports = {};
var DBCategory = require('../models/admin/category.js');
var DBImages = require('../models/admin/image_album.js');
var DBImgCat = require('../models/admin/img_category.js');
var DBPages = require('../models/admin/page.js');
var DBMenus = require('../models/admin/menu.js');
var DBSetting = require('../models/admin/settings.js');

var nodemailer = require('nodemailer');

//get images by category name
exports.getImagesByCat = function(cat_name,limit,offset){
	return DBImages.aggregate([{$match:{category_name:cat_name}},{$unwind:"$images"},{$project:{images:1,_id:0}}]);
	//return DBImages.find({category_name:cat_name},{images:1,_id:0}).lean();
}

//get list of image categories
exports.imageCategories = function(){
	return DBImgCat.find({}).lean();
}

exports.getAlbumsByCat = function(cat_name){
	return DBImages.find({category_name:cat_name},{}).lean();
}

//Only first parameter is mandatory
exports.getImagesByAlbum = function(album_name,cat_name,limit,offset){
	//DBImages.aggregate([{$match:{album_name:album_name,category_name:cat_name}},{$unwind:"$images"},{$project:{_id:0}}]);
	if(cat_name){
		var data = {album_name:album_name, category_name:cat_name};
	}else{
		var data = {album_name:album_name};
	}
	return DBImages.findOne(data,{images:1,_id:0}).lean();
}

exports.getPagesByCat = function(cat_name,limit,offset){

	return DBPages.find({category:cat_name}).skip(parseInt(offset)).limit(parseInt(limit)).lean();
}

exports.getPageCategories = function(){
	return DBCategory.find({}).lean();
}

exports.getPageSingle = function(page_alias){
	return DBPages.findOne({alias:page_alias}).lean();
}

exports.getPageCountByCat = function(cat_name){
	return DBPages.count({category:cat_name}).lean();
}

exports.getSettingSingle = function(set_name){
	return DBSetting.findOne({setName:set_name}).lean();
}

exports.getSettingAll = function(){
	return DBSetting.find().lean();
}

exports.getEmailSetting = function(){
	return DBSetting.find({ $or: [ { setName: 'smtp_port' }, { setName: 'smtp_host' }, { setName: 'smtp_user' },{ setName: 'smtp_pass' },{ setName: 'email_noti' } ] }).lean();
}

exports.getMenuByName = function(menu_name){
	//DBImages.aggregate([{$match:{album_name:album_name,category_name:cat_name}},{$unwind:"$images"},{$project:{_id:0}}]);
	//return DBMenus.findOne({name:menu_name, pages: {$elemMatch: {parent_id: 0}}}).lean();
	return DBMenus.aggregate(
		[
			{
				$match:{name:menu_name}
			},
			{
				$unwind:"$pages"
			},
			{
				$project: {_id:0, pages:1}
			},
			{
				$match: { "pages.parent_id": "0"}
			}
			/*,
			{
				$addFields: {page_list: {$objectToArray: "$pages"}}},
			{
				$unwind:"$page_list"
			}*/
		]);
}


exports.getSubMenu = function(main_menu_name, parent_menu_name){

	return DBMenus.aggregate(
		[
			{
				$match:{name:main_menu_name}
			},
			{
				$unwind:"$pages"
			},
			{
				$project: {_id:0, pages:1}
			},
			{
				$match: { "pages.parent_id": main_menu_name}
			}

		]);
}

exports.submitContactData = function(name, email, phone, message, settings_data){


	nodemailer.createTestAccount((err, account) => {

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
          host: settings_data['host'],
          port: settings_data['port'],
          auth: {
              user: settings_data['user'],
              pass: settings_data['pass']
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"'+ name +'" <'+ email +'>', // sender address
          to: settings_data['email_noti'], // list of receivers
          subject: 'Want to contact', // Subject line
          text: message, // plain text body
          //html: '<b></b>' // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }

          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          transporter.close();
          return info;

      });
  });
	//return DBPages.count({category:name}).lean();
}


// eoKUjOPazQ8R
