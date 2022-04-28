const express = require('express');
const router = express.Router();
const data = require('../data');
const events = data.events;
const userData = data.users;
const allEvents=data.allEvents;
const validation = require('../validation');
const xss=require('xss');

router.get('/', async (req, res) => {
    let allTags = await allEvents.get_all_tags();
    if (xss(req.session.userId)) {
        try{
            let eventList=await allEvents.get_all_events();
            res.render('shows/all_events', {title: "All Events", events:eventList, loggedIn: true, name: `${(await userData.get(xss(req.session.userId))).firstName} ${(await userData.get(xss(req.session.userId))).lastName}`, tags: allTags});
        } catch(e){
            res.status(400).json({e});
            return;
        }
    }
});

router.get('/add', async (req, res) => {
    //add creator check?
    if(req.session.userId){
        res.render('events/add', {title: "Create Event", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
    }else {
        res.status(400).render('shows/user_not_loggedin', {title: "Not Logged In"})
    }
});

router.post('/search',async(req,res) => {
    let search=xss(req.body.eventSearchTerm);
    let allTags = await allEvents.get_all_tags();
    try{
        search=validation.checkString(search,'Search Term');
        try{
            let eventList=await allEvents.search_for_event(search);
            res.render('shows/all_events', {title: "All Events", events:eventList, loggedIn: true, name: `${(await userData.get(xss(req.session.userId))).firstName} ${(await userData.get(xss(req.session.userId))).lastName}`, tags: allTags});
        } catch(e){
            res.status(400);
            res.render('shows/all_events', {title: "All Events", error:e,hasErrorSearch:true, loggedIn: true, name: `${(await userData.get(xss(req.session.userId))).firstName} ${(await userData.get(xss(req.session.userId))).lastName}`, tags: allTags});
        }
        
    }catch(e){
        res.status(400);
        res.render('shows/all_events', {title: "All Events", error:e,hasErrorSearch:true, loggedIn: true, name: `${(await userData.get(xss(req.session.userId))).firstName} ${(await userData.get(xss(req.session.userId))).lastName}`, tags: allTags});
        
    }
});

router.post('/filter',async(req,res) => {
    let tag=xss(req.body.eventSearchTag);
    let allTags = await allEvents.get_all_tags();
    try{
        search=validation.checkString(tag,'Tag Term');
        if(!allTags.includes(tag)){
            throw 'Value is not equal to one of the options that the user can select';
        }
        try{
            let eventList=await allEvents.get_events_by_tag(tag);
            res.render('shows/all_events', {title: "All Events", events:eventList, loggedIn: true, name: `${(await userData.get(xss(req.session.userId))).firstName} ${(await userData.get(xss(req.session.userId))).lastName}`, tags: allTags});
        } catch(e){
            res.status(400);
            res.render('shows/all_events', {title: "All Events",events:eventList, error:e,hasErrorTag:true, loggedIn: true, name: `${(await userData.get(xss(req.session.userId))).firstName} ${(await userData.get(xss(req.session.userId))).lastName}`, tags: allTags});
        }
        
    }catch(e){
        res.status(400);
        res.render('shows/all_events', {title: "All Events", error:e,hasErrorTag:true, loggedIn: true, name: `${(await userData.get(xss(req.session.userId))).firstName} ${(await userData.get(xss(req.session.userId))).lastName}`, tags: allTags});
        
    }
});

router.post('/add', async (req, res) => {
    let name = xss(req.body.name);
    let date = xss(req.body.date);
    let time = xss(req.body.time);
    let location = xss(req.body.location);
    let description = xss(req.body.description);
    let tags = xss(req.body.tags);
    
    if (req.session.userId){
        try{
            name = validation.checkString(name, 'Name');
            creator = validation.checkId(req.session.userId, 'Creator');
            date = validation.checkDate(date, 'Date');
            time = validation.checkTime(time, 'Time');
            location = validation.checkString(location, 'Location');
            description = validation.checkString(description, 'Description');
            tags = validation.formatTags(tags, 'Tags');
            tags = validation.checkStringArray(tags, 'Tags', 1);
            
            try{
                const newEvent = await events.createEvent(
                    name,
                    [],
                    creator,
                    date,
                    time,
                    location,
                    description,
                    tags
                );
                let allTags = await allEvents.get_all_tags();
                let eventList=await allEvents.get_all_events();
                res.render('shows/all_events', {title: "All Events", events:eventList, loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, tags: allTags});
            }catch (e) {
                console.log(e);
                res.status(400).json({error: e});
            }
        }catch (e) {
            res.status(400).json({error: e});
        }
    }else {
        res.status(400).render('shows/user_not_loggedin', {title: "Not Logged In"})
    }
});

/* router.get('/registered', async(req, res) => { //Calvin TODO. This route has to go above the get /:id route
    res.redirect('/');
}); */

router.get('/:id', async (req, res) => {
    let id = undefined;
    try {
        id = validation.checkId(req.params.id, 'Event ID'); //make sure valid ID
        //console.log(id)
        //Next, get the event
        let event = await events.get(id);
        //console.log(event);
        //events.addComment('626429629c0d0ce0f61dbbcd', '6264295f9c0d0ce0f61dbbca', "this is awsome!", "today");
        let comments = event.comments;
        let comments_list = [];
        for (let x of comments) {
            //console.log(x)
            let user = await userData.get(x.userId.toString()); //this should be userID, change in the database function
            let user_name = `${user.firstName} ${user.lastName}`;
            comments_list.push({name: user_name, comment: x.comment, datePosted: x.datePosted});
        }
        let eventCreator = await userData.get(event.creator.toString());
        let event_creator_name = `${eventCreator.firstName} ${eventCreator.lastName}`;

        if (event.users_registered.includes(req.session.userId)) {
            res.render('shows/event', {title: event.name, user_id: req.session.userId, event_name: event.name, event_id: event._id.toString(), event_creator: event_creator_name, event_date: event.date, event_time: event.time, event_location: event.location, event_description: event.description, event_tags: event.tags, event_comments: comments_list, alreadyRegistered: true, numAttending: event.users_registered.length});
        } else {
            res.render('shows/event', {title: event.name, user_id: req.session.userId, event_name: event.name, event_id: event._id.toString(), event_creator: event_creator_name, event_date: event.date, event_time: event.time, event_location: event.location, event_description: event.description, event_tags: event.tags, event_comments: comments_list, numAttending: event.users_registered.length});
        }        
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
    
});

router.post('/join', async (req, res) => {
    let event_id = undefined;
    let user_id = undefined
    try {
        event_id = validation.checkId(req.body.event_id, 'Event ID');
        user_id = validation.checkId(req.body.user_id, 'User ID');
    } catch (error) { //this shouldnt happen
        res.status(400).json({error});
        return;
    }

    //Now, try to join the event

    try {
        events.addUserToEvent(event_id, user_id);
        userData.joinEvent(event_id, user_id);
    } catch (error) { //this also shouldn't happen
        res.status(400).json({error});
        return;
    }
    
    res.redirect(`/events/${event_id}`); //After you join, go back home
});

router.post('/unjoin', async (req, res) => {
    let event_id = undefined;
    let user_id = undefined
    try {
        event_id = validation.checkId(req.body.event_id, 'Event ID');
        user_id = validation.checkId(req.body.user_id, 'User ID');
    } catch (error) { //this shouldnt happen
        res.status(400).json({error});
        return;
    }

    //Now, try to unjoin the event

    try {
        events.removeUserFromEvent(event_id, user_id);
        userData.unjoinEvent(event_id, user_id);
    } catch (error) { //this also shouldn't happen
        res.status(400).json({error});
        return;
    }
    
    res.redirect(`/events/${event_id}`); //After you unjoin, go back home
});


module.exports = router;