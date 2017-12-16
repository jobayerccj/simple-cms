$(document).ready(function(){
  var alias = getParameterByName('alias');
  if(!alias){
    location.href = 'blog.html';
  }
  getPageByAlias(alias,function(blog){

    if(blog.featured_image){
      var featured_image = '<img style="max-width:50%;float:left;margin-right:20px" src="uploads/'+blog.featured_image+'" />';
      $("#blog_image").prepend(featured_image);
    }

    $("#blog_title").html(blog.title);
    $("#blog_date").html(blog.created_at);
    $("#blog_text").html(blog.description);
  });




});
