$(document).ready(function(){
  getPageByAlias("about-us",function(data){
    $("#about_title").html(data.title);
    $("#about_text").html(data.description);
    $("#about_img").html('<img class="img-fluid mb-4 mb-lg-0" src="admin/assets/admin/uploads/'+data.featured_image+'">');
  });


  getImagesByAlbum("Our Team","Team",function(data){

    var team = "";
    //START OF LOOP
    data.forEach(function(img){
      team += '<div class="col-md-4 mb-4 mb-md-0">' +
        '<div class="card h-100">' +
          '<img class="card-img-top" src="admin/assets/admin/uploads/images/'+img.name+'" alt="">' +
          '<div class="card-body text-center">' +
            '<h4 class="card-title m-0">'+img.title +
              ' | <small class="text-muted">'+img.description+'</small>' +
            '</h4>' +
          '</div>' +
        '</div>' +
      '</div>';
    });

    $("#our_team").html(team);

  });

});
