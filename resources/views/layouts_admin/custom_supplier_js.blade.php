<script>

function    fetch_tele(tele,response_id,url) {
//  alert(tele);
if (tele >= 0) {
   jQuery(document).ready(function() {
      $.ajaxSetup({
            headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                     }
              });

     jQuery.ajax({
            url: url,
            method: 'post',
            data: {
                tele: tele,
            },
            success: function(result) {
            // alert(result.Code);
  document.getElementById(response_id).innerHTML = result.Code;
  // jQuery('#'+response_id).val(result.Code);

                    }

           
        });

    });

} else {

    jQuery('#danger').hide('100');
    jQuery('#warning').hide();
    jQuery('#success').hide('100');
}

}


function get_other_value(value,response_id)
{

 if(value == 919)
 {
document.getElementById('international_name').style.display= "block";
document.getElementById('strength_unit').style.display= "block";

 }
 else {
document.getElementById('international_name').style.display= "none";
document.getElementById('strength_unit').style.display= "none";

 }

}

	 $('#print_dec').click(function () {
         var divName = 'print_decleration';
        
     var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;
         document.body.innerHTML = printContents;
        // window.open(printContents);
         window.print();
         document.body.innerHTML = originalContents;
	    // window.location="{{ url('/invoice') }}";

          
});







function Delete_composition(id)
                {

           var product_composition_id =  id;
           var application_id = document.getElementById('generated_application_id').value;
              if (confirm("Are sure you want to delete this row with ID="+id) == true) {} else { return false;}


                      $.ajax({
            
                        data:{ 
                          id:id,
                          application_id:application_id,
                              },
                        url: "{{   url('/product_composition/delete')   }}",
                        type: "DELETE",
                        dataType: 'json',
                        success: function (data) {
                     if(data.Message == true)  
                         {
                          var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              document.getElementById('renderd_product_composition_table').innerHTML = data.renderd_product_composition_table;
                  document.getElementById('name_inn_text_composition').value='';
                  document.getElementById('quantity_composition').value='';
                  document.getElementById('reason_inclusion_composition').value='';
                  document.getElementById('reference_standard_composition').value='' ;
                  document.getElementById('composition_type_composition').value ='';
                 
                  document.getElementById('product_trade_name').value;
                  document.getElementById('createNewCompostion_save').style.display = "none";
                  document.getElementById('createNewCompostion_update').style.display = "none";
              toastr.error("Product composition  with ID"+ id + "successfully removed from your system")
                         } 
                           },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
 }


  function Delete_Manufacturer(id)
  {


          var product_manufacturer_id =  id;
           var application_id = document.getElementById('generated_application_id').value;
              if (confirm("Are sure you want to delete this row with Id "+id) == true) {} else { return false;}

           $.ajax({
                     data:{ 
                          id:id,
                          application_id:application_id,
                              },
                        url: "{{   url('/product_manufacturer/delete')   }}",
                        type: "DELETE",
                        dataType: 'json',
                        success: function (data) {
                          
                     if(data.Message == true)  
                         {
                          var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
                 
              document.getElementById('renderd_manufacturer_table').innerHTML = data.renderd_product_manufacturer_table;
             
              toastr.error("Product Manufacturer  with ID"+ id + "successfully removed from your system")
            
                         } 
                         else if(data.Message == false)  
                         {
                  document.getElementById('name_inn_text_composition').value='';
                  document.getElementById('quantity_composition').value='';
                  document.getElementById('reason_inclusion_composition').value='';
                  document.getElementById('reference_standard_composition').value='' ;
                  document.getElementById('composition_type_composition').value ='';
                  document.getElementById('createNewCompostion_save').style.display = "block";
                  document.getElementById('createNewCompostion_update').style.display = "none";
                          document.getElementById('renderd_manufacturer_table').innerHTML = "";
                          //  toastr.error("Product Manufacturer  with ID"+ id + "successfully removed from your system")

                         }
                           },
                        error: function (data) {
                         
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });



  }



















              
 function  check_trade_name(trade_name)
        {
    document.getElementById('css_country').disabled=false;
    document.getElementById('cs_city').disabled=false;
    document.getElementById('cs_state').disabled=false;
    document.getElementById('cs_address_line_one').disabled=false;
    document.getElementById('cs_address_line_two').disabled = false;
    document.getElementById('cs_email').disabled = false;
    document.getElementById('cs_tele').disabled = false;
    document.getElementById('cs_website_url').disabled = false;
     
     // Set Element  to Disabled  
    document.getElementById('css_country').value='';
    document.getElementById('cs_city').value = '';
    document.getElementById('cs_state').value = '';
    document.getElementById('cs_address_line_one').value = '';
    document.getElementById('cs_address_line_two').value = '';
    document.getElementById('cs_email').value = '';
    document.getElementById('cs_tele').value = '';
    document.getElementById('cs_website_url').value = '';






            if(trade_name != '')
            {
        //$(this).html('Save');
        $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ trade_name: trade_name,},
          url: "{{   route('company_supplier')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {
              document.getElementById('css_country').value =  data.country_id ;
                //document.getElementById('css_country').disabled = true;
               // document.getElementById('cs_city').value=data.city;
               //document.getElementById('cs_city').disabled=true;
                 document.getElementById('cs_state').value=data.state;
             //document.getElementById('cs_state').disabled=true;
             //document.getElementById('cs_address_line_one').value=data.address_line_one;
             // document.getElementById('cs_address_line_one').disabled=true;
             // document.getElementById('cs_address_line_two').value = data.address_line_two;
             //  document.getElementById('cs_address_line_two').disabled = true;
             // document.getElementById('cs_email').value = data.email;
             //  document.getElementById('cs_email').disabled = true;
             //  document.getElementById('postal_code').value = data.postal_code;
              //document.getElementById('postal_code').disabled = true;

              document.getElementById('cs_response_tele').innerHTML = data.International_dialing;
        
              //document.getElementById('cont_response_tele').disabled = true;

              //document.getElementById('cs_tele').value = data.telephone ;
             // document.getElementById('cs_tele').disabled = true;

              //document.getElementById('cs_website_url').value =data.webiste_url;
             // document.getElementById('cs_website_url').disabled = true;

          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });
            }
  }



         
         function  check_trade_agent_name(trade_name)
        {
    document.getElementById('ag_country').disabled=false;
    document.getElementById('ag_city').disabled=false;
    document.getElementById('ag_state').disabled=false;
    document.getElementById('ag_address_line_one').disabled=false;
    document.getElementById('ag_address_line_two').disabled = false;
    document.getElementById('ag_email').disabled = false;
    document.getElementById('ag_tele').disabled = false;
    document.getElementById('ag_website_url').disabled = false;
     
     // Set Element  to Disabled  
    document.getElementById('ag_country').value='';
    document.getElementById('ag_city').value = '';
    document.getElementById('ag_state').value = '';
    document.getElementById('ag_address_line_one').value = '';
    document.getElementById('ag_address_line_two').value = '';
    document.getElementById('ag_email').value = '';
    document.getElementById('ag_tele').value = '';
    document.getElementById('ag_website_url').value = '';






            if(trade_name != '')
            {
        //$(this).html('Save');
        $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ trade_name: trade_name,},
          url: "{{   route('agent_info')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {
                document.getElementById('ag_country').value =  data.country_id ;
                document.getElementById('ag_country').disabled = true;
                document.getElementById('ag_city').value=data.city;
                document.getElementById('ag_city').disabled=true;
                document.getElementById('ag_state').value=data.state;
                document.getElementById('ag_state').disabled=true;
                document.getElementById('ag_address_line_one').value=data.address_line_one;
                document.getElementById('ag_address_line_one').disabled=true;
                document.getElementById('ag_address_line_two').value = data.address_line_two;
                document.getElementById('ag_address_line_two').disabled = true;
                document.getElementById('ag_email').value = data.email;
                document.getElementById('ag_email').disabled = true;
                document.getElementById('ag_postal_code').value = data.postal_code;
                document.getElementById('ag_postal_code').disabled = true;
                document.getElementById('age_response_tele').innerHTML = data.International_dialing;
                //document.getElementById('age_reponse_tele').disabled = true;
                document.getElementById('ag_tele').value = data.telephone ;
                document.getElementById('ag_tele').disabled = true;
                document.getElementById('ag_website_url').value =data.webiste_url;
                document.getElementById('ag_website_url').disabled = true;

          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });
            }
  }








































































  $(function () {
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
    }); 
    

  $('#DHL').click(function () {

if(document.getElementById('LINK').checked == true){ document.getElementById('LINK').checked=false;}
document.getElementById('dossier_sample_id').style.display="block"; 
document.getElementById('sample').style.display="none";
document.getElementById('dossier_id').style.display="none";
document.getElementById('lable_dossier_link').style.display="none";
document.getElementById('sample_status').style.display="none";
});




  $('#LINK').click(function () {

if(document.getElementById('DHL').checked == true){ document.getElementById('DHL').checked=false;} else if(document.getElementById('DHL').checked == false) { }
document.getElementById('lable_dossier_link').style.display="block";
document.getElementById('dossier_sample_id').style.display="block"; 
document.getElementById('sample').style.display="block";
document.getElementById('dossier_id').style.display="block";
document.getElementById('sample_status').style.display="block";
  });








    $('#confirm_finish').click(function () {

  var id = setInterval(confirm, 200);
              function confirm() {
              window.location = "/dossier_sample_status";
              clearInterval(id);
              }

    });

 $('#new_applicant').click(function () {
    if( document.getElementById('new_applicant').checked==true) 
    {var m = true;console.log(m);}
    $('#General_Supplier').show();
    $('#cs_tradename_exits').hide();
    $('#cs_save').show();
    $('#cs_trade_name').show();
   

    
    //Set Value to Null
   document.getElementById('css_country').disabled=false;
    document.getElementById('cs_city').disabled=false;
    document.getElementById('cs_state').disabled=false;
    document.getElementById('cs_address_line_one').disabled=false;
    document.getElementById('cs_address_line_two').disabled = false;
    document.getElementById('cs_email').disabled = false;
    document.getElementById('postal_code').disabled = false;
    document.getElementById('cont_response_tele').disabled= false;
    document.getElementById('cs_tele').disabled = false;
    document.getElementById('cs_website_url').disabled = false;
     
     // Set Element  to Disabled  
    document.getElementById('css_country').value='';
    document.getElementById('cs_city').value = '';
    document.getElementById('cs_state').value = '';
    document.getElementById('cs_address_line_one').value = '';
    document.getElementById('cs_address_line_two').value = '';
    document.getElementById('cs_email').value = '';
    document.getElementById('postal_code').value=''
    document.getElementById('cont_response_tele').innerHTML= '';
    document.getElementById('cs_tele').value = '';
    document.getElementById('cs_website_url').value = '';



});  
    
    $('#old_applicant').click(function () 
    {
    $('#General_Supplier').show();
    $('#application_wizard').show();
    $('#cs_tradename_exits').show();
    $('#cs_trade_name').hide();
    $('#cs_save').show();



    });
    

    $('#product_composition').click(function () 
    {
   document.getElementById('composition_pro').style.display="block";
   document.getElementById('product_manufacturers_api_wizard').style.display="none";
   document.getElementById('product_manufacturers_wizard').style.display="none";
   document.getElementById('Agent_wizard').style.display="none";
   document.getElementById('supplier_wizard').style.display="none";
   document.getElementById('product_details_wizard').style.display="none";
   document.getElementById('type_application').style.display="none";
   document.getElementById('dossier_sample_wizard').style.display="none";
   document.getElementById('decleration_wizard').style.display="none";
  });
 

  $('#product_manufacturers_api').click(function () 
    {
   document.getElementById('product_manufacturers_api_wizard').style.display="block";
   document.getElementById('composition_pro').style.display="none";
   document.getElementById('Agent_wizard').style.display="none";
   document.getElementById('supplier_wizard').style.display="none";
   document.getElementById('product_details_wizard').style.display="none";
   document.getElementById('type_application').style.display="none";
   document.getElementById('dossier_sample_wizard').style.display="none";
   document.getElementById('decleration_wizard').style.display="none";
  });


$('#product_manufacturers').click(function () 
    {
   document.getElementById('product_manufacturers_wizard').style.display="block";
   document.getElementById('composition_pro').style.display="none";
   document.getElementById('product_manufacturers_api_wizard').style.display="none";
   document.getElementById('Agent_wizard').style.display="none";
   document.getElementById('supplier_wizard').style.display="none";
   document.getElementById('product_details_wizard').style.display="none";
   document.getElementById('type_application').style.display="none";
   document.getElementById('dossier_sample_wizard').style.display="none";
   document.getElementById('decleration_wizard').style.display="none";
  });
 


$('#Agent').click(function () 
    {
      document.getElementById('Agent_wizard').style.display="block";
      document.getElementById('product_manufacturers_wizard').style.display="none";
   document.getElementById('composition_pro').style.display="none";
   document.getElementById('product_manufacturers_api_wizard').style.display="none";
   document.getElementById('supplier_wizard').style.display="none";
   document.getElementById('product_details_wizard').style.display="none";
   document.getElementById('type_application').style.display="none";
   document.getElementById('dossier_sample_wizard').style.display="none";
   document.getElementById('decleration_wizard').style.display="none";
  });



  $('#supplier').click(function () 
    {
      document.getElementById('supplier_wizard').style.display="block";
      document.getElementById('Agent_wizard').style.display="none";
      document.getElementById('product_manufacturers_wizard').style.display="none";
   document.getElementById('composition_pro').style.display="none";
        document.getElementById('product_manufacturers_api_wizard').style.display = "none";
        document.getElementById('product_details_wizard').style.display="none";
   document.getElementById('type_application').style.display="none";
   document.getElementById('dossier_sample_wizard').style.display="none";
   document.getElementById('decleration_wizard').style.display="none";
  });



  $('#product_details').click(function () 
    {   document.getElementById('product_details_wizard').style.display="block";
      document.getElementById('supplier_wizard').style.display="none";
      document.getElementById('Agent_wizard').style.display="none";
      document.getElementById('product_manufacturers_wizard').style.display="none";
   document.getElementById('composition_pro').style.display="none";
        document.getElementById('product_manufacturers_api_wizard').style.display = "none";
        document.getElementById('type_application').style.display="none";
   document.getElementById('dossier_sample_wizard').style.display="none";
   document.getElementById('decleration_wizard').style.display="none";
  });


  $('#Application_Type').click(function () 
    {
      document.getElementById('type_application').style.display="block";
      document.getElementById('product_details_wizard').style.display="none";
      document.getElementById('supplier_wizard').style.display="none";
      document.getElementById('Agent_wizard').style.display="none";
      document.getElementById('product_manufacturers_wizard').style.display="none";
   document.getElementById('composition_pro').style.display="none";
        document.getElementById('product_manufacturers_api_wizard').style.display = "none";
        document.getElementById('dossier_sample_wizard').style.display="none";
   document.getElementById('decleration_wizard').style.display="none";
  });



 $('#dossier_sample').click(function () 
    {
      
      document.getElementById('dossier_sample_wizard').style.display="block";
      document.getElementById('type_application').style.display="none";
      document.getElementById('product_details_wizard').style.display="none";
      document.getElementById('supplier_wizard').style.display="none";
      document.getElementById('Agent_wizard').style.display="none";
      document.getElementById('product_manufacturers_wizard').style.display="none";
      document.getElementById('composition_pro').style.display="none";
        document.getElementById('product_manufacturers_api_wizard').style.display = "none";
        document.getElementById('decleration_wizard').style.display="none";

  });



 $('#decleration').click(function () 
    {
      document.getElementById('decleration_wizard').style.display="none";
      document.getElementById('decleration_wizard').style.display="none";
      document.getElementById('type_application').style.display="none";
      document.getElementById('dossier_sample_wizard').style.display="block";
      document.getElementById('product_details_wizard').style.display="none";
      document.getElementById('supplier_wizard').style.display="none";
      document.getElementById('Agent_wizard').style.display="none";
      document.getElementById('product_manufacturers_wizard').style.display="none";
      document.getElementById('composition_pro').style.display="none";
        document.getElementById('product_manufacturers_api_wizard').style.display = "none";
    });













$('#save_agent_info').click(function () {
     //From New Supplier
    var ag_trade_name =  document.getElementById('ag_trade_name').value;
    var ag_country =     document.getElementById('ag_country').value ;
    var ag_postal_code = document.getElementById('ag_postal_code').value;
    var ag_city = document.getElementById('ag_city').value ;
    var ag_state = document.getElementById('ag_state').value ;
    var ag_address_line_one =  document.getElementById('ag_address_line_one').value ;
    var ag_address_line_two = document.getElementById('ag_address_line_two').value ;
    var ag_email = document.getElementById('ag_email').value ;
    var ag_tele = document.getElementById('ag_tele').value ;
    var ag_website_url = document.getElementById('ag_website_url').value ;
  
        //Contact Supplier Full Information
    var cont_ag_first_name  = document.getElementById('cont_ag_first_name').value ;
    var cont_ag_middle_name = document.getElementById('cont_ag_middle_name').value ;
    var cont_ag_last_name  = document.getElementById('cont_ag_last_name').value ;
    var cont_ag_country_id  = document.getElementById('cont_ag_country_id').value ;
    var cont_ag_city  = document.getElementById('cont_ag_city').value ;
    var cont_ag_address_line_one = document.getElementById('cont_ag_address_line_one').value ;
    var cont_ag_address_line_two = document.getElementById('cont_ag_address_line_two').value ;
    var cont_ag_email = document.getElementById('cont_ag_email').value ;
    var cont_ag_tele = document.getElementById('cont_ag_tele').value ;
    //var cont_ag_webiste_url = document.getElementById('cont_ag_webiste_url').value ;
    var cont_ag_position = document.getElementById('cont_ag_position').value ;
    var application_id = document.getElementById('generated_application_id').value;


    var user_id = document.getElementById('user_id').value ;

 $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ 
              trade_name: ag_trade_name,
              country_id: ag_country,
              city: ag_city,
              state: ag_state,
              address_line_one: ag_address_line_one,
              address_line_two: ag_address_line_two,
              country_code:+291,
              telephone:ag_tele,
              email:ag_email,
              webiste_url:ag_website_url,
              postal_code:12,
              user_id: user_id,
              application_id:application_id,

              //From Supplier Information
              first_name:cont_ag_first_name,
              middle_name:cont_ag_middle_name,
              last_name:cont_ag_last_name,
              country_id_contact:cont_ag_country_id,
              position:cont_ag_position ,
              city_contact:cont_ag_city,
              address_line_one_contact:cont_ag_address_line_one,
              address_line_two_contact:cont_ag_address_line_two,
              postal_code:12,
              telephone_contact:cont_ag_tele,
             // webiste_url_contact:cont_ag_webiste_url,
              email_contact:cont_ag_email,
              contact_type:'Agent',
              
              },
          url: "{{  url('/agent_save')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {

           if(data.AgentInfo==true)  
           {

            $('#ag_save').hide();
            $('#ag_update').show();
            document.getElementById('agent_next_button').disabled = false;
            
document.getElementById('agent_contact_id').value =data.Contact_ID;
document.getElementById('agent_id').value =data.Agent_ID;
     

      var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.success("New Agent and New Contacts  Has been Added")

           } 
           else
           {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    });
 toastr.error(data.AgentInfo.errorInfo[2])
}
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });
    });






 $('#update_agent_info').click(function () {
     
     //From New Supplier

var ag_trade_name =  document.getElementById('ag_trade_name').value;
var ag_country =     document.getElementById('ag_country').value ;
var ag_postal_code = document.getElementById('ag_postal_code').value;
var ag_city = document.getElementById('ag_city').value ;
var ag_state = document.getElementById('ag_state').value ;
var ag_address_line_one =  document.getElementById('ag_address_line_one').value ;
var ag_address_line_two = document.getElementById('ag_address_line_two').value ;
var ag_email = document.getElementById('ag_email').value ;
var ag_tele = document.getElementById('ag_tele').value ;
var ag_website_url = document.getElementById('ag_website_url').value ;
var age_tele_code = document.getElementById('age_response_tele').innerHTML ;
ag_tele = ag_tele+age_tele_code;


  //Contact Supplier Full Information
var cont_ag_first_name  = document.getElementById('cont_ag_first_name').value ;
var cont_ag_middle_name = document.getElementById('cont_ag_middle_name').value ;
var cont_ag_last_name  = document.getElementById('cont_ag_last_name').value ;
var cont_ag_country_id  = document.getElementById('cont_ag_country_id').value ;
var cont_ag_city  = document.getElementById('cont_ag_city').value ;
var cont_ag_address_line_one = document.getElementById('cont_ag_address_line_one').value ;
var cont_ag_address_line_two = document.getElementById('cont_ag_address_line_two').value ;
var cont_ag_email = document.getElementById('cont_ag_email').value ;
var cont_ag_tele = document.getElementById('cont_ag_tele').value ;
//var cont_ag_webiste_url = document.getElementById('cont_ag_webiste_url').value ;
var cont_ag_position = document.getElementById('cont_ag_position').value ;
var application_id = document.getElementById('generated_application_id').value;

var contact_id =  document.getElementById('agent_contact_id').value ;
var agent_id=  document.getElementById('agent_id').value ;


var cont_age_response_tele  = document.getElementById('cont_age_response_tele').innerHTML ;
cont_ag_tele = cont_ag_tele+cont_age_response_tele;

$.ajax({
    //data: $('#bookForm').serialize(),
    data:{ 
        trade_name: ag_trade_name,
        country_id: ag_country,
        city: ag_city,
        state: ag_state,
        address_line_one: ag_address_line_one,
        address_line_two: ag_address_line_two,
        country_code:age_tele_code ,
        telephone:ag_tele,
        email:ag_email,
        webiste_url:ag_website_url,
        postal_code:12,
        contact_id:contact_id,
        application_id:application_id,

        //From  Contact Information
        first_name:cont_ag_first_name,
        middle_name:cont_ag_middle_name,
        last_name:cont_ag_last_name,
        country_id_contact:cont_ag_country_id,
        position:cont_ag_position ,
        city_contact:cont_ag_city,
        address_line_one_contact:cont_ag_address_line_one,
        address_line_two_contact:cont_ag_address_line_two,
        postal_code:12,
        telephone_contact:cont_ag_tele,
        //webiste_url_contact:cont_ag_webiste_url,
        email_contact:cont_ag_email,
        contact_type:'Agent',
        agent_id:agent_id,
        
        },
    url: "{{  url('/agent_update')   }}",
    type: "POST",
    dataType: 'json',
    success: function (data) {

     if(data.message==true)  
     {

      $('#ag_save').hide();
      $('#ag_update').show();
      document.getElementById('agent_next_button').disabled = false;

var Toast = Swal.mixin({
toast: true,
position: 'top-end',
showConfirmButton: false,
timer: 6000
}); 

toastr.success(data.AgentupdateInfo)

     } 

       else if(data.message == false)  
     {

      $('#ag_save').hide();
      $('#ag_update').show();
      document.getElementById('agent_next_button').disabled = false;

var Toast = Swal.mixin({
toast: true,
position: 'top-end',
showConfirmButton: false,
timer: 6000
}); 

toastr.info(data.AgentupdateInfo)

     } 
     else
     {
var Toast = Swal.mixin({
toast: true,
position: 'top-end',
showConfirmButton: false,
timer: 6000
});
toastr.error(data.AgentInfo.errorInfo[2])
}
    },
    error: function (data) {
        console.log('Error:', data);
        $('#saveBtn').html('Save Changes');
    }

  
});
});





   $('#save_supplier_info').click(function () {   
    if( document.getElementById('new_applicant').checked == true  ) {  var trade_name  = document.getElementById('cs_trade_name').value;     }
    else if( document.getElementById('old_applicant').checked == true)  {  var trade_name  = document.getElementById('trade_names').value;  }


    if( document.getElementById('new_applicant').checked == true  ) 
    {                      
           //From New Supplier
           trade_name=trade_name;
    var country = document.getElementById('css_country').value;
    var city =  document.getElementById('cs_city').value;
    var state =document.getElementById('cs_state').value ;
    var address_line_one = document.getElementById('cs_address_line_one').value;
    var address_line_two= document.getElementById('cs_address_line_two').value ;
    var email = document.getElementById('cs_email').value ;
    var tele =  document.getElementById('cs_tele').value ;
    var url = document.getElementById('cs_website_url').value ;
    var website_url = document.getElementById('cs_website_url').value ;
    //var institutional_email = document.getElementById('cs_institutional_email').value ;
    var postal_code = document.getElementById('postal_code').value

    var tele_code_supplier = document.getElementById('cs_response_tele').innerHTML ;
     //tele =  tele_code_supplier+tele;
       
        //Contact Supplier Full Information
    var contact_supplier_firstname  = document.getElementById('cont_first_name').value ;
    var contact_supplier_middlename = document.getElementById('cont_middle_name').value ;
    var contact_supplier_lastname  =  document.getElementById('cont_last_name').value ;
    var contact_supplier_country  =   document.getElementById('cont_country').value ;
    var contact_supplier_city  =      document.getElementById('cont_city').value ;
    var contact_supplier_address_line_one = document.getElementById('cont_address_line_one').value ;
    var contact_supplier_address_line_two = document.getElementById('cont_address_line_two').value ;
    var contact_supplier_tele =             document.getElementById('cont_tele').value ;
    var contact_supplier_email =            document.getElementById('cont_email').value ;
    //var contact_supplier_website_url =      document.getElementById('cont_webiste_url').value ;
    var contact_supplier_position =         document.getElementById('cont_position').value ;
    var application_id = document.getElementById('generated_application_id').value;
    
   // var contact_supplier_postal_code = document.getElementById('postal_code').value
   var user_id = document.getElementById('user_id').value ;
     
   var tele_code_contact = document.getElementById('cont_response_tele').innerHTML ;
    contact_supplier_tele = tele_code_contact + contact_supplier_tele;//+;
     


    $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ 
              trade_name: trade_name,
              country_id: country,
              city:city,
              state:state,
              address_line_one:address_line_one,
              address_line_two:address_line_two,
              country_code:tele_code_supplier,
              telephone:tele,
              email:email,
              webiste_url:website_url,
              user_id:user_id,
              application_id:application_id,
              postal_code:postal_code,
             // institutional_email:institutional_email,
              

              //From Supplier Information
              first_name:contact_supplier_firstname,
              middle_name:contact_supplier_middlename,
              last_name:contact_supplier_lastname,
              country_id_contact:contact_supplier_country,
              position:contact_supplier_position,
              city_contact:contact_supplier_city,
              address_line_one_contact:contact_supplier_address_line_one,
              address_line_two_contact:contact_supplier_address_line_two,
              telephone_contact:contact_supplier_tele,
              //webiste_url_contact:contact_supplier_website_url,
              email_contact:contact_supplier_email,
              contact_type:'Supplier',

              
              },
          url: "{{   route('company_supplier_save')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {

           if(data.supplyInfo==true)  
           {
document.getElementById('contact_id').value = data.Contact_ID;
document.getElementById('supplier_id').value = data.Supplier_ID;       
document.getElementById('cs_next_button').disabled = false;
$('#cs_save').hide();
$('#cs_update').show();



      var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.success("Applicant Information and Applicant Contact Infomation Successfully Inserted")

           } 
           else
           {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    });
 toastr.error(data.supplyInfo.errorInfo[2])
}
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });
    }

    else if( document.getElementById('old_applicant').checked == true) 
    { 
        
  //From New Supplier
  //var trade_name  = document.getElementById('trade_names').value;
  trade_name=trade_name;
    var country = document.getElementById('css_country').value;
    var city =  document.getElementById('cs_city').value;
    var state =document.getElementById('cs_state').value ;
    var address_line_one = document.getElementById('cs_address_line_one').value;
    var address_line_two= document.getElementById('cs_address_line_two').value ;
    var email = document.getElementById('cs_email').value ;
    var tele =  document.getElementById('cs_tele').value ;
    var url = document.getElementById('cs_website_url').value ;
    var website_url = document.getElementById('cs_website_url').value ;
    //var institutional_email = document.getElementById('cs_institutional_email').value ;
    var postal_code = document.getElementById('postal_code').value

    var tele_code_supplier = document.getElementById('cs_response_tele').innerHTML ;
     //tele =  tele_code_supplier+tele;
       
        //Contact Supplier Full Information
    var contact_supplier_firstname  = document.getElementById('cont_first_name').value ;
    var contact_supplier_middlename = document.getElementById('cont_middle_name').value ;
    var contact_supplier_lastname  =  document.getElementById('cont_last_name').value ;
    var contact_supplier_country  =   document.getElementById('cont_country').value ;
    var contact_supplier_city  =      document.getElementById('cont_city').value ;
    var contact_supplier_address_line_one = document.getElementById('cont_address_line_one').value ;
    var contact_supplier_address_line_two = document.getElementById('cont_address_line_two').value ;
    var contact_supplier_tele =             document.getElementById('cont_tele').value ;
    var contact_supplier_email =            document.getElementById('cont_email').value ;
    //var contact_supplier_website_url =      document.getElementById('cont_webiste_url').value ;
    var contact_supplier_position =         document.getElementById('cont_position').value ;
    var application_id = document.getElementById('generated_application_id').value;
    
   // var contact_supplier_postal_code = document.getElementById('postal_code').value
   var user_id = document.getElementById('user_id').value ;
     
   var tele_code_contact = document.getElementById('cont_response_tele').innerHTML ;
    contact_supplier_tele = tele_code_contact + contact_supplier_tele;//+;
     


    $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ 
              trade_name: trade_name,
              country_id: country,
              city:city,
              state:state,
              address_line_one:address_line_one,
              address_line_two:address_line_two,
              country_code:tele_code_supplier,
              telephone:tele,
              email:email,
              webiste_url:website_url,
              user_id:user_id,
              application_id:application_id,
              postal_code:postal_code,
             // institutional_email:institutional_email,
              

              //From Supplier Information
              first_name:contact_supplier_firstname,
              middle_name:contact_supplier_middlename,
              last_name:contact_supplier_lastname,
              country_id_contact:contact_supplier_country,
              position:contact_supplier_position,
              city_contact:contact_supplier_city,
              address_line_one_contact:contact_supplier_address_line_one,
              address_line_two_contact:contact_supplier_address_line_two,
              telephone_contact:contact_supplier_tele,
              //webiste_url_contact:contact_supplier_website_url,
              email_contact:contact_supplier_email,
              contact_type:'Supplier',

              
              },
          url: "{{   route('company_supplier_save')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {

           if(data.supplyInfo==true)  
           {
document.getElementById('contact_id').value = data.Contact_ID;
document.getElementById('supplier_id').value = data.Supplier_ID;       
document.getElementById('cs_next_button').disabled = false;
$('#cs_save').hide();
$('#cs_update').show();



      var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.success("Applicant Information and Applicant Contact Infomation Successfully Inserted")

           } 
           else
           {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    });
 toastr.error(data.supplyInfo.errorInfo[2])
}
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });

    }






    });















//Update Supplier Information 
    $('#update_supplier_info').click(function () {
      
    if( document.getElementById('new_applicant').checked == true  ) 
    {                      
           //From New Supplier
    var trade_name  = document.getElementById('cs_trade_name').value;
    var country = document.getElementById('css_country').value;
    var city =  document.getElementById('cs_city').value;
    var state =document.getElementById('cs_state').value ;
    var address_line_one = document.getElementById('cs_address_line_one').value;
    var address_line_two= document.getElementById('cs_address_line_two').value ;
    var email = document.getElementById('cs_email').value ;
    var tele =  document.getElementById('cs_tele').value ;
    //var tele_code =  document.getElementById('cs_response_tele').innerHTML ;
    var url = document.getElementById('cs_website_url').value ;
    var website_url = document.getElementById('cs_website_url').value ;
    var postal_code = document.getElementById('postal_code').value;
    //var institutional_email = document.getElementById('cs_institutional_email').value ;

    var tele_code_supplier = document.getElementById('cs_response_tele').innerHTML ;
   
       
       
        //Contact Supplier Full Information
    var contact_supplier_firstname  = document.getElementById('cont_first_name').value ;
    var contact_supplier_middlename = document.getElementById('cont_middle_name').value ;
    var contact_supplier_lastname  = document.getElementById('cont_last_name').value ;
    var contact_supplier_country  = document.getElementById('cont_country').value ;
    var contact_supplier_city  = document.getElementById('cont_city').value ;
    var contact_supplier_address_line_one = document.getElementById('cont_address_line_one').value ;
    var contact_supplier_address_line_two = document.getElementById('cont_address_line_two').value ;
    var contact_supplier_tele = document.getElementById('cont_tele').value ;
    var contact_supplier_email = document.getElementById('cont_email').value ;
  //  var contact_supplier_website_url = document.getElementById('cont_webiste_url').value ;
    var contact_supplier_position = document.getElementById('cont_position').value ;
    var application_id = document.getElementById('generated_application_id').value;
    var tele_code_contact = document.getElementById('cont_response_tele').innerHTML ;
    contact_supplier_tele =  tele_code_contact+contact_supplier_tele;
   //Get ID
  var user_id = document.getElementById('user_id').value ;
  var contact_id =  document.getElementById('contact_id').value ;
  var supplier_id=  document.getElementById('supplier_id').value ;


    $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ 
              trade_name: trade_name,
              country_id: country,
              city:city,
              state:state,
              address_line_one:address_line_one,
              address_line_two:address_line_two,
              country_code:tele_code_supplier ,
              telephone:tele,
              email:email,
              webiste_url:website_url,
              contact_id:contact_id,
              user_id :user_id ,
              application_id:application_id,
              //institutional_email :institutional_email ,
              

              //From Supplier Information
              first_name:contact_supplier_firstname,
              middle_name:contact_supplier_middlename,
              last_name:contact_supplier_lastname,
              country_id_contact:contact_supplier_country,
              position:contact_supplier_position,
              city_contact:contact_supplier_city,
              address_line_one_contact:contact_supplier_address_line_one,
              address_line_two_contact:contact_supplier_address_line_two,
              postal_code:postal_code,
              telephone_contact:contact_supplier_tele,
              webiste_url_contact:contact_supplier_website_url,
              email_contact:contact_supplier_email,
              contact_type:'Supplier',
              supplier_id:supplier_id,

              
              },
          url: "{{   url('/company_supplier_update')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {

           if(data.supplyInfo_updated==1)  
           {
document.getElementById('contact_id').value = data.Contact_ID;
document.getElementById('supplier_id').value = data.Supplier_ID;       
document.getElementById('cs_next_button').disabled = false;
//$('#cs_save').hide();
//$('#cs_update').show();

 var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.success("Applicant Information and Applicant Contact Infomation Successfully Updated")

           } 

    else if(data.supplyInfo_updated==0)  {

 var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.info("No update is made -- Changes not Affected!!")

           }
           
           else
           {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    });
    toastr.error(data.supplyInfo.errorInfo[2])
}
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });
    }
    else if( document.getElementById('old_applicant').checked == true) 
    { 
      var trade_name  = document.getElementById('trade_names').value;
    var country = document.getElementById('css_country').value;
    var city =  document.getElementById('cs_city').value;
    var state =document.getElementById('cs_state').value ;
    var address_line_one = document.getElementById('cs_address_line_one').value;
    var address_line_two= document.getElementById('cs_address_line_two').value ;
    var email = document.getElementById('cs_email').value ;
    var tele =  document.getElementById('cs_tele').value ;
    //var tele_code =  document.getElementById('cs_response_tele').innerHTML ;
    var url = document.getElementById('cs_website_url').value ;
    var website_url = document.getElementById('cs_website_url').value ;
    var postal_code = document.getElementById('postal_code').value;
    //var institutional_email = document.getElementById('cs_institutional_email').value ;

    var tele_code_supplier = document.getElementById('cs_response_tele').innerHTML ;
   
       
       
        //Contact Supplier Full Information
    var contact_supplier_firstname  = document.getElementById('cont_first_name').value ;
    var contact_supplier_middlename = document.getElementById('cont_middle_name').value ;
    var contact_supplier_lastname  = document.getElementById('cont_last_name').value ;
    var contact_supplier_country  = document.getElementById('cont_country').value ;
    var contact_supplier_city  = document.getElementById('cont_city').value ;
    var contact_supplier_address_line_one = document.getElementById('cont_address_line_one').value ;
    var contact_supplier_address_line_two = document.getElementById('cont_address_line_two').value ;
    var contact_supplier_tele = document.getElementById('cont_tele').value ;
    var contact_supplier_email = document.getElementById('cont_email').value ;
  //  var contact_supplier_website_url = document.getElementById('cont_webiste_url').value ;
    var contact_supplier_position = document.getElementById('cont_position').value ;
    var application_id = document.getElementById('generated_application_id').value;
    var tele_code_contact = document.getElementById('cont_response_tele').innerHTML ;
    contact_supplier_tele =  tele_code_contact+contact_supplier_tele;
   //Get ID
  var user_id = document.getElementById('user_id').value ;
  var contact_id =  document.getElementById('contact_id').value ;
  var supplier_id=  document.getElementById('supplier_id').value ;


    $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ 
              trade_name: trade_name,
              country_id: country,
              city:city,
              state:state,
              address_line_one:address_line_one,
              address_line_two:address_line_two,
              country_code:tele_code_supplier ,
              telephone:tele,
              email:email,
              webiste_url:website_url,
              contact_id:contact_id,
              user_id :user_id ,
              application_id:application_id,
              //institutional_email :institutional_email ,
              

              //From Supplier Information
              first_name:contact_supplier_firstname,
              middle_name:contact_supplier_middlename,
              last_name:contact_supplier_lastname,
              country_id_contact:contact_supplier_country,
              position:contact_supplier_position,
              city_contact:contact_supplier_city,
              address_line_one_contact:contact_supplier_address_line_one,
              address_line_two_contact:contact_supplier_address_line_two,
              postal_code:postal_code,
              telephone_contact:contact_supplier_tele,
              //webiste_url_contact:contact_supplier_website_url,
              email_contact:contact_supplier_email,
              contact_type:'Supplier',
              supplier_id:supplier_id,

              
              },
          url: "{{   url('/company_supplier_update')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {

           if(data.supplyInfo_updated==1)  
           {
document.getElementById('contact_id').value = data.Contact_ID;
document.getElementById('supplier_id').value = data.Supplier_ID;       
document.getElementById('cs_next_button').disabled = false;
//$('#cs_save').hide();
//$('#cs_update').show();

 var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.success("Applicant Information and Applicant Contact Infomation Successfully Updated")

           } 

    else if(data.supplyInfo_updated==0)  {

 var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.info("No update is made -- Changes not Affected!!")

           }
           
           else
           {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    });
    toastr.error(data.supplyInfo.errorInfo[2])
}
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });
   
    }
});




///Saving Private Rayan Saving Product Detial Info

$('#save_product_detail_info').click(function () {
                         
           //From New Product Details
   
    var generic_approved_name = document.getElementById('generic_approved_name').value;
    var generic_approved_name_other =  document.getElementById('generic_approved_name_other').value;
    var proprietary_trade_name  = document.getElementById('product_trade_name').value;
    var dosage_form_id =  document.getElementById('dosage_form_id').value;
    var route_administration_id =document.getElementById('route_administration_id').value ;
    var description = document.getElementById('description').value;
    //var strength_amount = document.getElementById('strength_amount').value ;
    //var strength_unit = document.getElementById('strength_unit').value ;
    var strength_unit_amount = document.getElementById('strength_amount_unit').value ;
    var storage_condition =  document.getElementById('storage_condition').value ;
    var shelf_life_amount = document.getElementById('shelf_life_amount').value ;
    var shelf_life_unit = document.getElementById('shelf_life_unit').value ;
    var pharmaco_therapeutic_classification = document.getElementById('pharmaco_therapeutic_classification').value ;
    var proposed_shelf_life_amount  = document.getElementById('proposed_shelf_life_amount').value ;
    var proposed_shelf_life_unit = document.getElementById('proposed_shelf_life_unit').value ;
    var proposed_shelf_life_after_reconstitution_amount  = document.getElementById('proposed_shelf_life_after_reconstitution_amount').value ;
    var proposed_shelf_life_after_reconstitution_unit  = document.getElementById('proposed_shelf_life_after_reconstitution_unit').value ;
    var visual_description  = document.getElementById('visual_description').value ;
    var commercial_presentation = document.getElementById('commercial_presentation').value ;
    var container = document.getElementById('container').value ;
    var packaging = document.getElementById('packaging').value ;
    var category_use = document.getElementById('category_use').value ;
    var application_id = document.getElementById('generated_application_id').value;

  if(generic_approved_name != 919)
{

    
   var user_id = document.getElementById('user_id').value ;


    $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ 
              user_id:user_id,
              product_trade_name: proprietary_trade_name,
              medicine_id: generic_approved_name,
              dosage_form_id:dosage_form_id,
              route_administration_id:route_administration_id,
              description:description,
              //strength_amount:strength_amount,
              strength_amount_strength_unit:'--',
              pharmaco_therapeutic_classification:pharmaco_therapeutic_classification,
              storage_condition:storage_condition,
              shelf_life_amount:shelf_life_amount,
              shelf_life_unit:shelf_life_unit,
              proposed_shelf_life_amount:proposed_shelf_life_amount,
              proposed_shelf_life_unit:proposed_shelf_life_unit,
              proposed_shelf_life_after_reconstitution_amount : proposed_shelf_life_after_reconstitution_amount,
              proposed_shelf_life_after_reconstitution_unit : proposed_shelf_life_after_reconstitution_unit,
              visual_description:visual_description,
              commercial_presentation :commercial_presentation,
              container:container,
              packaging:packaging,
              category_use:category_use,
              application_id:application_id,
             
              
              },
          url: "{{   url('/product_details/save')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {

           if(data.Message == true)  
           {
document.getElementById('product_detail_master_id').value = data.productdetial_id;
document.getElementById('product_detail_next_button').disabled = false;

$('#product_detail_save').hide();
$('#product_detail_update').show();
   var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.success("Prodcut Detail Saved Successfully")

           } 
           else
           {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    });
 toastr.error(data.Message.errorInfo[2])
}
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });
    
    }
 else{

    var user_id = document.getElementById('user_id').value ;
     $.ajax({
          //data: $('#bookForm').serialize(),
          data:{ 
            user_id:user_id,
              product_trade_name: proprietary_trade_name,
              medicine_id: generic_approved_name,
              dosage_form_id:dosage_form_id,
              route_administration_id:route_administration_id,
              description:description,
             // strength_amount:strength_amount,
              //strength_unit:strength_unit,
              strength_amount_strength_unit:strength_unit_amount,
              pharmaco_therapeutic_classification:pharmaco_therapeutic_classification,
              storage_condition:storage_condition,
              shelf_life_amount:shelf_life_amount,
              shelf_life_unit:shelf_life_unit,
              proposed_shelf_life_amount:proposed_shelf_life_amount,
              proposed_shelf_life_unit:proposed_shelf_life_unit,
              proposed_shelf_life_after_reconstitution_amount : proposed_shelf_life_after_reconstitution_amount,
              proposed_shelf_life_after_reconstitution_unit : proposed_shelf_life_after_reconstitution_unit,
              visual_description:visual_description,
              commercial_presentation :commercial_presentation,
              container:container,
              packaging:packaging,
              category_use:category_use,
              application_id:application_id,
              generic_approved_name_other:generic_approved_name_other,
             
              
              },
          url: "{{   url('/product_details/save/other')   }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {

           if(data.Message == true)  
           {
document.getElementById('product_detail_master_id').value = data.productdetial_id;
document.getElementById('product_detail_next_button').disabled = false;

$('#product_detail_save').hide();
$('#product_detail_update').show();
   var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    }); 

toastr.success("Prodcut Detail Saved Successfully")

           } 
           else
           {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 6000
    });
 toastr.error(data.Message.errorInfo[2])
}
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }

        
      });





 }


    });


///Updating Private Rayan Updating Product Detial Info




$('#update_product_detail_info').click(function () {
                         
                  //From New Product Details
                  var proprietary_trade_name  = document.getElementById('product_trade_name').value;
                  var generic_approved_name = document.getElementById('generic_approved_name').value;
                  var dosage_form_id =  document.getElementById('dosage_form_id').value;
                  var route_administration_id =document.getElementById('route_administration_id').value ;
                  var description = document.getElementById('description').value;
                 
                 // var strength_unit = document.getElementById('strength_unit').value ;
                  var storage_condition =  document.getElementById('storage_condition').value ;
                  var shelf_life_amount = document.getElementById('shelf_life_amount').value ;
                  var shelf_life_unit = document.getElementById('shelf_life_unit').value ;
                  var pharmaco_therapeutic_classification = document.getElementById('pharmaco_therapeutic_classification').value ;
                  var proposed_shelf_life_amount  = document.getElementById('proposed_shelf_life_amount').value ;
                  var proposed_shelf_life_unit = document.getElementById('proposed_shelf_life_unit').value ;
                  var proposed_shelf_life_after_reconstitution_amount  = document.getElementById('proposed_shelf_life_after_reconstitution_amount').value ;
                  var proposed_shelf_life_after_reconstitution_unit  = document.getElementById('proposed_shelf_life_after_reconstitution_unit').value ;
                  var visual_description  = document.getElementById('visual_description').value ;
                  var commercial_presentation = document.getElementById('commercial_presentation').value ;
                  var container = document.getElementById('container').value ;
                  var packaging = document.getElementById('packaging').value ;
                  var category_use = document.getElementById('category_use').value ;
                  var user_id = document.getElementById('user_id').value ;
                  var product_detail_id  = document.getElementById('product_detail_master_id').value ;
                  var application_id = document.getElementById('generated_application_id').value;
              
                  if(generic_approved_name != 919) { var strength_amount_unit = document.getElementById('strength_amount_unit').value ;}
                  else{ var strength_amount_unit = '--';}




                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            product_trade_name: proprietary_trade_name,
                            medicine_id: generic_approved_name,
                            dosage_form_id:dosage_form_id,
                            route_administration_id:route_administration_id,
                            description:description,
                            strength_amount_strength_unit:strength_amount_unit,
                            //strength_unit:strength_unit,
                            pharmaco_therapeutic_classification:pharmaco_therapeutic_classification,
                            storage_condition:storage_condition,
                            shelf_life_amount:shelf_life_amount,
                            shelf_life_unit:shelf_life_unit,
                            proposed_shelf_life_amount:proposed_shelf_life_amount,
                            proposed_shelf_life_unit:proposed_shelf_life_unit,
                            proposed_shelf_life_after_reconstitution_amount : proposed_shelf_life_after_reconstitution_amount,
                            proposed_shelf_life_after_reconstitution_unit : proposed_shelf_life_after_reconstitution_unit,
                            visual_description:visual_description,
                            commercial_presentation :commercial_presentation,
                            container:container,
                            packaging:packaging,
                            category_use:category_use,
                            id:product_detail_id,
                            application_id :application_id ,
                            
                            },
                        url: "{{   url('/product_details/update')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
              
                         if(data.Message == true)  
                         {

document.getElementById('product_detail_master_id').value = data.productdetial_id;
document.getElementById('product_detail_next_button').disabled = false;
              
              $('#product_detail_save').hide();
              $('#product_detail_update').show();
                 var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
                  
              toastr.info("Prodcut Detail Updated  Successfully")
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.info("No update is made -- Changes not Affected!!")
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              


























                  });





//Product Manufacturer Data Saving wizard

$('#save_product_manufacturer_save').click(function () {
                         
                         //From New Product Details
                  var manufacturer_country_id  = document.getElementById('manufacturer_country').value;
                  var manufacturer_tele_code  = document.getElementById('manu_response_tele').innerHTML;
                  var manufacturer_name = document.getElementById('manufacturer_name').value;
                  var manufacturer_postal_code =  document.getElementById('manufacturer_postal_code').value;
                  var manufacturer_tele =document.getElementById('manufacturer_tele').value ;
                  var manufacturer_city = document.getElementById('manufacturer_city').value ;
                  var manufacturer_state =  document.getElementById('manufacturer_state').value ;
                  var manufacturer_add_line_one = document.getElementById('manufacturer_add_line_one').value ;
                  var manufacturer_add_line_two =  document.getElementById('manufacturer_add_line_two').value ;
                 // var manufacturer_url =  document.getElementById('manufacturer_url').value ;
                 // var manufacturer_email = document.getElementById('manufacturer_email').value ;
                  var manufacturer_activity = document.getElementById('manufacturer_activity').value ;
                  var user_id = document.getElementById('user_id').value ;
                  var manufacturer_unit = document.getElementById('manufacturer_unit').value ;
                  var manufacturer_block = document.getElementById('manufacturer_block').value ;
                  var product_detail_master_id = document.getElementById('product_detail_master_id').value ;
                  var application_id = document.getElementById('generated_application_id').value;
            
            
                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            name: manufacturer_name,
                            country_id: manufacturer_country_id,
                            city:manufacturer_city,
                            state:manufacturer_state,
                            addressline_one:manufacturer_add_line_one,
                            addressline_two:manufacturer_add_line_two,
                            postal_code:manufacturer_postal_code,
                            telephone:manufacturer_tele,
                            country_code:manufacturer_tele_code,
                            //webiste_url: manufacturer_url,
                            activity:manufacturer_activity,
                            //email:manufacturer_email,
                            block:manufacturer_block,
                            unit:manufacturer_unit,
                            product_id: product_detail_master_id,
                            application_id:application_id,
                        
                              },
                        url: "{{   url('/product_manufacturer/save')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
              
                         if(data.Message == true)  
                         {
                          
//document.getElementById('product_detail_master_id').value = data.productdetial_id;
document.getElementById('product_manufacturer_next_button').disabled = false;
document.getElementById('renderd_manufacturer_table').innerHTML = data.renderd_manufacturer_table;
document.getElementById('id_for_update').value = data.Manufacturer_id;
             // $('#product_detail_save').hide();
             // $('#product_detail_update').show();
                 var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 

document.getElementById('manufacturer_name').value="";
document.getElementById('manufacturer_country').value="";
document.getElementById('manufacturer_postal_code').value="";
document.getElementById('manufacturer_tele').value="";
document.getElementById('manufacturer_state').value="";
document.getElementById('manufacturer_add_line_one').value="";
document.getElementById('manufacturer_add_line_two').value="";
//document.getElementById('manufacturer_url').value=this.cells[9].innerHTML;
document.getElementById('manufacturer_activity').value="";
document.getElementById('manufacturer_block').value="";
document.getElementById('manufacturer_unit').value="";
//document.getElementById('manufacturer_email').value=this.cells[13].innerHTML;
document.getElementById('manufacturer_city').value= "";

              toastr.success("Product Manufacuturer Succesfully saved")
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.errorInfo)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });










//Update Product Manufaturer


//Product Manufacturer Data Saving wizard

$('#updates_product_manufacturer_update').click(function () {
                         
                         //From New Product Details
                  var manufacturer_country_id  = document.getElementById('manufacturer_country').value;
                  var manufacturer_tele_code  = document.getElementById('manu_response_tele').innerHTML;
                  var manufacturer_name = document.getElementById('manufacturer_name').value;
                  var manufacturer_postal_code =  document.getElementById('manufacturer_postal_code').value;
                  var manufacturer_tele =document.getElementById('manufacturer_tele').value ;
                  var manufacturer_city = document.getElementById('manufacturer_city').value ;
                  var manufacturer_state =  document.getElementById('manufacturer_state').value ;
                  var manufacturer_add_line_one = document.getElementById('manufacturer_add_line_one').value ;
                  var manufacturer_add_line_two =  document.getElementById('manufacturer_add_line_two').value ;
                 // var manufacturer_url =  document.getElementById('manufacturer_url').value ;
                 // var manufacturer_email = document.getElementById('manufacturer_email').value ;
                  var manufacturer_activity = document.getElementById('manufacturer_activity').value ;
                  var user_id = document.getElementById('user_id').value ;
                  var manufacturer_unit = document.getElementById('manufacturer_unit').value ;
                  var manufacturer_block = document.getElementById('manufacturer_block').value ;
                  var product_detail_master_id = document.getElementById('product_detail_master_id').value ;
                  var application_id = document.getElementById('generated_application_id').value;

              var id_for_update = document.getElementById('id_for_update').innerHTML;
                   var Tele_code = manufacturer_tele_code +  manufacturer_tele;
            
                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            name: manufacturer_name,
                            country_id: manufacturer_country_id,
                            city:manufacturer_city,
                            state:manufacturer_state,
                            addressline_one:manufacturer_add_line_one,
                            addressline_two:manufacturer_add_line_two,
                            postal_code:manufacturer_postal_code,
                            telephone:manufacturer_tele,
                            country_code:manufacturer_tele_code,
                           // webiste_url: manufacturer_url,
                            activity:manufacturer_activity,
                           // email:manufacturer_email,
                            block:manufacturer_block,
                            unit:manufacturer_unit,
                            product_id: product_detail_master_id,
                            application_id:application_id,
                            id:id_for_update,
                        
                              },
                        url: "{{   url('/product_manufacturer/update')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
              
                         if(data.Message == true)  
                         {
  document.getElementById('id_for_update').value = data.Manufacturer_id;
  //document.getElementById('product_detail_master_id').value = data.productdetial_id;
  document.getElementById('product_manufacturer_next_button').disabled = false;
  document.getElementById('renderd_manufacturer_table').innerHTML = data.renderd_manufacturer_table;
             // $('#product_detail_save').hide();
             // $('#product_detail_update').show();
                 var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.info("Product Manufacuturer Succesfully updated")
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.errorInfo)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });



$('#createNewCompostion_update').click(function () {
                         
                  //From New Product Composition
                  var name_inn_text_composition  = document.getElementById('name_inn_text_composition').value;
                  var quantity_composition = document.getElementById('quantity_composition').value;
                  var reason_inclusion_composition =  document.getElementById('reason_inclusion_composition').value;
                  var reference_standard_composition =document.getElementById('reference_standard_composition').value ;
                  var composition_type_composition = document.getElementById('composition_type_composition').value ;
                  var product_detail_master_id = document.getElementById('product_detail_master_id').value ;
                  var user_id =  document.getElementById('user_id').value ;
                  var application_id = document.getElementById('generated_application_id').value;
                  var id_for_update = document.getElementById('id_update_compostion').innerHTML;
                 
            
                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            composition_name: name_inn_text_composition,
                            reason: reason_inclusion_composition ,
                            reference_standard:reference_standard_composition,
                            type:composition_type_composition,
                            medical_product_id: product_detail_master_id,
                            quantity:quantity_composition,
                            composition_name:name_inn_text_composition,
                            application_id:application_id,
                            id:id_for_update,
                              },
                        url: "{{   url('/product_Composition/update')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
              
                         if(data.Message == true)  
                         {
document.getElementById('next_composition').disabled = false;
document.getElementById('renderd_product_composition_table').innerHTML = data.renderd_product_composition_table;
document.getElementById('id_update_compostion').innerHTML = data.Compostion_id;
             // $('#product_detail_save').hide();
             // $('#product_detail_update').show();
             //document.getElementById('product_detail_master_id').value = data.productdetial_id;
                 var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.info("Product Composition Succesfully updated")
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.errorInfo)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });



$('#createNewCompostion_save').click(function () {
                         
                         //From New Product Details
                  var name_inn_text_composition  = document.getElementById('name_inn_text_composition').value;
                  var quantity_composition = document.getElementById('quantity_composition').value;
                  var reason_inclusion_composition =  document.getElementById('reason_inclusion_composition').value;
                  var reference_standard_composition =document.getElementById('reference_standard_composition').value ;
                  var composition_type_composition = document.getElementById('composition_type_composition').value ;
                  var product_detail_master_id = document.getElementById('product_detail_master_id').value ;
                  var user_id = document.getElementById('user_id').value ;
                  var application_id = document.getElementById('generated_application_id').value;
                  var product_trade_name =  document.getElementById('product_trade_name').value;
           

var oTable = document.getElementById('table_product_compostion'),rIndex;
var count=oTable.rows.length;
if(oTable.rows.length >= 1)
{
var rowLength = oTable.rows.length;
var check_number_duplications = 0;
//loops through rows    
for (i = 1; i < rowLength; i++){
//gets cells of current row  
var oCells = oTable.rows.item(i).cells;
//gets amount of cells of current row
var cellLength = oCells.length;
//loops through each cell in current row
for(var j = 0; j < cellLength; j++)
{
       var name_inn  = oCells.item(j).innerHTML;
       console.log(name_inn_text_composition+name_inn);
  

  if( name_inn.toString()  ==  name_inn_text_composition.toString() )
 {
 
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-left',
      showConfirmButton: true,
      timer: 3000
                         });

   var alert ='Name (INN) product compostion for the medical <br> product'+name_inn_text_composition+'is duplicated try with other option Please!!'
   toastr.warning(alert);
   check_number_duplications++;
}
}
}
}

if(check_number_duplications==0)
{

 $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            composition_name: name_inn_text_composition,
                            reason: reason_inclusion_composition ,
                            reference_standard:reference_standard_composition,
                            type:composition_type_composition,
                            medical_product_id: product_detail_master_id,
                            quantity:quantity_composition,
                            composition_name:name_inn_text_composition,
                          application_id:application_id,
                             
                              },
                        url: "{{   url('/product_composition/save')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
              
                         if(data.Message == true)  
                         {
                          
// document.getElementById('product_detail_master_id').value = data.productdetial_id;
// $('#product_detail_save').hide();
// $('#product_detail_update').show();

document.getElementById('next_composition').disabled = false;
document.getElementById('renderd_product_composition_table').innerHTML = data.renderd_product_composition_table;
document.getElementById('id_update_compostion').innerHTML = data.Compostion_id;
            
                 var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
                  document.getElementById('name_inn_text_composition').value = " ";
                  document.getElementById('quantity_composition').value =" ";
                  document.getElementById('reason_inclusion_composition').value = " ";
                  document.getElementById('reference_standard_composition').value =" " ;
                  document.getElementById('composition_type_composition').value =" " ;
           
          

              toastr.success("Product Composition Succesfully saved")

              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.errorInfo)

              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
                  }



                  });


              












//Api manifacturere Table Insert Wizard

$('#save_product_manufacturer_api_save').click(function () {
                         
                         //From New Product Details
                        
                  var manufacturer_api_name  = document.getElementById('manufacturer_api_name').value;
                  var manufacturer_api_country = document.getElementById('manufacturer_api_country').value;
                  var manufacturer_api_postal_code =  document.getElementById('manufacturer_api_postal_code').value;
                  var manufacturer_api_tele =document.getElementById('manufacturer_api_tele').value ;
                  var manu_api_response_tele =document.getElementById('manu_api_response_tele').innerHTML ;
                  var manufacturer_api_city = document.getElementById('manufacturer_api_city').value ;
                  var manufacturer_api_state= document.getElementById('manufacturer_api_state').value ;
                  var manufacturer_api_add_line_one= document.getElementById('manufacturer_api_add_line_one').value ;
                  var manufacturer_api_add_line_two= document.getElementById('manufacturer_api_add_line_two').value ;
                 // var manufacture_api_website_url= document.getElementById('manufacture_api_website_url').value ;
                  //var manufacturer_api_email= document.getElementById('manufacturer_api_email').value ;
                  var user_id = document.getElementById('user_id').value ;
                  var application_id = document.getElementById('generated_application_id').value;
                  var manufacturer_api_tele = manu_api_response_tele + manufacturer_api_tele;
                  
                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            //email:manufacturer_api_email,
                            //webiste_url:manufacture_api_website_url,
                            manufacturer_name: manufacturer_api_name,
                            country_id: manufacturer_api_country ,
                            city:manufacturer_api_city,
                            state:manufacturer_api_state,
                            addressline_one: manufacturer_api_add_line_one,
                            addressline_two:manufacturer_api_add_line_two,
                            telephone:manufacturer_api_tele,
                            postal_code:manufacturer_api_postal_code,
                            application_id :application_id ,
                            
                             
                              },
                        url: "{{   url('/save_product_manufacturer_api/save')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
              
                         if(data.Message == true)  
                         {
                          
//document.getElementById('product_detail_master_id').value = data.productdetial_id;
document.getElementById('product_manufacturer_api_next_button').disabled = false;
document.getElementById('renderd_manufacturer_api_table').innerHTML = data.renderd_manufacturer_api_table;

                   document.getElementById('manufacturer_api_name').value = '';
                   document.getElementById('manufacturer_api_country').value = '';
                   document.getElementById('manufacturer_api_postal_code').value = '';
                   document.getElementById('manufacturer_api_tele').value = '';
                   document.getElementById('manu_api_response_tele').innerHTML = '';
                   document.getElementById('manufacturer_api_city').value = '';
                   document.getElementById('manufacturer_api_state').value= '' ;
                   document.getElementById('manufacturer_api_add_line_one').value = '';
                   document.getElementById('manufacturer_api_add_line_two').value = '';
             // $('#product_detail_save').hide();
             // $('#product_detail_update').show();
                 var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.success("Product API Succesfully saved")
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.errorInfo)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });


















$('#save_product_manufacturer_api_update').click(function () {
                         
                         //From New Product Details
                        
                  var manufacturer_api_name  = document.getElementById('manufacturer_api_name').value;
                  var manufacturer_api_country = document.getElementById('manufacturer_api_country').value;
                  var manufacturer_api_postal_code =  document.getElementById('manufacturer_api_postal_code').value;
                  var manufacturer_api_tele =document.getElementById('manufacturer_api_tele').value ;
                  var manu_api_response_tele =document.getElementById('manu_api_response_tele').innerHTML ;
                  var manufacturer_api_city = document.getElementById('manufacturer_api_city').value ;
                  var manufacturer_api_state= document.getElementById('manufacturer_api_state').value ;
                  var manufacturer_api_add_line_one= document.getElementById('manufacturer_api_add_line_one').value ;
                  var manufacturer_api_add_line_two= document.getElementById('manufacturer_api_add_line_two').value ;
                 // var manufacture_api_website_url= document.getElementById('manufacture_api_website_url').value ;
                  //var manufacturer_api_email= document.getElementById('manufacturer_api_email').value ;
                  var user_id = document.getElementById('user_id').value ;
                  var application_id = document.getElementById('generated_application_id').value;
                  var manufacturer_api_tele = manu_api_response_tele + manufacturer_api_tele;
                  console.log()
                  var id_for_update_api = document.getElementById('id_for_update_api').innerHTML;

                  var updated = document.getElementById('product_manufacturer_api_update');
                 var saved =   document.getElementById('product_manufacturer_api_save');
                  
                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            //email:manufacturer_api_email,
                            //webiste_url:manufacture_api_website_url,
                            manufacturer_name: manufacturer_api_name,
                            country_id: manufacturer_api_country ,
                            city:manufacturer_api_city,
                            state:manufacturer_api_state,
                            addressline_one: manufacturer_api_add_line_one,
                            addressline_two:manufacturer_api_add_line_two,
                            telephone:manufacturer_api_tele,
                            postal_code:manufacturer_api_postal_code,
                            application_id :application_id,
                            id_for_update_api:id_for_update_api,
                            
                             
                              },
                        url: "{{   url('/save_product_manufacturer_api/update')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
              
                         if(data.Message == true)  
                         {
                          
//document.getElementById('product_detail_master_id').value = data.productdetial_id;
updated.style.display= 'none';
saved.style.display= 'block';

document.getElementById('renderd_manufacturer_api_table').innerHTML = data.renderd_manufacturer_api_table;

                   document.getElementById('manufacturer_api_name').value = '';
                   document.getElementById('manufacturer_api_country').value = '';
                   document.getElementById('manufacturer_api_postal_code').value = '';
                   document.getElementById('manufacturer_api_tele').value = '';
                   document.getElementById('manu_api_response_tele').innerHTML = '';
                   document.getElementById('manufacturer_api_city').value = '';
                   document.getElementById('manufacturer_api_state').value= '' ;
                   document.getElementById('manufacturer_api_add_line_one').value = '';
                   document.getElementById('manufacturer_api_add_line_two').value = '';
             // $('#product_detail_save').hide();
             // $('#product_detail_update').show();
                 var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.info("Product API Succesfully updated")
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.errorInfo)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });














$('#save_application_info').click(function () {
                         
                         //From New Product Details

  var generated_value = document.getElementById('generated_application_id').value;
  if(generated_value == 0){} else {return false;}
                        
 if(document.getElementById('app_new_application').checked ==true) 
 {     // var application_type= 'NewApplication';
   
      var application_type = document.getElementById('new_application_mode').value;
      var fast_track_details =document.getElementById('new_application_mode').value;
      var fast_data=fast_track_details.split('_');
       fast_track_details  =  fast_data[1];
       application_type = fast_data[0];
  }

 if(document.getElementById('app_renewal_application').checked ==true) 
  {   var application_type = document.getElementById('new_application_mode').value;
      var fast_track_details =document.getElementById('new_application_mode').value;
      var fast_data=fast_track_details.split('_');
       fast_track_details  =  fast_data[1];
       application_type = fast_data[0];
  }

 if(document.getElementById('app_fast_track_mode').checked ==true) 
 {
      var application_type = document.getElementById('new_application_mode').value;
      var fast_track_details =document.getElementById('new_application_mode').value;
      var fast_data=fast_track_details.split('_');
       fast_track_details  =  fast_data[1];
       application_type = fast_data[0];
 }

 if(document.getElementById('app_variations').checked ==true) 
 {   
     var application_type = document.getElementById('new_application_mode').value;
      var fast_track_details =document.getElementById('new_application_mode').value;
      var fast_data=fast_track_details.split('_');
       fast_track_details  =  fast_data[1];
       application_type = fast_data[0];
 }
                  
    var user_id = document.getElementById('user_id').value ;
               
                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            application_type:application_type,
                            fast_track_details:fast_track_details,
                            },
                        url: "{{   url('/application/save')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
               if(data.Message == true)  
                         {
//$('#applicaion_updatee').show();
$('#appicaiton_save').hide('10');
$('#next_button_application').show();
$('#app_id').html(data.application_id);
document.getElementById('next_button_application').disabled = false;
document.getElementById('generated_application_id').value = data.application_id;
            var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.success("New Application Generated Successfully")
              var id = setInterval(dossier, 2000);
              function dossier() {
              //window.location = "/dossier_sample_status";
              
              clearInterval(id);
              }
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.item)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });










//Dossier and Sample Status 


$('#dossier_sample_save').click(function () {
                         
                         //From New Product Details
                  var user_id = document.getElementById('user_id').value ;
                  var application_id = document.getElementById('generated_application_id').value;

                 if(document.getElementById('LINK').checked == true){
       
                 if(document.getElementById('sample_status').checked ==true) {var sample_status= 1;} else {var sample_status=0;}
                 var dossier_url = document.getElementById('dossier_id').value ;
                   }


                  if(document.getElementById('DHL').checked == true){
              
                 if(document.getElementById('sample_status').checked ==true) {var sample_status= 1;} else {var sample_status=0;}
                 var dossier_url = "DHL" ;
                   }
               
                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            dossier_url:dossier_url,
                            sample_status:sample_status,
                            application_id:application_id,
                            },
                        url: "{{   url('/dossier_status/save')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
               if(data.Message == true)  
                         {
$('#dossier_update').show();
$('#dossier_sample_save').hide('10');
$('#next_button_application').show();
//document.getElementById('next_button_application').disabled = false;

            var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.success("Dossier and Sample Status Saved Successfully")
              var id = setInterval(dossier, 2000);
              function dossier() {
              window.location = "/dossier_sample_status";
              clearInterval(id);
              }
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.item)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });  

//dossier_sample_update



$('#dossier_sample_update').click(function () {
                         
                         //From New Product Details
 if(document.getElementById('sample_status').checked ==true) {var sample_status= 1;} else {var sample_status=0;}
                  var user_id = document.getElementById('user_id').value ;
                  var dossier_url = document.getElementById('dossier_id').value ;

                   var application_id = document.getElementById('generated_application_id').value;
               
                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            dossier_url:dossier_url,
                            sample_status:sample_status,
                            application_id:application_id,
                            },
                        url: "{{   url('/dossier_status/update')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
               if(data.Message == true)  
                         {
$('#dossier_update').show();
$('#dossier_sample_save').hide('10');
$('#next_button_application').show();
//document.getElementById('next_button_application').disabled = false;

            var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.info("Dossier and Sample Status Updated Successfuly")

              var id = setInterval(dossier, 2000);
              function dossier() {
              window.location = "/dossier_sample_status";
              clearInterval(id);
              }
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.item)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });



$('#customCheckbox1').click(function () {

var i_agree = document.getElementById('customCheckbox1');
if(i_agree.checked==true)

{
  document.getElementById('decleration_id').style.display = 'block';
}
else if(i_agree.checked==false)

{
  document.getElementById('decleration_id').style.display = 'none';
}



});





$('#decleration_save').click(function () {
                         
                         //From New Product Details  decleration_name
                  var user_id     = document.getElementById('user_id').value ;
                  var qualification = document.getElementById('qualification').value;
                  var position = document.getElementById('position_in_the_company').value;
                  var date = document.getElementById('Date_decleration').value;
                  var name = document.getElementById('decleration_name').value;
                  var application_id = document.getElementById('generated_application_id').value;

               if(qualification=='' || position==''  || date=='' || name=='')
               {
                var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.error("Fill all Fields correctly")
          return false;
               }


                  $.ajax({
                        //data: $('#bookForm').serialize(),
                        data:{ 
                            user_id:user_id,
                            qualification:qualification,
                            position:position,
                            date:date,
                            name:name,
                            application_id:application_id,
                            },
                        url: "{{   url('/decleration_save/save')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
               if(data.Message == true)  
{
$('#dossier_update').show(); $('#dossier_sample_save').hide('10'); $('#next_button_application').show();
document.getElementById('next_button_application').disabled = false;

            var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  }); 
              
              toastr.success("Decleration  Saved Successfully")
              document.getElementById('decleration_id').style.display = 'none';
              document.getElementById('decleration_on__update').style.display = 'block';
              
                         } 
                         else
                         {
                  var Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 6000
                  });
               toastr.error(data.Message.item)
              }
                        },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                        }
              
                      
                    });
                  
              
                  });


$('#table_manufacturer_api').click(function () {
var table = document.getElementById('table_manufacturer_api'),rIndex;
//var count=table.rows.length;
for(var i =0; i < table.rows.length ; i++)
{ 
var row = table.rows[i];
row.onclick = function()
{
rIndex = this.rowIndex;
console.log(rIndex);
var updated = document.getElementById('product_manufacturer_api_update');
var saved =   document.getElementById('product_manufacturer_api_save');


var id_for_update = document.getElementById('id_for_update_api');
if(rIndex==0)
{
document.getElementById('manufacturer_api_name').value="";
document.getElementById('manufacturer_api_country').value="";
document.getElementById('manufacturer_api_postal_code').value="";
document.getElementById('manufacturer_api_tele').value="";
document.getElementById('manu_api_response_tele').innerHTML="";
document.getElementById('manufacturer_api_country').value="";
document.getElementById('manufacturer_api_city').value="";
document.getElementById('manufacturer_api_state').value="";
document.getElementById('manufacturer_api_add_line_one').value="";
document.getElementById('manufacturer_api_add_line_two').value="";
document.getElementById('id_for_update_api').value='';
updated.style.display = "none";
saved.style.display = "block";
id_for_update.style.display = "none";

}   
else
{


                  $.ajax({ data:{ 
                          country_name:this.cells[3].innerHTML,
                            },
                        url: "{{ url('/Get_country_id/GetId')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
                          var country_id = data.CountryID;
                          document.getElementById('manufacturer_api_country').value= country_id;
                                                 },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                            } });

document.getElementById('id_for_update_api').innerHTML = this.cells[0].innerHTML;
document.getElementById('manufacturer_api_name').value=this.cells[2].innerHTML;

document.getElementById('manufacturer_api_postal_code').value=this.cells[4].innerHTML;
document.getElementById('manufacturer_api_tele').value=this.cells[5].innerHTML;
document.getElementById('manufacturer_api_state').value=this.cells[7].innerHTML;
document.getElementById('manufacturer_api_add_line_one').value=this.cells[8].innerHTML;
document.getElementById('manufacturer_api_add_line_two').value=this.cells[9].innerHTML;
document.getElementById('manufacturer_api_city').value=this.cells[6].innerHTML;
saved.style.display = "none";
updated.style.display = "block";
id_for_update.style.display = "none";

}
}
}
});





//Edit Form Wizard Compostion
$('#table_product_compostion').click(function () {

var table = document.getElementById('table_product_compostion'),rIndex;
var count=table.rows.length;
for(var i =0; i < table.rows.length ; i++)
{ 
var row = table.rows[i];
row.onclick = function()
{
rIndex = this.rowIndex;
console.log(rIndex);
var updated = document.getElementById('createNewCompostion_update');
var saved = document.getElementById('createNewCompostion_save');
var id_for_update = document.getElementById('id_update_compostion');

if(rIndex==0)
{

document.getElementById('name_inn_text_composition').value="";
document.getElementById('quantity_composition').value="";
document.getElementById('reason_inclusion_composition').value="";
document.getElementById('reference_standard_composition').value="";
document.getElementById('composition_type_composition').value='';
document.getElementById('id_update_compostion').value='';

updated.style.display = "none";
saved.style.display = "block";
id_for_update.style.display = "none";

}   
else{
document.getElementById('id_update_compostion').innerHTML = this.cells[0].innerHTML;
document.getElementById('name_inn_text_composition').value = this.cells[2].innerHTML;
document.getElementById('quantity_composition').value = this.cells[3].innerHTML;
document.getElementById('reason_inclusion_composition').value = this.cells[4].innerHTML;
document.getElementById('reference_standard_composition').value= this.cells[5].innerHTML;
document.getElementById('composition_type_composition').value = this.cells[6].innerHTML;

saved.style.display = "none";
updated.style.display = "block";
id_for_update.style.display = "none";

}
}
}
});


$('#table_product_manufacturer_api').click(function () {
var table = document.getElementById('table_product_manufacturer_api'),rIndex;
var count=table.rows.length;
for(var i =0; i < table.rows.length ; i++)
{ 
var row = table.rows[i];
row.onclick = function()
{
rIndex = this.rowIndex;
console.log(rIndex);
var updated = document.getElementById('product_manufacturer_update');
var saved = document.getElementById('product_manufacturer_save');
var id_for_update = document.getElementById('id_for_update');
if(rIndex==0)
{
document.getElementById('manufacturer_block').value="";
document.getElementById('manufacturer_name').value="";
document.getElementById('manufacturer_country').value="";

document.getElementById('manufacturer_postal_code').value="";
document.getElementById('manufacturer_tele').value="";
document.getElementById('manufacturer_city').value="";
document.getElementById('manufacturer_state').value="";
document.getElementById('manufacturer_add_line_one').value="";
document.getElementById('manufacturer_add_line_two').value="";
//document.getElementById('manufacturer_email').value="";
document.getElementById('manufacturer_activity').value="";
//document.getElementById('manufacturer_url').value='';
document.getElementById('manu_response_tele').innerHTML="";
document.getElementById('id_for_update').value='';
updated.style.display = "none";
saved.style.display = "block";
id_for_update.style.display = "none";
}   
else{

    $.ajax({ data:{ 
                          country_name:this.cells[3].innerHTML,
                            },
                        url: "{{ url('/Get_country_id/GetId')   }}",
                        type: "POST",
                        dataType: 'json',
                        success: function (data) {
                          var country_id = data.CountryID;
                          document.getElementById('manufacturer_country').value=country_id;
                                                 },
                        error: function (data) {
                            console.log('Error:', data);
                            $('#saveBtn').html('Save Changes');
                            } 
                            });


document.getElementById('id_for_update').innerHTML = this.cells[0].innerHTML;
document.getElementById('manufacturer_name').value=this.cells[2].innerHTML;
//document.getElementById('manufacturer_country').innerHTML=this.cells[3].innerHTML;

document.getElementById('manufacturer_postal_code').value=this.cells[4].innerHTML;
document.getElementById('manufacturer_tele').value=this.cells[5].innerHTML;
document.getElementById('manufacturer_state').value=this.cells[6].innerHTML;
document.getElementById('manufacturer_add_line_one').value=this.cells[7].innerHTML;
document.getElementById('manufacturer_add_line_two').value=this.cells[8].innerHTML;
//document.getElementById('manufacturer_url').value=this.cells[9].innerHTML;
document.getElementById('manufacturer_activity').value=this.cells[9].innerHTML;
document.getElementById('manufacturer_block').value=this.cells[10].innerHTML;
document.getElementById('manufacturer_unit').value=this.cells[11].innerHTML;
//document.getElementById('manufacturer_email').value=this.cells[13].innerHTML;
document.getElementById('manufacturer_city').value=this.cells[12].innerHTML;
document.getElementById('manu_response_tele').innerHTML =this.cells[13].innerHTML;
saved.style.display = "none";
updated.style.display = "block";
id_for_update.style.display = "none";
}}}
});























 $('#saveBtn').click(function (e) {
        e.preventDefault();
        $(this).html('Save');
    
        $.ajax({
          data: $('#bookForm').serialize(),
          url: "{{ route('books.store') }}",
          type: "POST",
          dataType: 'json',
          success: function (data) {
   
              $('#bookForm').trigger("reset");
              $('#ajaxModel').modal('hide');
              table.draw();
         
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }
      });
    });

  });


  $(function() {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    $('.swalDefaultSuccess').click(function() {
      Toast.fire({
        icon: 'success',
        title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.swalDefaultInfo').click(function() {
      Toast.fire({
        icon: 'info',
        title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.swalDefaultError').click(function() {
      Toast.fire({
        icon: 'error',
        title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.swalDefaultWarning').click(function() {
      Toast.fire({
        icon: 'warning',
        title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.swalDefaultQuestion').click(function() {
      Toast.fire({
        icon: 'question',
        title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });

    $('.toastrDefaultSuccess').click(function() {
      toastr.success('Lorem ipsum dolor sit amet, consetetur sadipscing elitr.')
    });
    $('.toastrDefaultInfo').click(function() {
      toastr.info('Lorem ipsum dolor sit amet, consetetur sadipscing elitr.')
    });

    $('.toastrDefaultError').click(function() {
      toastr.error('Lorem ipsum dolor sit amet, consetetur sadipscing elitr.')
    });

    $('.toastrDefaultWarning').click(function() {
      toastr.info('Lorem ipsum dolor sit amet, consetetur sadipscing elitr.')
    });

    $('.toastsDefaultDefault').click(function() {
      $(document).Toasts('create', {
        title: 'Toast Title',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultTopLeft').click(function() {
      $(document).Toasts('create', {
        title: 'Toast Title',
        position: 'topLeft',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultBottomRight').click(function() {
      $(document).Toasts('create', {
        title: 'Toast Title',
        position: 'bottomRight',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultBottomLeft').click(function() {
      $(document).Toasts('create', {
        title: 'Toast Title',
        position: 'bottomLeft',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultAutohide').click(function() {
      $(document).Toasts('create', {
        title: 'Toast Title',
        autohide: true,
        delay: 750,
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultNotFixed').click(function() {
      $(document).Toasts('create', {
        title: 'Toast Title',
        fixed: false,
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultFull').click(function() {
      $(document).Toasts('create', {
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        title: 'Toast Title',
        subtitle: 'Subtitle',
        icon: 'fas fa-envelope fa-lg',
      })
    });
    $('.toastsDefaultFullImage').click(function() {
      $(document).Toasts('create', {
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        title: 'Toast Title',
        subtitle: 'Subtitle',
        image: '../../dist/img/user3-128x128.jpg',
        imageAlt: 'User Picture',
      })
    });
    $('.toastsDefaultSuccess').click(function() {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Toast Title',
        subtitle: 'Subtitle',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultInfo').click(function() {
      $(document).Toasts('create', {
        class: 'bg-info',
        title: 'Toast Title',
        subtitle: 'Subtitle',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultWarning').click(function() {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Toast Title',
        subtitle: 'Subtitle',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultDanger').click(function() {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Toast Title',
        subtitle: 'Subtitle',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.toastsDefaultMaroon').click(function() {
      $(document).Toasts('create', {
        class: 'bg-maroon',
        title: 'Toast Title',
        subtitle: 'Subtitle',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
  });


    function Email_Validate(Email,url,xmlxhttp_response_id,save_id,crr_email) {


 var warning = xmlxhttp_response_id +"_warning";
 var danger = xmlxhttp_response_id +"_danger";
 var success = xmlxhttp_response_id +"_success";

if (Email != '') {



  jQuery(document).ready(function() {
      $.ajaxSetup({
            headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                     }
                                  });
     jQuery.ajax({
            url: url,
            method: 'post',
            data: {
                Email: jQuery('#'+crr_email).val(),
            },
            success: function(result) {
              jQuery('#'+danger).hide('100');
                if (result.error == undefined) {
               var id = setInterval(validate, 20);
              function validate() {
              if ((Email.indexOf("@") < 1) || ((Email.indexOf("@") == (Email.length < 1)))) {
                            jQuery('#'+warning).show('100');
                            jQuery('#'+warning).html('Invalid Email Axerate Symbol is Absent');
                            //document.getElementById(crr_email).focus();
                            jQuery('#'+save_id).addClass("error");
                            jQuery('#'+save_id).text('Invalid Email Axerate Symbol is Absent');
                            document.getElementById(save_id).disabled = true;
                            jQuery('#'+save_id).hide('100');
                    
                            clearInterval(id);
                            return false
                        }

                        if (Email.indexOf("@") <= 4) {
                            jQuery('#'+warning).show('100');
                            jQuery('#'+warning).html('Invalid Email Length is fewer than expected,5 charcters are expected as minimum');
                           // document.getElementById(crr_email).focus();
                           // jQuery('#'+save_id).addClass("error");
                            jQuery('#'+save_id).hide('100');
                            document.getElementById(save_id).disabled = true;
                            clearInterval(id);
                            return false
                        }

                        if ((Email.indexOf(".") == -1)) {
                            document.getElementById(save_id).disabled = true;
                            jQuery('#'+save_id).hide('100');
                            jQuery('#'+warning).show('100');
                            jQuery('#'+warning).html('Invalid Email (.) Symbol is Absent');
                            //document.getElementById(crr_email).focus();
                            clearInterval(id);
                            return false
                        }

                        if ((Email.indexOf("@") > 1) || ((Email.indexOf("@") != (Email.length < 1)) || (Email.indexOf(".") != -1)))
                         {
                            document.getElementById(save_id).disabled = false;
                            jQuery('#'+save_id).show('100');
                            jQuery('#'+warning).hide('100');
                            //document.getElementById(save_id).focus();
                            clearInterval(id);
                        }



                    }

                } else {
                    jQuery('#'+danger).show('100');
                    jQuery('#'+danger).html(result.error);
                    $("#"+danger).animate({ right: '15px' });
                    jQuery('#'+success).hide('100');
                    jQuery('#'+warning).hide('100');
                    document.getElementById(save_id).disabled = true;
                    jQuery('#'+save_id).hide('100');


                }
            },
        });

    });

} else {

    //jQuery('#'+danger).hide('50');
    jQuery('#'+warning).hide('50');
    //jQuery('#'+success).hide('50');
}

}


//Section To Validate URL 
function valdiate_url(url_string,xmlxhttp_response_id,url,action_button) {


 var warning = xmlxhttp_response_id +"_warning";
 var danger = xmlxhttp_response_id +"_danger";
 var success = xmlxhttp_response_id +"_success";


if (url_string != '') {
   jQuery(document).ready(function() {
      $.ajaxSetup({
            headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                     }
              });

     jQuery.ajax({
            url: url,
            method: 'post',
            data: {
                url: url_string,
            },

            success: function(result) {
              //alert(result.Message);
              var id = setInterval(validate, 500);
              function validate() {
           if(result.Message == 0)
            {
           //document.getElementById(response_id).innerHTML = result.Code;
           jQuery('#'+danger).show();
           jQuery('#'+success).hide();
           jQuery('#'+danger).html(result.error);
           clearInterval(id);
           document.getElementById(action_button).disabled = true;
           jQuery('#'+action_button).hide('100');
            }

           else if(result.Message == 1)
            {
        jQuery('#'+success).show();
        jQuery('#'+danger).hide();
       jQuery('#'+success).html(result.success);
       clearInterval(id);
       document.getElementById(action_button).disabled = false;
       jQuery('#'+action_button).show('100');
            }

      
                    }

            }
        });

    });

} 

else{
  jQuery('#'+danger).hide();
  jQuery('#'+success).hide();
  document.getElementById(action_button).disabled = false;
  jQuery('#'+action_button).show('100');

}

}




 $('#new_applicant_update').click(function () {
    if( document.getElementById('new_applicant_update').checked==true) 
    {var m = true;console.log(m);}
    $('#General_Supplier').show();
    $('#cs_tradename_exits').hide();
    $('#cs_save').show();
    $('#cs_trade_name').show();
   

    
    
    document.getElementById('css_country').disabled=false;
    document.getElementById('cs_city').disabled=false;
    document.getElementById('cs_state').disabled=false;
    document.getElementById('cs_address_line_one').disabled=false;
    document.getElementById('cs_address_line_two').disabled = false;
    document.getElementById('cs_email').disabled = false;
    document.getElementById('cs_tele').disabled = false;
    document.getElementById('cs_website_url').disabled = false;
    /*
     //Set Value to Null
     // Set Element  to Disabled  
    document.getElementById('css_country').value='';
    document.getElementById('cs_city').value = '';
    document.getElementById('cs_state').value = '';
    document.getElementById('cs_address_line_one').value = '';
    document.getElementById('cs_address_line_two').value = '';
    document.getElementById('cs_email').value = '';
    document.getElementById('cs_tele').value = '';
    document.getElementById('cs_website_url').value = '';
*/


});  
    
    $('#old_applicant_update').click(function () 
    {
    $('#application_wizard').show();
    $('#cs_tradename_exits').show();
    $('#cs_trade_name').hide();
    $('#cs_save').show();



    });


</script>



