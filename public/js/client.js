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

function checkDate(date, varName) {
    console.log(date);
    console.log(varName);
    date = this.checkString(date, varName);
    console.log(date);
    let temp = new Date(date);
    console.log(temp);
    if (!temp) throw `Error: Must ${varName} be a valid date string`;
    let current = new Date();
    if (temp.getTime() > current.getTime()) throw `Error: ${varName} must be a time in the past`
    return date;
}

(function ($) {
    /*
    Date of Birth on Sign Up Functionality
    */
    var signupMonth = '';
    var months = ['Select', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    for (let i = 0; i < months.length; i++) {
        signupMonth += `<option value="${months[i]}">${months[i]}</option>`;
    }
    $('#signup-month').html(signupMonth);

    var signupYear = '<option value="Select">Select</option>';
    for (let i = 1900; i <= 2022; i++) {
        signupYear += `<option value="${i}">${i}</option>`;
    }
    $('#signup-year').html(signupYear);

    $('#signup-day').html('<option value="Select">Select</option>')

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
        var signupDay = '<option value="Select">Select</option>';
        for (let i = 1; i <= daysInMonth[selectedMonth]; i++) {
            signupDay += `<option value="${i}">${i}</option>`;
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
        var signupDay = '<option value="Select">Select</option>';
        for (let i = 1; i <= daysInMonth[selectedMonth]; i++) {
            signupDay += `<option value="${i}">${i}</option>`;
        }
        $('#signup-day').html(signupDay);
        $('#signup-day').val(selectedDay);
        daysInMonth[1] = 28;
    });
    /*
    End of DOB functionality
    */

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

    var signupForm = $('#signup-form');
    $(signupForm).submit(function (e) {
        e.preventDefault();
        var firstName = $('#signup-firstname').val();
        var lastName = $('#signup-lastname').val();
        var email = $('#signup-email').val();
        var month = $('#signup-month').val();
        var day = $('#signup-day').val();
        var year = $('#signup-year').val();
        var password = $('#signup-password').val();
        var passwordConfirm = $('#signup-password-confirm').val();
        var dob = '';
        
        try {
            firstName = checkString(firstName, "first name");
            lastName = checkString(lastName, "last name");
            email = checkString(email, "email");
            dob = checkDate(`${year}-${month}-${day}`, "date of birth");
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