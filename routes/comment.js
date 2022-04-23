const express = require('express');
const router = express.Router();
const data = require('../data');
const events = data.events;
const validation = require('../validation');

router.post('/', async (req, res) => {
    let event_id = undefined;
    let user_id = undefined
    let comment = undefined;
    try {
        event_id = validation.checkId(req.body.event_id, 'Event ID');
        user_id = validation.checkId(req.body.user_id, 'User ID');
        comment = validation.checkString(req.body.comment_text, 'Comment');
    } catch (error) { //this shouldnt happen
        res.status(400).json({error});
        return;
    }

    //Now, try to add the comment
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    try {
        events.addComment(event_id, user_id, comment, today)
    } catch (error) {
        res.status(400).json({error});
        return;
    }

    res.redirect(`/events/${event_id}`); //Go back to the event page
});

module.exports = router;