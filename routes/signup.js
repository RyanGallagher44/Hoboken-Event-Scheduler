const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    res.render('shows/signup', {title: 'Sign Up'});
});

module.exports = router;