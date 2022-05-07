function isLeapYear(year) {
    if (year % 400 == 0) return true;
    if (year % 100 == 0) return false;
    if (year % 4 == 0) return true;

    return false;
}

function checkPassword(pwd) {
    if (!pwd) throw 'You must supply a password!';

    return pwd;
}

function checkConfirmPassword(pwd) {
    if (!pwd) throw 'You must confirm your password!';

    return pwd;
}

function checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces.`;
    return strVal;
}

function checkDateOfBirth(date, varName) {
    date = this.checkString(date, varName);
    let temp = new Date(date);
    if (!temp) throw `Error: Must ${varName} be a valid date string`;
    let current = new Date();
    if (temp.getTime() > current.getTime()) throw `Error: ${varName} must be a time in the past`
    return date;
}

(function ($) {
    $('.login-error-div').hide();
    $('.signup-error-div').hide();
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
    $(loginForm).submit(function (e) {
        e.preventDefault();
        var email = $('#login-email').val();
        var password = $('#login-password').val();
        if (!email || email.trim().length == 0 || !password || password.trim().length == 0) {
            $('.login-error-div').show();
            $('#login-form').trigger('reset');
            $('#login-email').trigger('focus');
        } else {
            $('.login-error-div').hide();
            $(this).unbind();
            $(this).submit();
        }
    });

    var signupForm = $('#signup-form');
    $(signupForm).submit(function (e) {
        e.preventDefault();
        var firstName = $('#signup-firstname').val();
        var lastName = $('#signup-lastname').val();
        var email = $('#signup-email').val();
        var dob = $('#signup-dob').val();
        var password = $('#signup-password').val();
        var passwordConfirm = $('#signup-password-confirm').val();
        
        try {
            firstName = checkString(firstName, "first name");
            lastName = checkString(lastName, "last name");
            email = checkString(email, "email");
            dob = checkDateOfBirth(dob, "date of birth");
            password = checkPassword(password);
            passwordConfirm = checkConfirmPassword(passwordConfirm);
            $(this).unbind();
            $(this).submit();
        } catch (e) {
            console.log(e);
        }
    });

    //AJAX post to join event
    var joinEvent = $('#join_event_data');
    var eid = $('#eid').val();
    var uid = $('#uid').val();

    joinEvent.submit(function (event) {
        event.preventDefault();
        if (!eid || !uid) {
            document.location.href = '/events'; //Redirect if error (this would only happen if someone screwed with the HTML, as these values are hidden)
        }
        if (eid.length == 0 || eid.trim().length == 0 || uid.length == 0 || uid.trim().length == 0) { //same as above
            document.location.href = '/events';
        }
        
        var requestConfig = {
            method: 'POST',
            url: '/events/join',
            contentType: 'application/json',
            data: JSON.stringify({
                event_id: eid,
                user_id: uid
            })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            location.reload();
        })
    });
})(window.jQuery);