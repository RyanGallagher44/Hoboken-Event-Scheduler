(function ($) {
    /*
    populates age select on signup form with values 1-100
    */
    var signupAge = '';
    for (let i = 18; i <= 100; i++) {
        signupAge += `<option val=${i}>${i}</option>`;
    }
    $('#signup-age').html(signupAge);
})(window.jQuery);