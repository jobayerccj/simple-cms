//var server_url = "//ec2-35-153-200-43.compute-1.amazonaws.com:3000/";
if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
  var server_url = "http://localhost:3000/";
}else {
  var server_url = "//ec2-35-153-200-43.compute-1.amazonaws.com:3000/";
}

$(document).ready(function(){
  getMenuByName("Header",function(data){
    //console.log(data[0].pages.name);
    var main_menu = "";

    if(data.length){
      main_menu = '<ul class="navbar-nav mx-auto">';

      $(data).each(function(i, menu_item){
        main_menu += '<li class="nav-item px-lg-4">' +
                        '<a class="nav-link text-uppercase text-expanded" href="'+ menu_item.pages.link +'">'+ menu_item.pages.name +'</a>'+
                      '</li>';
      });

      main_menu +="</ul>"
    }

      $("#navbarResponsive").html(main_menu);


      var path = window.location.pathname;
      path = path.replace(/\/$/, "");
      path = decodeURIComponent(path);

      $("#navbarResponsive li").each(function () {

          var href = $(this).find("a.nav-link").attr('href');

          if (path.indexOf(href) != -1 ) {
              $(this).addClass('active');
          }
      });

      getSettingSingle("copywrite_text",function(data){
        $("footer").html('<div class="container"><p>'+data+'</p></div>');
      });
  });


});



//Helper function to retrieve url paramater

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getPagination(total_page,current_page,page_name){
  total_page = parseInt(total_page);
  current_page = parseInt(current_page);
  if(total_page > current_page+1){
    var previous_disable = 'disabled';
    var previous_link = '#';
    var next_disable = '';
    var next_page = current_page + 1;
    var next_link = page_name+'?pageno='+next_page;
  }else{
    var previous_disable = '';
    var previous_page = current_page - 1;
    var previous_link = page_name+'?pageno='+previous_page;
    var next_disable = 'disabled';
    var next_link = '#';
  }
  var pagination = '<ul class="pagination justify-content-center mb-0">'+
    '<li class="page-item '+previous_disable+'">'+
      '<a class="page-link" href="'+previous_link+'">&larr; Older</a>'+
    '</li>'+
    '<li class="page-item '+next_disable+'">'+
      '<a class="page-link" href="'+next_link+'">Newer &rarr;</a>'+
    '</li>'+
  '</ul>';

  return pagination;
}
