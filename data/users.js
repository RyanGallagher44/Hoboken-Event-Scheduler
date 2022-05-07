const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const events = mongoCollections.events;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const { ObjectId } = require('mongodb');
const validation = require('../validation');
const eventData = require('../data/events');
const ageCalculator = require('calculate-age').default;

async function create(firstName, lastName, email, dob, password, passwordConfirm) {
    const userCollection = await users();

    firstName = validation.checkString(firstName, 'First name');
    lastName = validation.checkString(lastName, 'Last name');
    email = validation.checkEmail(email);
    dob = validation.checkDateOfBirth(dob, 'date of birth');
    password = validation.checkPassword(password);
    passwordConfirm = validation.checkConfirmPassword(passwordConfirm);

    const date = new Date();
    const age = new ageCalculator(dob, `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`).getObject();

    if (password !== passwordConfirm) throw "Passwords do not match!";

    const checkIfEmailExists = await userCollection.findOne({email: email});
    if (checkIfEmailExists !== null) throw "This email is already registered with us!";

    const hashedPassword = await bcrypt.hash(passwordConfirm, saltRounds);

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        age: age.years,
        regEvents: [],
        following: [],
        followers: [],
        activity: [],
        hashedPassword: hashedPassword
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not create user";

    //there might be a better way to get the id of the user but this way should work for now
    const user = await userCollection.findOne({email: email});
    return {userCreated: true, id: user._id.toString()};
}

async function check(email, password) {
    email = validation.checkEmail(email);
    password = validation.checkPassword(password);

    const userCollection = await users();

    const user = await userCollection.findOne({email: email});
    if (user === null) throw "Either the email or password is invalid";

    const hashedPassword = await userCollection.findOne({email: email}, {projection: {_id: 0, hashedPassword: 1}});

    const hashedPassword2 = hashedPassword.hashedPassword;

    let compareToMatch = false;

    try {
        compareToMatch = await bcrypt.compare(password, hashedPassword2);
    } catch (e) {
        console.log(e);
    }

    if (!compareToMatch) throw "Either the email or password is invalid";

    return {userAuthenticated: user._id.toString()};
}

async function get(id) { //validate
    id = validation.checkId(id, "User ID");

    const userCollection = await users();

    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw `There is no user with the ID of ${id}`;

    return user;
}

async function addToFollowing(userToFollowId, userId) {
    const userCollection = await users();

    let user = await userCollection.findOne({_id: ObjectId(userId)});
    if (!user) throw "No user with that ID";
    if (!(user.following.includes(userToFollowId))) {
        let updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$push:{following: userToFollowId}});
    }

    const currentDate = new Date();
    updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$push:{activity: {link: `/user/${userToFollowId}`, time: `${currentDate}`, str: `${(await this.get(userId)).firstName} ${(await this.get(userId)).lastName} followed ${(await this.get(userToFollowId)).firstName} ${(await this.get(userToFollowId)).lastName}`}}});

    return {followed: true};
}

async function addToFollowers(userToFollowId, userId) {
    const userCollection = await users();

    let user = await userCollection.findOne({_id: ObjectId(userToFollowId)});
    if (!user) throw "No user with that ID";
    if (!(user.followers.includes(userId))) {
        let updated = await userCollection.updateOne({_id: ObjectId(userToFollowId)}, {$push:{followers: userId}});
    }

    return {followed: true};
}

async function removeFromFollowing(userToUnfollowId, userId) {
    const userCollection = await users();

    let user = await userCollection.findOne({_id: ObjectId(userId)});
    if (!user) throw "No user with that ID";
    if (user.following.includes(userToUnfollowId)) {
        let updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$pull:{following: userToUnfollowId}});
    }

    const currentDate = new Date();
    updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$push:{activity: {link: `/user/${userToUnfollowId}`, time: `${currentDate}`, str: `${(await this.get(userId)).firstName} ${(await this.get(userId)).lastName} unfollowed ${(await this.get(userToUnfollowId)).firstName} ${(await this.get(userToUnfollowId)).lastName}`}}});

    return {unfollowed: true};
}

async function removeFromFollowers(userToUnfollowId, userId) {
    const userCollection = await users();

    let user = await userCollection.findOne({_id: ObjectId(userToUnfollowId)});
    if (!user) throw "No user with that ID";
    if (user.followers.includes(userId)) {
        let updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$pull:{followers: userId}});
    }

    return {unfollowed: true};
}

async function getFollowing(id) {
    let user = await this.get(id);

    let followingList = [];
    for (let i = 0; i < (user.following).length; i++) {
        followingList.push((await this.get(user.following[i])));
    }

    return followingList;
}

async function getFollowers(id) {
    let user = await this.get(id);

    let followersList = [];
    for (let i = 0; i < (user.followers).length; i++) {
        followersList.push((await this.get(user.followers[i])));
    }

    return followersList;
}

async function joinEvent(eventId, userId) {
    eventId = validation.checkId(eventId, 'Event ID');
    userId = validation.checkId(userId, 'User ID');
    const userCollection= await users();
    const eventCollection = await events();

    //Check if user is already registered
    let user = await userCollection.findOne({_id:ObjectId(userId)});
    if (!user) throw "No user with that ID";
    if (!(user.regEvents.includes(eventId))) { //Only register user for event if they arent already registered
        let updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$push:{regEvents: eventId}});
        //if (!updated.insertedId) throw "Could not register user to event";
    }

    await eventCollection.updateOne({_id: ObjectId(eventId)},{$inc:{numAttending: 1}});
    
    const currentDate = new Date();
    updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$push:{activity: {link: `/events/${eventId}`, time: `${currentDate}`, str: `${(await this.get(userId)).firstName} ${(await this.get(userId)).lastName} registered for ${(await eventData.get(eventId)).name} hosted by ${(await this.get((await eventData.get(eventId)).creator)).firstName} ${(await this.get((await eventData.get(eventId)).creator)).lastName}`}}});

    return true;
}

async function unjoinEvent(eventId, userId) {
    eventId = validation.checkId(eventId, 'Event ID');
    userId = validation.checkId(userId, 'User ID');
    const userCollection= await users();
    const eventCollection = await events();

    //Check if user is already registered
    let updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$pull:{regEvents: eventId}});
    
    await eventCollection.updateOne({_id: ObjectId(eventId)},{$inc:{numAttending: -1}});

    const currentDate = new Date();
    updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$push:{activity: {link: `/events/${eventId}`, time: `${currentDate}`, str: `${(await this.get(userId)).firstName} ${(await this.get(userId)).lastName} unregistered for ${(await eventData.get(eventId)).name} hosted by ${(await this.get((await eventData.get(eventId)).creator)).firstName} ${(await this.get((await eventData.get(eventId)).creator)).lastName}`}}});

    return true;
}

async function remove(id) {
    id = validation.checkId(id, "User ID");

    const userCollection = await users();
    const eventCollection = await events();

    let eventsCreatedByUser = [];
    const eventList = await eventCollection.find({}).toArray();
    if (!eventList) throw "Error: Could not get all events";

    eventList.forEach((event) => {
        if (event.creator == id) {
            eventsCreatedByUser.push(event._id.toString());
        }
    });

    for (let i = 0; i < eventList.length; i++) {
        for (let j = 0; j < eventList[i].comments.length; j++) {
            if (eventList[i].comments[j].userId == id) {
                await eventCollection.updateOne({_id: ObjectId(eventList[i]._id.toString())}, {$pull:{comments: eventList[i].comments[j]}});
            }
        }
    }

    for (let i = 0; i < eventsCreatedByUser.length; i++) {
        let deleteEventInfo = await eventCollection.deleteOne({ _id: ObjectId(eventsCreatedByUser[i])});
        if (deleteEventInfo.deletedCount === 0) throw `Could not delete event with the ID of ${eventsCreatedByUser[i]}`;
    }

    const user = await this.get(id);

    for (let i = 0; i < user.regEvents.length; i++) {
        eventData.removeUserFromEvent(user.regEvents[i], user._id.toString());
        await eventCollection.updateOne({_id: ObjectId(user.regEvents[i])},{$inc:{numAttending: -1}});
    }

    for (let i = 0; i < user.followers.length; i++) {
        await userCollection.updateOne({_id: ObjectId(user.followers[i])},{$pull:{following: id}});
    }

    let userList = await userCollection.find({}).toArray();
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].followers.includes(id)) {
            await userCollection.updateOne({_id: ObjectId(userList[i]._id)},{$pull:{followers: id}});
        }
    }

    const deleteInfo = await userCollection.deleteOne({ _id: ObjectId(id) });
    if (deleteInfo.deletedCount === 0) throw `Could not delete user with the ID of ${id}!`;

    return {userDeleted: true, id: id};
}

async function getRegisteredEvents(userId){
    //gets the list of eventids from user and returns a list of full event objects
    validation.checkId(userId, "User ID");
    let user = await get(userId);
    let evList = [];
    const eventCollection=await events();

    const eventList = await eventCollection.find({}).toArray();
    if (!eventList) throw "Error: Could not get all events";

    const currentDate = new Date();
    for (let i = 0; i < eventList.length; i++){
        let eventDate = new Date(eventList[i].date);
        if (eventDate >= currentDate) {
            if (eventList[i].users_registered.includes(userId)) {
                evList.push(eventList[i]);
            }
        }
    }
    return evList;
}

async function getPastHostedEvents(userId) {
    userId = validation.checkId(userId, "getpastHost: User ID");
    let evList = [];
    const eventCollection=await events();

    const eventList = await eventCollection.find({}).toArray();
    if (!eventList) throw "Error: Could not get all events";

    const currentDate = new Date();
    for (let i = 0; i < eventList.length; i++){
        let eventDate = new Date(eventList[i].date + ' ' + eventList[i].time);
        if (eventDate.getTime() < currentDate.getTime()) {
            if (eventList[i].creator == userId) {
                evList.push(eventList[i]);
            }
        }
    }
    return evList;
}

async function getPastAttendedEvents(userId) {
    userId = validation.checkId(userId, "getpastAttend: User ID");
    let evList = [];
    const eventCollection=await events();

    const eventList = await eventCollection.find({}).toArray();
    if (!eventList) throw "Error: Could not get all events";

    const currentDate = new Date();
    for (let i = 0; i < eventList.length; i++){
        let eventDate = new Date(eventList[i].date + ' ' + eventList[i].time);
        if (eventDate.getTime() < currentDate.getTime()) {
            if (eventList[i].users_registered.includes(userId)) {
                evList.push(eventList[i]);
            }
        }
    }
    
    return evList;
}

async function getRecommendedEvents(userId) { //Returns list of event objects that are recommended for the user (based on tags of events attended in the past)
    userId = validation.checkId(userId, "User ID");
    let user = await get(userId);
    let pastAttendedEvents = await getPastAttendedEvents(userId); //List of events attened in the past
    let pastTags = []; //Array that will hold the tags of events attended in the past
    let evList = []; //Array that holds the recommended events
    for (let x of pastAttendedEvents) {
        pastTags.push.apply(pastTags, x.tags)
    }
    const eventCollection = await events();

    const eventList = await eventCollection.find({}).toArray(); //Array of all events
    if (!eventList) throw "Error: Could not get all events";

    const currentDate = new Date();
    for (let i = 0; i < eventList.length; i++){
        let eventDate = new Date(eventList[i].date);
        if (eventDate > currentDate) { //If the event is in the future
            let eventTags = eventList[i].tags;
            for (let x of eventTags) {
                if (pastTags.includes(x)) {
                    evList.push(eventList[i]);
                    break;
                }
            }
        }
    }
    return evList;
}

async function getActivityFeed(userId) {
    userId = validation.checkId(userId, "User ID");
    let user = await this.get(userId);
    
    let activityFeed = [];
    for (let i = 0; i < user.following.length; i++) {
        let f = await this.get(user.following[i]);
        for (let j = 0; j < f.activity.length; j++) {
            activityFeed.push(f.activity[j]);
        }
    }

    activityFeed.sort((x, y) => (x.time > y.time) ? 1 : -1);

    return activityFeed;
}

module.exports = {
    create,
    check,
    get,
    joinEvent,
    remove,
    unjoinEvent,
    getRegisteredEvents,
    getPastHostedEvents,
    getPastAttendedEvents,
    getRecommendedEvents,
    addToFollowing,
    addToFollowers,
    getFollowers,
    getFollowing,
    removeFromFollowing,
    removeFromFollowers,
    getActivityFeed
}