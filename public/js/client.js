(function ($) {
    /*
    populates age select on signup form with values 1-100
    */
    var signupAge = '';
    for (let i = 18; i <= 100; i++) {
        signupAge += `<option val=${i}>${i}</option>`;
    }
    $('#signup-age').html(signupAge);

    $('.login-error-div').hide();
    $('#delete-act-div').hide();

    $('#delete-act-btn').click(function (event) {
        $('#delete-act-btn').hide();
        $('#delete-act-div').show();
        event.stopPropagation();
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

    //Validate event comment submission before sending to route
    var eventComment = $('#add_comment');
    $(eventComment).on('submit', function(e) {
        e.preventDefault();
        var comment = $('#comment_text').val();
        if (!comment || comment.trim().length == 0) {
            // empty comment :(
        }
        else {
            $(this).unbind();
            $(this).submit();
        }
    });

    //Validate search by event term
    var searchEvent = $('#search_event');
    $(searchEvent).on('submit', function(e) {
        e.preventDefault();
        var term = $('#search').val();
        if (!term || term.trim().length == 0) {
            // empty search term :(
        }
        else {
            $(this).unbind();
            $(this).submit();
        }
    });

    //Validate login form
    var loginForm = $('#login-form');
    $(loginForm).submit(function(e) {
        e.preventDefault();
        var email = $('#login-email').val();
        var password = $('#login-password').val();
        console.log(email);
        console.log(password);
        if (!email || email.trim().length == 0 || !password || password.trim().length == 0) {
            $('#login-email').addClass('login-input-error');
            $('#login-password').addClass('login-input-error');
            $('.login-error-div').show();
            $('#login-form').trigger('reset');
            $('#login-email').trigger('focus');
        }
        else {
            $('#login-email').removeClass('login-input-error');
            $('#login-password').removeClass('login-input-error');
            $('.login-error-div').hide();
            $(this).unbind();
            $(this).submit();
        }
    });
})(window.jQuery);