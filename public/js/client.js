(function ($) {
    /*
    populates age select on signup form with values 1-100
    */
    var signupAge = '';
    for (let i = 18; i <= 100; i++) {
        signupAge += `<option val=${i}>${i}</option>`;
    }
    $('#signup-age').html(signupAge);

    $('#delete-act-btn').click(function () {
        $('#delete-act-btn').hide();
        $('#delete-act-div').show();
    });

    $('#cancel-delete-act-btn').click(function () {
        $('#delete-act-div').hide();
        $('#delete-act-btn').show();
    });

    /*
    AJAX form to delete user account
    */
    $('#delete-act-form').submit(function (event) {
        event.preventDefault();
        
        var requestConfig = {
            method: 'GET',
            url: '/user/delete'
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            $('html').html(responseMessage);
        });
    });
})(window.jQuery);