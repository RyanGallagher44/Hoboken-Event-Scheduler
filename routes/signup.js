const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    if (req.session.userId) {
        res.redirect('/events');  
    } else {
        res.render('shows/signup', {title: 'Sign Up'});
    }
});

router.post('/', async (req, res) => {
    try {
        let createUserRes = await userData.create(req.body.signup_firstname, req.body.signup_lastname, req.body.signup_email, req.body.signup_age, req.body.signup_password, req.body.signup_passwordconfirm);
        if (createUserRes.userCreated === true) {
            res.redirect('/');
        }
    } catch (e) {
        res.render('shows/signup', {title: 'Sign Up', error: e})
    }
});

module.exports = router;