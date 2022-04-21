const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    if (req.session.userId) {
        res.render('shows/all_events', {title: "All Events", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`});
    }
});

module.exports = router;