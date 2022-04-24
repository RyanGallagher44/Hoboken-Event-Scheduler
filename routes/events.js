const express = require('express');
const router = express.Router();
const data = require('../data');
const events = data.events;
const userData = data.users;
const allEvents=data.allEvents;
const validation = require('../validation');

router.get('/', async (req, res) => {
    if (req.session.userId) {
        try{
            let eventList=await allEvents.get_all_events();
            res.render('shows/all_events', {title: "All Events", events:eventList, loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
        } catch(e){
            res.status(400).json({e});
            return;
        }
    }
});

router.get('/add', async (req, res) => {
    //add creator check?

    res.render('events/add', {title: "Create Event"});
});

router.post('/search',async(req,res) => {
    let search=req.body.eventSearchTerm;
    try{
        search=validation.checkString(search,'Search Term');
        try{
            let eventList=await allEvents.search_for_event(search);
            res.render('shows/all_events', {title: "All Events", events:eventList, loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
        } catch(e){
            res.status(400);
            res.render('shows/all_events', {title: "All Events", error:e,hasErrorSearch:true, loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
        }
        
    }catch(e){
        res.status(400);
        res.render('shows/all_events', {title: "All Events", error:e,hasErrorSearch:true, loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
        
    }
});

router.post('/filter',async(req,res) => {
    let tag=req.body.eventSearchTag;
    try{
        search=validation.checkString(tag,'Tag Term');
        try{
            let eventList=await allEvents.get_events_by_tag(tag);
            res.render('shows/all_events', {title: "All Events", events:eventList, loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
        } catch(e){
            res.status(400);
            res.render('shows/all_events', {title: "All Events",events:eventList, error:e,hasErrorTag:true, loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
        }
        
    }catch(e){
        res.status(400);
        res.render('shows/all_events', {title: "All Events", error:e,hasErrorTag:true, loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
        
    }
});

router.post('/add', async (req, res) => {
    let name = req.body.name;
    let date = req.body.date;
    let time = req.body.time;
    let location = req.body.location;
    let description = req.body.description;
    let tags = req.body.tags;
    
    try{
        name = validation.checkString(name, 'Name');
        //creator = validation.checkId(creator, 'Creator');
        date = validation.checkDate(date, 'Date');
        time = validation.checkTime(time, 'Time');
        location = validation.checkString(location, 'Location');
        description = validation.checkString(description, 'Description');
        tags = validation.checkStringArray([tags], 'Tags', 1);
        try{
            const newEvent = await events.createEvent(
                name,
                [],
                "temp",
                date,
                time,
                location,
                description,
                tags
              );
              res.status(200).json(newEvent);
        }catch (e) {
            console.log(e);
            res.status(400).json({error: e});
        }
    }catch (e) {
        res.status(400).json({error: e});
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

        res.render('shows/event', {title: event.name, user_id: req.session.userId, event_name: event.name, event_id: event._id.toString(), event_creator: event_creator_name, event_date: event.date, event_time: event.time, event_location: event.location, event_description: event.description, event_tags: event.tags, event_comments: comments_list});
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
    
    res.redirect('/events/'); //After you join, go back home


    
});

module.exports = router;