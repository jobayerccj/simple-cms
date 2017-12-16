$(document).ready(function(){
    getImagesByAlbum("Home","Slideshow",function(data){
      var slide_controller = "";
      var slide_images = "";
      var i = 0;

      //START OF LOOP
      data.forEach(function(img){
        var active_class = "";
        if(i == 0){
          active_class = "active";
        }
        slide_controller += '<li data-target="#carouselExampleIndicators" data-slide-to="'+i+'" class="a '+active_class+'"></li>';

        slide_images += '<div class="carousel-item '+active_class+'">'+
          '<img class="d-block img-fluid w-100" src='+server_url+'uploads/images/'+img.name+' alt="">'+
          '<div class="carousel-caption d-none d-md-block">'+
            '<h3 class="text-shadow">'+img.title+'</h3>'+
          '</div>'+
        '</div>';
        i++;
      });
      //END OF LOOP

      var slideshow = '<ol class="carousel-indicators">'+slide_controller+'</ol>'+'<div class="carousel-inner" role="listbox">'+slide_images+'</div>';
      var controller = '<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">'+
        '<span class="carousel-control-prev-icon" aria-hidden="true"></span>'+
        '<span class="sr-only">Previous</span>'+
      '</a>'+
      '<a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">'+
        '<span class="carousel-control-next-icon" aria-hidden="true"></span>'+
        '<span class="sr-only">Next</span>'+
      '</a>';

      slideshow = slideshow + controller;
      $("#carouselExampleIndicators").html(slideshow);
    });


    getPageByAlias("home-content-1",function(data){
      $("#home_content_1_title").html(data.title);
      $("#home_content_1_body").html(data.description);
    });

    getPageByAlias("home-content-2",function(data){
      $("#home_content_2_title").html(data.title);
      $("#home_content_2_body").html(data.description);
    });

    getMenuByName("Header",function(data){

      var main_menu = "";

      if(data.length){
        main_menu = '<ul class="navbar-nav mx-auto">';

        $(data).each(function(i, menu_item){
          main_menu += '<li class="nav-item active px-lg-4">' +
                          '<a class="nav-link text-uppercase text-expanded" href="'+ menu_item.pages.link +'">'+ menu_item.pages.name +'</a>'+
                        '</li>';
        });

        main_menu +="</ul>"
      }

      $("#navbarResponsive").html(main_menu);
    });

});
