const express = require('express');
const router = express.Router();
const data = require('../data');
const events = data.events;
const validation = require('../validation');

router.get('/add', async (req, res) => {
    //add creator check?

    res.render('events/add', {title: "Create Event"});
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

module.exports = router;