function ValidateEmail(Email) {

    if (Email != '') {

        jQuery(document).ready(function() {

            $.ajaxSetup({
                headers: {

                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                }
            });

            jQuery.ajax({
                url: "{{  url('/Validate/post')}}",
                method: 'post',
                data: {
                    Email: jQuery('#email').val(),
                },
                success: function(result) {

                    if (result.error == undefined) {

                        jQuery('#success').show();
                        jQuery('#success').html(result.success);
                        jQuery('#danger').hide();
                        $("#sucess").animate({ left: '250px' });
                        jQuery('#success').hide();

                        var id = setInterval(validate, 500);

                        function validate() {

                            if ((Email.indexOf("@") < 1) || ((Email.indexOf("@") == (Email.length < 1)))) {
                                jQuery('#warning').show();
                                jQuery('#warning').html('Invalid Email Axerate Symbol is Absent');
                                document.getElementById('email').focus();
                                document.getElementById('Register').disabled = true;
                                clearInterval(id);
                                return false
                            }

                            if (Email.indexOf("@") <= 4) {
                                jQuery('#warning').show();
                                jQuery('#warning').html('Invalid Email Length is fewer than expected');
                                document.getElementById('email').focus();
                                document.getElementById('Register').disabled = true;
                                clearInterval(id);
                                return false
                            }

                            if ((Email.indexOf(".") == -1)) {
                                document.getElementById('Register').disabled = true;
                                jQuery('#warning').show();
                                jQuery('#warning').html('Invalid Email (.) Symbol is Absent');
                                document.getElementById('email').focus();
                                clearInterval(id);
                                return false
                            }

                            if ((Email.indexOf("@") > 1) || ((Email.indexOf("@") != (Email.length < 1)) || (Email.indexOf(".") != -1))) {
                                document.getElementById('Reg_Register').disabled = false;
                                jQuery('#warning').hide();
                                document.getElementById('Email').focus();
                                clearInterval(id);
                            }



                        }

                    } else {
                        jQuery('#danger').show();
                        jQuery('#danger').html(result.error);
                        $("#danger").animate({ left: '250px' });
                        jQuery('#success').hide();
                        jQuery('#warning').hide();
                        document.getElementById('Reg_Register').disabled = true;


                    }
                },
            });

        });

    } else {

        jQuery('#danger').hide();
        jQuery('#warning').hide();
        jQuery('#success').hide();
    }

}