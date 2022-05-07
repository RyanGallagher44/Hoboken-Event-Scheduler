const express = require('express');
const router = express.Router();
const data = require('../data');
const events = data.events;
const validation = require('../validation');
const xss=require('xss');

router.post('/', async (req, res) => {
    let event_id = undefined;
    let user_id = undefined
    let comment = undefined;
    try {
        event_id = validation.checkId(xss(req.body.event_id), 'Event ID');
        user_id = validation.checkId(xss(req.body.user_id), 'User ID');
        comment = validation.checkString(xss(req.body.comment_text), 'Comment');
    } catch (e) { //this shouldnt happen
        res.status(400).json({error: e});
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
    } catch (e) {
        res.status(400).json({error: e});
        return;
    }

    res.redirect(`/events/${event_id}`); //Go back to the event page
});

module.exports = router;