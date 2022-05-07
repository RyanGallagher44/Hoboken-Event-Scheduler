const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;
const eventData = data.events;

router.get('/', async (req, res) => {
    //Create array of objects that the user is registered for, holding the name of the event and the date of the event
    if (!req.session.userId) { //If not logged in, go to signup page
        res.render('shows/login', {title: 'Sign Up'});
        return
    }
    
    let user = undefined;
    try {
        user = await users.get(req.session.userId);
    } catch (e) { //shouldn't happen
        res.status(400).json({error: e});
    }

    let events = user.regEvents; //list of events that the user is signed up for
    let event_name_list = []; //array of object names
    let event_date_list = []; //array of object names

    for (let x of events) {
        let event = await eventData.get(x);
        event_name_list.push(event.name);
        event_date_list.push(event.date);
    }
    
    try {
        res.render('shows/calendar', {title: 'Calendar', loggedIn: true, event_names: event_name_list, event_dates: event_date_list, name: `${(await users.get(req.session.userId)).firstName} ${(await users.get(req.session.userId)).lastName}`});
    } catch (e) {
        res.status(500).json({error: e});
    }
});

module.exports = router;