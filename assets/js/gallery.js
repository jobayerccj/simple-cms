$(document).ready(function(){


  getImagesByCat("Gallery",function(data){
    var thumbs = "";
    data.forEach(function(img){
      thumbs += '<div class="col-lg-3 col-md-4 col-xs-6">'+
        '<a href="uploads/images/'+img.name+'" data-fancybox class="d-block mb-4 h-100">'+
          '<img class="img-fluid img-thumbnail" src="uploads/images/thumbs/'+img.name+'" alt="">'+
        '</a>'+
      '</div>';
    });

    $("#gallery_images").html(thumbs);
  });


});
