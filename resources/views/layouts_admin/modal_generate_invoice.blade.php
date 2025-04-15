
<link rel="stylesheet" href="{{asset('plugins/select2/css/select2.min.css')}}">

<link rel="stylesheet" href="{{asset('plugins/toastr/toastr.min.css')}}">

<script rel="javascript" src="{{ asset('plugins/toastr/toastr.min.js')}}" ></script>
<script rel="javascript" src="{{ asset('plugins/sweetalert2/sweetalert2.min.js')}}" ></script>

<div class="modal fade" id="ajaxModel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
    <input type="hidden" value="{{ Auth::user()->id }}" id="user_id" />
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modelHeading"></h4>
            </div>
            <div class="modal-body">
                <form id="bookForm" name="bookForm" class="form-horizontal">
                   <input type="hidden" name="application_id" id="application_id">

                    <div class="form-group">
                   <label class="col-sm-2 control-label">Applicant ID</label>
                   <div class="col-sm-12">
                   <input type="text" class="form-control" id="applicantt_id"    name="applicantt_id" placeholder="Applicant"  required>

                   </div>
                   </div>
                <div class="form-group">
                        <label for="name" class="col-sm-4 control-label">Invoice Number</label>
                        <div class="row">
                        <div class="col-sm-9">
                            <input type="text" readonly class="form-control" id="invoice_id" name="invoice_id" placeholder="Invoice" value="" maxlength="50" required="">
                       </div>  
                       <div class="col-sm-3">
                       <span    class="btn btn-danger  btn-sm" id="generate_invoice" >Generate Invoice</span>
                       </div>
</div>
                       </div>
     

 <div class="form-group">
                        <label class="col-sm-2 control-label">Remark</label>
                        <div class="col-sm-12">
                            <textarea id="remark" name="remark" required="" placeholder="Remark" class="form-control"></textarea>
                        </div>
                    </div>
                  


                      <div class="form-group">
                       <div id="rendered_template">
                           
                       </div>
                       <button style="display:none"  id='print_inv'  class='btn btn-warning float-right '><i class='fas fa-print'></i> Print/Generate To PDF</button>

                        </div>
 
<div  id="box_parent" style="border:1px solid green;margin:10px;width:400px;display:none">
<div id="box" style="background:#98bf21;height:50px;width:1px;border:1px solid green;"></div>
</div>

<p id="demo"></p>
                    <div class="col-md-offset-2 col-sm-10">
                     <button style="display:none"  type="submit" class="btn btn-primary" id="saveBtn" value="create">Save changes
                     </button>
                   
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
</div>






























<div class="modal fade" id="ajaxModel_showinvoices" aria-hidden="true">
    <div class="modal-dialog modal-lg">
    <input type="hidden" value="{{ Auth::user()->id }}" id="user_id" />
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modelHeading"></h4>
            </div>
            <div class="modal-body">
                <form id="InvoiceForm" name="invoiceForm" class="form-horizontal">
                   <input type="hidden" name="application_id" id="application_id">

                    <div class="form-group">
                   <label class="col-sm-2 control-label">Applicant ID</label>
                   <div class="col-sm-12">
                   <input type="text" class="form-control" id="applicantt_id"    name="applicantt_id" placeholder="Applicant"  required>

                   </div>
                   </div>
                <div class="form-group">
                        <label for="name" class="col-sm-4 control-label">Invoice Number</label>
                        <button type="button" class="btn btn-primary float-right" style="margin-right: 5px;">
                    <i class="fas fa-download"></i> Generate PDF
                  </button>
                   </div>
     

 <div class="form-group">
                        <label class="col-sm-2 control-label">Remark</label>
                        <div class="col-sm-12">
                            <textarea id="remark" name="remark" required="" placeholder="Remark" class="form-control"></textarea>
                        </div>
                    </div>
                  
         <div class="col-md-offset-2 col-sm-10">
                     <button style="display:none"  type="submit" class="btn btn-primary" id="saveBtn" value="create">Save changes
                     </button>
                   
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
</div>































































































<script type="text/javascript">


  $(function () {
      $.ajaxSetup({
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
    });

    var user_id = document.getElementById('user_idd').innerHTML;


   
    var table = $('.data-table').DataTable({
        processing: true,
        serverSide: true,
        data:  {
            
            sam_id:user_id,
               },
        ajax: "{{ route('invoices.index','sam_id' )}}",
       
          columns: [
            {data: 'DT_RowIndex', name: 'DT_RowIndex'},
            {data: 'id', name: 'id', 'visible': false},
            {data: 'application_id', name: 'application_id','visible': true},
            {data: 'user_id', name: 'user_id','visible': false},
            {data: 'product_name', name: 'product_name'},
            {data: 'product_trade_name', name: 'product_trade_name','visible':false},
            {data: 'trade_name', name: 'trade_name','visible':false},
            {data: 'name', name: 'name'},
            {data: 'application_type', name: 'application_type'},
            {data: 'invoice_number', name: 'invoice_number'},
            {data: 'remark', name: 'remark'},
            {data: 'amount', name: 'amount'},
            {data: 'action', name: 'action', orderable: true, searchable: true},
        ]
    });


	 $('#print_inv').click(function () {
         var divName = 'print_invoice';
        
     var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;
         document.body.innerHTML = printContents;
         window.print();
         document.body.innerHTML = originalContents;
	    // window.location="{{ url('/invoice') }}";

          
});


      $('#generate_invoice').click(function () {
      
        var application_id = document.getElementById('applicantt_id').value;
        var remark = document.getElementById('remark').value;
        var user_id = document.getElementById('user_id').value;
        var  invoice_id = document.getElementById('invoice_id').value;
        document.getElementById('box_parent').style.display = 'block';
        document.getElementById('demo').style.display = 'block';
        document.getElementById('rendered_template').style.display = 'none';
       
        
        if ( application_id == '') 
        
        {  document.getElementById('application_id').focus(); return false; } 
        $.ajax({
          url: "{{ url('/invoice_generate') }}",
          type: "POST",
          data: 
          {
           application_id:application_id,
           user_id:user_id,
           
           remark:remark,
          },
          success: function (data) {
            document.getElementById('rendered_template').style.display = 'block';
    $("#box").animate({
      width: "400px"
    }, {
      duration: 5000,
      easing: "linear",
      step: function(x) {

        $("#demo").text(Math.round(x * 100 / 400)  + "%");
        if(x==400)
        {
       document.getElementById('invoice_id').value= data.invoice_generated;
       document.getElementById('rendered_template').innerHTML = data.rendered_template;
       document.getElementById('print_inv').style.display="block";
       document.getElementById('saveBtn').style.display="block";
       document.getElementById('saveBtn').focus();
       document.getElementById('box_parent').style.display = 'none';
       document.getElementById('demo').style.display = 'none';

        }

      }
    });

var Toast = Swal.mixin({
      toast: true,
      position: 'top-center',
      showConfirmButton: false,
      timer: 1
    }); 
toastr.success("Invoice Generated successully")

    



          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }
      });
       
    });








    $('#createNewBook').click(function () {
        //alert("hellow Eyoba");
        $('#saveBtn').val("create-book");
        $('#application_id').val('');
        $('#bookForm').trigger("reset");
        $('#modelHeading').html("Generate Invoice Number");
        $('#ajaxModel').modal('show');
    });



    $('body').on('click', '.editBook', function () {
      var application_id = $(this).data('id');
     
     
          $('#modelHeading').html("Generate Invoice Number");
          $('#saveBtn').val("edit-book");
          $('#applicantt_id').val(application_id);
          $('#ajaxModel').modal('show');
          $('#application_id').val(application_id);
         document.getElementById('rendered_template').innerHTML = "";
         
     



   });




   $('body').on('click', '.showInvoices', function () {
      var application_id = $(this).data('id');
     
     
          $('#modelHeading').html(application_id);
          $('#saveBtn').val("edit-book");
          $('#applicantt_id').val(application_id);
          $('#ajaxModel_showinvoices').modal('show');
          $('#application_id').val(application_id);
         document.getElementById('rendered_template').innerHTML = "";
         
     
        });





    $('#saveBtn').click(function (e) {
        e.preventDefault();
        $(this).html('Save');
    
        var  application_id = document.getElementById('applicantt_id').value;
        var  remark = document.getElementById('remark').value;
        var  user_id = document.getElementById('user_id').value;
        var  invoice_id = document.getElementById('invoice_id').value;
        var amount_value = document.getElementById('amount_value').innerHTML;
        var rendered_template = document.getElementById('rendered_template').innerHTML;
       
        
        if ( application_id == '') 
        
        {  document.getElementById('application_id').focus(); return false; } 
        $.ajax({
          url: "{{ route('invoices.save_invoices_now') }}",
          type: "POST",
          data: 
          {
           application_id:application_id,
           user_id:user_id,
           remark:remark,
           invoice_number:invoice_id,
           amount:amount_value ,
           
          },
          success: function (data) {
            if( data.Message == true )
            {
              $('#bookForm').trigger("reset");
              $('#ajaxModel').modal('hide');
               table.draw();
      var Toast = Swal.mixin({
      toast: true,
      position: 'top-center',
      showConfirmButton: false,
      timer: 6000
       }); 
    toastr.success("Invoice Generated successully");
    table.draw();

            }
      
          },
          error: function (data) {
              console.log('Error:', data);
              $('#saveBtn').html('Save Changes');
          }
      });

    });
    
    $('body').on('click', '.deleteBook', function () {
     
        var application_id = $(this).data("id");
        {if(confirm("Are You sure You Want To Delete This File")){}else{return false;}}
        $.ajax({
            type: "DELETE",
            url: "{{ route('books.store') }}"+'/'+application_id,
            success: function (data) {
                table.draw();
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });
     
  });
</script>




