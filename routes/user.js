const express = require('express');
const router = express.Router();
const data = require('../data');
const validation = require('../validation');
const userData = data.users;
const xss=require('xss');

router.get('/', async (req, res) => {
    let userId = validation.checkId(xss(req.session.userId), "id");
    const pastHosted = await userData.getPastHostedEvents(userId);
    const pastAttended = await userData.getPastAttendedEvents(userId);
    const recommendedEvents = await userData.getRecommendedEvents(userId);
    req.session.prevURL = '/user';
    const user = await userData.get(userId);
    res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${user.firstName} ${user.lastName}`, profile_name: `${user.firstName} ${user.lastName}`, age: `${user.age}`, email: `${user.email}`, events_hosted: pastHosted, events_attended: pastAttended, recommended_events: recommendedEvents, deletionAllowed: true})
});

router.get('/delete', async (req, res) => {
    try {
        let userId = validation.checkId(xss(req.session.userId), "id");
        await userData.remove(userId);
        res.redirect('/logout');
    } catch (e) {
        console.log(e);
    }
});

router.get('/regEvents', async (req, res) => {
    try{
        let userId = validation.checkId(xss(req.session.userId), "id");
        var evList = await userData.getRegisteredEvents(userId);
        const user = await userData.get(userId);
        req.session.prevURL = '/user/regEvents';
        var userFirst = validation.checkString(user.firstName, "First name");
        var userLast = validation.checkString(user.lastName, "Last name");
    }
    catch(e){
        console.log(e);
    }
    res.render("shows/registeredEvents", {title: "My Registered Events", name: `${userFirst} ${userLast}`, events: evList, loggedIn: true});
});

router.get('/followers', async (req, res) => {
    try {
        let userId = validation.checkId(xss(req.session.userId), "id");
        const user = await userData.get(userId);
        res.render('shows/followers', {title: "Followers", loggedIn: true, name: `${user.firstName} ${user.lastName}`, followers: (await userData.getFollowers(userId))});
    } catch (e) {
        console.log(e);
    }
});

router.get('/following', async (req, res) => {
    try {
        let userId = validation.checkId(xss(req.session.userId), "id");
        console.log(await userData.getFollowing(userId));
        const user = await userData.get(userId);
        res.render('shows/following', {title: "Following", loggedIn: true, name: `${user.firstName} ${user.lastName}`, following: (await userData.getFollowing(userId))});
    } catch (e) {
        console.log(e);
    }
});

router.post('/follow', async (req, res) => {
    let userId = validation.checkId(xss(req.session.userId), "id");
    let userToFollowId = validation.checkId(xss(req.body.userToFollowId), "userToFollowId")
    await userData.addToFollowing(userToFollowId, userId);
    await userData.addToFollowers(userToFollowId, userId);

    res.redirect(`/user/${userToFollowId}`);
});

router.post('/unfollow', async (req, res) => {
    let userId = validation.checkId(xss(req.session.userId), "id");
    let userToUnfollowId = validation.checkId(xss(req.body.userToUnfollowId), "userToUnfollowId")
    await userData.removeFromFollowing(userToUnfollowId, userId);
    await userData.removeFromFollowers(userToUnfollowId, userId);

    res.redirect(`/user/${userToUnfollowId}`);
});

router.get('/:id', async (req, res) => {
    let id = validation.checkId(xss(req.params.id), "id");
    let userId = validation.checkId(xss(req.session.userId), "userId");
    if (userId==id) {
        return res.redirect('/user');
    }
    try {
        const pastHosted = await userData.getPastHostedEvents(id);
        const pastAttended = await userData.getPastAttendedEvents(id);
        req.session.prevURL = '/user/other';
        req.session.prevVisitedProfile = id;
        const user = await userData.get(userId);
        if ((user.following).includes(id)) {
            res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${user.firstName} ${user.lastName}`, profile_name: `${(await userData.get(id)).firstName} ${(await userData.get(id)).lastName}`, age: `${(await userData.get(id)).age}`, email: `${(await userData.get(id)).email}`, events_hosted: pastHosted, events_attended: pastAttended, otherUser: true, user_id: id, alreadyFollowing: true});
        } else {
            res.render('shows/user_profile', {title: "Your Profile", loggedIn: true, name: `${user.firstName} ${user.lastName}`, profile_name: `${(await userData.get(id)).firstName} ${(await userData.get(id)).lastName}`, age: `${(await userData.get(id)).age}`, email: `${(await userData.get(id)).email}`, events_hosted: pastHosted, events_attended: pastAttended, otherUser: true, user_id: id});
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;