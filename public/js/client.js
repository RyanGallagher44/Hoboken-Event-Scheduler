function isLeapYear(year) {
    if (year % 400 == 0) return true;
    if (year % 100 == 0) return false;
    if (year % 4 == 0) return true;

    return false;
}

(function ($) {
    var signupMonth = '';
    var months = ['Select', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    for (let i = 0; i < months.length; i++) {
        signupMonth += `<option val="${months[i]}">${months[i]}</option>`;
    }
    $('#signup-month').html(signupMonth);

    var signupYear = '<option val="Select">Select</option>';
    for (let i = 1900; i <= 2022; i++) {
        signupYear += `<option val="${i}">${i}</option>`;
    }
    $('#signup-year').html(signupYear);

    $('#signup-day').html('<option val="Select">Select</option>')

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    $('#signup-month').on('change', function () {
        var selectedMonth = months.indexOf($('#signup-month').val())-1;
        if ($('#signup-year').val() != 'Select') {
            if (selectedMonth == 1) {
                var ly = isLeapYear($('#signup-year').val());
                if (ly) {
                    daysInMonth[1] = 29;
                }
            }
        }
        var selectedDay = $('#signup-day').val();
        if (selectedDay > daysInMonth[selectedMonth]) {
            selectedDay = daysInMonth[selectedMonth];
        }
        $('#signup-day').empty();
        var signupDay = '<option val="Select">Select</option>';
        for (let i = 1; i <= daysInMonth[selectedMonth]; i++) {
            signupDay += `<option val="${i}">${i}</option>`;
        }
        $('#signup-day').html(signupDay);
        $('#signup-day').val(selectedDay);
        daysInMonth[1] = 28;
    });

    $('#signup-year').on('change', function () {
        var selectedMonth = months.indexOf($('#signup-month').val())-1;
        if ($('#signup-year').val() != 'Select') {
            if (selectedMonth == 1) {
                var ly = isLeapYear($('#signup-year').val());
                if (ly) {
                    daysInMonth[1] = 29;
                }
            }
        }
        var selectedDay = $('#signup-day').val();
        if (selectedDay > daysInMonth[selectedMonth]) {
            selectedDay = daysInMonth[selectedMonth];
        }
        $('#signup-day').empty();
        var signupDay = '<option val="Select">Select</option>';
        for (let i = 1; i <= daysInMonth[selectedMonth]; i++) {
            signupDay += `<option val="${i}">${i}</option>`;
        }
        $('#signup-day').html(signupDay);
        $('#signup-day').val(selectedDay);
        daysInMonth[1] = 28;
    });

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