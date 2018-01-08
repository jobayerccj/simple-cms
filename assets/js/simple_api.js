//var api_url = "http://localhost:3000/simple_api/";
if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
  var api_url = "http://localhost:3000/simple_api/";
}else {
  var api_url = "http://ec2-34-207-169-217.compute-1.amazonaws.com:3000/simple_api/";
}

//This function fetches images. input is name of album and category name which is optional
var getImagesByAlbum = function(album_name,cat_name,callback){
  $.ajax({
    url:api_url+"get_images_by_album",
    type:"get",
    data: {album_name:album_name,cat_name:cat_name},
    dataType : "json",
    crossDomain : true,
    success: function(result){
      callback(result.images);
    }
  });
}

//This function fetches images. input is category name
var getImagesByCat = function(cat_name,callback){
  $.ajax({
    url:api_url+"get_images_by_cat",
    type:"get",
    data: {cat_name:cat_name},
    dataType : "json",
    crossDomain : true,
    success: function(result){

      callback(result);
    }
  });
}

//This function fetches page content. Input is page alias
var getPageByAlias = function(page_alias,callback){
  $.ajax({
    url:api_url+"get_page_by_alias",
    type:"get",
    data: {page_alias: page_alias},
    dataType : "json",
    crossDomain : true,
    success: function(result){

      callback(result);
    }
  });
}


//This function fetches menu (only parent menu)
var getMenuByName = function(menu_name, callback){
  $.ajax({
    url:api_url+"get_menu_by_name",
    type:"get",
    data: {menu_name: menu_name},
    dataType : "json",
    crossDomain : true,
    success: function(result){
      callback(result);
    }
  });
}

var getSubmenu = function(main_menu_name, parent_menu_name, callback){
  $.ajax({
    url:api_url+"get_submenu_by_name",
    type:"get",
    data: {main_menu_name: main_menu_name, parent_menu_name: parent_menu_name},
    dataType : "json",
    crossDomain : true,
    success: function(result){
      callback(result);
    }
  });
}

//fetch pages based on category. also limit and offset can be passed, useful for pagination
var getPageList = function(cat_name,limit,offset,callback){
  if(!limit){
    limit = 3;
  }

  if(!offset){
    offset = 0;
  }
  $.ajax({
    url:api_url+"get_page_list_by_cat",
    type:"get",
    data: {cat_name: cat_name, limit: limit, offset: offset},
    dataType : "json",
    crossDomain : true,
    success: function(result){
      callback(result);
    }
  });
}
// Get count of pages under a category
var getPageCount = function(cat_name,callback){

  $.ajax({
    url:api_url+"get_page_count_by_cat",
    type:"get",
    data: {cat_name: cat_name},
    dataType : "json",
    crossDomain : true,
    success: function(result){
      callback(result);
    }
  });
}

var submitContactData = function(name,email,phone, message,callback){

  $.ajax({
    url:api_url+"submit_contact_data",
    type:"get",
    data: {name: name, email: email, phone: phone, message: message},
    dataType : "json",
    crossDomain : true,
    success: function(result){
      callback(result);
    }
  });
}
//Return setting value. Input is setting nage
var getSettingSingle = function(set_name, callback){

  $.ajax({
    url:api_url+"get_single_setting",
    type:"get",
    data: {set_name: set_name},
    dataType : "json",
    crossDomain : true,
    success: function(result){
      callback(result.result);
    }
  });
}
//Return all settings
var getSettingAll = function(callback){
  $.ajax({
    url:api_url+"get_setting_all",
    type:"get",
    data: {},
    dataType : "json",
    crossDomain : true,
    success: function(result){
      callback(result.result);
    }
  });
}
