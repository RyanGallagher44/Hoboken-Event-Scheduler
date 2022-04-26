const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, age: `${(await userData.get(req.session.userId)).age}`, email: `${(await userData.get(req.session.userId)).email}`})
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
    res.render("shows/registeredEvents", {title: "My Registered Events", userName: user.firstName, events: evList});
})

module.exports = router;