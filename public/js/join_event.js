

(function ($) {
    /*
    populates age select on signup form with values 1-100
    */
    
    var joinEvent = $('#join_event_data'),
        eidt = $('#eid'),
        uidt = $('#uid');
        newEID = eidt.val();
        newUID = uidt.val();
    
        joinEvent.submit(function (event) {
            event.preventDefault();
            var requestConfig = {
                method: 'POST',
                url: '/events/join',
                contentType: 'application/json',
                data: JSON.stringify({
                    eid: newEID,
                    uid: newUID
                })
            };
            console.log(requestConfig)
            $.ajax(requestConfig).then(function (responseMessage) {
                console.log('Success')
            });
        });

})(window.jQuery);