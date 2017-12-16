$(document).ready(function(){

  var per_page = 1;
  var pageno = getParameterByName('pageno');
  if(!pageno || isNaN(pageno)){
    pageno = 0;
  }
  var offset = per_page * pageno;

  getPageList("Blogs",per_page,offset,function(data){
    var blog_list = "";
    data.forEach(function(blog){
      if(blog.featured_image){
        var featured_image = 'uploads/'+blog.featured_image;
      }else{
        var featured_image = 'assets/img/slide-1.jpg';
      }

      blog_list += '<div class="bg-faded p-4 my-4">'+
        '<div class="card card-inverse" style="background-image:url('+featured_image+')">'+
          '<div class="card-img-overlay bg-overlay text-white text-shadow">'+
            '<h2 class="card-title text-shadow text-white text-uppercase mb-0">'+blog.title+'</h2>'+
            '<h4 class="text-shadow text-white">'+blog.created_at+'</h4>'+
            '<p class="lead card-text text-shadow text-white d-none d-lg-block">'+blog.description.trim().replace(/<(?:.|\n)*?>/gm, '').substring(0,300)+'...</p>'+
            '<a href="blog_detail.html?alias='+blog.alias+'" class="btn btn-secondary">Read More</a>'+
          '</div>'+
        '</div>'+
      '</div>';
    });

    $("#blog_list").append(blog_list);


    getPageCount("Blogs",function(data){
      var  total_records = data.total_records
      if(total_records > per_page){
        var total_pages = total_records/per_page;
        total_pages = Math.ceil(total_pages);
        var pagination = getPagination(total_pages,pageno,"blog.html");
        $("#pagination").html(pagination);
      }else{
        $("#pagination").hide();
      }

    });
  });




});
