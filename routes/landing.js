const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    let userId = xss(req.session.userId);
    if (userId) {
        const user = await userData.get(userId);
        res.render('shows/all_events', {title: "All Events", loggedIn: true, name: `${user.firstName} ${user.lastName}`});
    }
});

module.exports = router;