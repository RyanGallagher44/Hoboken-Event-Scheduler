const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, age: `${(await userData.get(req.session.userId)).age}`, email: `${(await userData.get(req.session.userId)).email}`})
});

router.get('/delete', async (req, res) => {
    try {
        console.log(await userData.remove(req.session.userId));
        res.redirect('/logout');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;