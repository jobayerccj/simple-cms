$(document).ready(function(){

  getSettingSingle('contact_page_map', function(data){
    $("#contact_map1").html(data);
  });

  getSettingSingle('contact_phone_1', function(data){
    $("#contact_phone1").html(data);
  });

  getSettingSingle('contact_email', function(data){
    $("#contact_email1").html('<a href="mailto:'+ data +'">'+ data + '</a>');
  });

  getSettingSingle('contact_address', function(data){
    $("#contact_address1").html('<p>'+ data+ '</p>');
  });

  $("#contact_form1").on('submit', function(e){
    e.preventDefault();

    var name = $("input[name=username]").val();
    var email = $("input[name=email]").val();
    var phone = $("inout[name=phone]").val();
    var message = $("textarea[name=message]").val();

    submitContactData(name,email,phone,message,function(data){
      if(data['result'] == 'error'){
        var errors = "";
          data['error_list'].forEach(function(item){
            errors += '<li>' + item.msg + '</li>'
          });

          $("#submit_result").html('<ul class="alert alert-danger">'+ errors + '</ul>');
          console.log(data);
      }else{
          console.log(data);
        $("#contact_form1").hide();
        $("#submit_result").html("<h4 class='text-center'>Thank you for your message, we will contact with you shortly.</h4>");
      }

    });


  });
});
