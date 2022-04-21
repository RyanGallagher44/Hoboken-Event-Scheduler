const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    if (req.session.userId) {
        res.redirect('/events');
    } else {
        res.render('shows/login', {title: 'Login'});
    }
});

router.post('/login', async (req, res) => {
    try {
        let checkUserRes = await userData.check(req.body.login_email, req.body.login_password);
        if (checkUserRes.userAuthenticated != null) {
            req.session.userId = checkUserRes.userAuthenticated;
            res.redirect('/events');
        }
    } catch (e) {
        res.render('shows/login', {title: 'Login', error: e})
    }
});

router.get('/logout', async (req, res) => {
    if (req.session.userId) {
        req.session.destroy();
        res.render('shows/logout', {title: 'Logged out'});
    } else {

    }
});

module.exports = router;