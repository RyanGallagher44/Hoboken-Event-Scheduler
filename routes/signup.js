const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const xss = require('xss');
const validation = require('../validation');

router.get('/', async (req, res) => {
    if (req.session.userId) {
        res.redirect('/events');  
    } else {
        res.render('shows/signup', {title: 'Sign Up'});
    }
});

router.post('/', async (req, res) => {
    let firstName = xss(req.body.signup_firstname);
    let lastName = xss(req.body.signup_lastname);
    let email = xss(req.body.signup_email);
    let dob = xss(req.body.signup_dob);
    let password = xss(req.body.signup_password);
    let passwordConfirm = xss(req.body.signup_passwordconfirm);

    try {
        firstName = validation.checkString(firstName, 'First name');
        lastName = validation.checkString(lastName, 'Last name');
        email = validation.checkEmail(email);
        dob = validation.checkDateOfBirth(dob, 'Date of birth')
        password = validation.checkPassword(password);
        passwordConfirm = validation.checkConfirmPassword(passwordConfirm);
        if (password !== passwordConfirm) throw 'Passwords do not match!';

        let createUserRes = await userData.create(firstName, lastName, email, dob, password, passwordConfirm);
        if (createUserRes.userCreated === true) {
            res.redirect('/');
        }
    } catch (e) {
        res.render('shows/signup', {title: 'Sign Up', error: e})
    }
});

module.exports = router;