const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    const pastHosted = await userData.getPastHostedEvents(req.session.userId);
    const pastAttended = await userData.getPastAttendedEvents(req.session.userId);
    const recommendedEvents = await userData.getRecommendedEvents(req.session.userId);
    req.session.prevURL = '/user';
    res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, age: `${(await userData.get(req.session.userId)).age}`, email: `${(await userData.get(req.session.userId)).email}`, events_hosted: pastHosted, events_attended: pastAttended, recommended_events: recommendedEvents})
});

router.get('/delete', async (req, res) => {
    try {
        await userData.remove(req.session.userId);
        res.redirect('/logout');
    } catch (e) {
        console.log(e);
    }
});

router.get('/regEvents', async (req, res) => {
    const evList = await userData.getRegisteredEvents(req.session.userId);
    const user = await userData.get(req.session.userId);
    req.session.prevURL = '/user/regEvents';
    res.render("shows/registeredEvents", {title: "My Registered Events", name: `${user.firstName} ${user.lastName}`, events: evList, loggedIn: true, myReg: true});
})

module.exports = router;