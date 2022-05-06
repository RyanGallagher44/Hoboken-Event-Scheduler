const express = require('express');
const router = express.Router();
const data = require('../data');
const validator = require('../validator');
const userData = data.users;
const xss=require('xss');

router.get('/', async (req, res) => {
    const pastHosted = await userData.getPastHostedEvents(req.session.userId);
    const pastAttended = await userData.getPastAttendedEvents(req.session.userId);
    const recommendedEvents = await userData.getRecommendedEvents(req.session.userId);
    req.session.prevURL = '/user';
    res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, profile_name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, age: `${(await userData.get(req.session.userId)).age}`, email: `${(await userData.get(req.session.userId)).email}`, events_hosted: pastHosted, events_attended: pastAttended, recommended_events: recommendedEvents, deletionAllowed: true})
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
    try{
        let userId = validator.checkId(xss(req.session.userId));
        var evList = await userData.getRegisteredEvents(userId);
        const user = await userData.get(userId);
        req.session.prevURL = '/user/regEvents';
        var userFirst = validator.checkString(user.firstName);
        var userLast = validator.checkString(user.lastName);
    }
    catch(e){
        console.log(e);
    }
    res.render("shows/registeredEvents", {title: "My Registered Events", name: `${userFirst} ${userLast}`, events: evList, loggedIn: true});
});

router.get('/followers', async (req, res) => {
    try {
        res.render('shows/followers', {title: "Followers", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, followers: (await userData.getFollowers(req.session.userId))});
    } catch (e) {
        console.log(e);
    }
});

router.get('/following', async (req, res) => {
    try {
        console.log(await userData.getFollowing(req.session.userId));
        res.render('shows/following', {title: "Following", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, following: (await userData.getFollowing(req.session.userId))});
    } catch (e) {
        console.log(e);
    }
});

router.post('/follow', async (req, res) => {
    await userData.addToFollowing(req.body.userToFollowId, req.session.userId);
    await userData.addToFollowers(req.body.userToFollowId, req.session.userId);

    res.redirect(`/user/${req.body.userToFollowId}`);
});

router.post('/unfollow', async (req, res) => {
    await userData.removeFromFollowing(req.body.userToUnfollowId, req.session.userId);
    await userData.removeFromFollowers(req.body.userToUnfollowId, req.session.userId);

    res.redirect(`/user/${req.body.userToUnfollowId}`);
});

router.get('/:id', async (req, res) => {
    if (req.params.id == req.session.userId) {
        return res.redirect('/user');
    }
    try {
        const pastHosted = await userData.getPastHostedEvents(req.params.id);
        const pastAttended = await userData.getPastAttendedEvents(req.params.id);
        req.session.prevURL = '/user/other';
        req.session.prevVisitedProfile = req.params.id;
        if (((await userData.get(req.session.userId)).following).includes(req.params.id)) {
            res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, profile_name: `${(await userData.get(req.params.id)).firstName} ${(await userData.get(req.params.id)).lastName}`, age: `${(await userData.get(req.params.id)).age}`, email: `${(await userData.get(req.params.id)).email}`, events_hosted: pastHosted, events_attended: pastAttended, otherUser: true, user_id: req.params.id, alreadyFollowing: true});
        } else {
            res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${(await userData.get(req.session.userId)).firstName} ${(await userData.get(req.session.userId)).lastName}`, profile_name: `${(await userData.get(req.params.id)).firstName} ${(await userData.get(req.params.id)).lastName}`, age: `${(await userData.get(req.params.id)).age}`, email: `${(await userData.get(req.params.id)).email}`, events_hosted: pastHosted, events_attended: pastAttended, otherUser: true, user_id: req.params.id});
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;