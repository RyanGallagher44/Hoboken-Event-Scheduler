const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');
const xss = require('xss');

router.get('/', async (req, res) => {
    if (xss(req.session.userId)) {
        res.redirect('/events');
    } else {
        res.render('shows/login', {title: 'Login'});
    }
});

router.post('/login', async (req, res) => {
    let email = xss(req.body.login_email);
    let password = xss(req.body.login_password);

    try {
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);

        let checkUserRes = await userData.check(email, password);
        if (checkUserRes.userAuthenticated != null) {
            req.session.userId = checkUserRes.userAuthenticated;
            res.redirect('/events');
        }
    } catch (e) {
        res.render('shows/login', {title: 'Login', error: e})
    }
});

router.get('/logout', async (req, res) => {
    if (xss(req.session.userId)) {
        req.session.destroy();
        res.render('shows/logout', {title: 'Logged out'});
    } else {

    }
});

module.exports = router;