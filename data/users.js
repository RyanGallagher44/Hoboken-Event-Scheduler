const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const events = mongoCollections.events;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const { ObjectId } = require('mongodb');
const validation = require('../validation');
const validator = require('../validator');
const eventData = require('../data/events');

async function create(firstName, lastName, email, age, password, passwordConfirm) {
    const userCollection = await users();

    firstName = validation.checkString(firstName, 'First name');
    lastName = validation.checkString(lastName, 'Last name');
    email = validator.checkEmail(email);
    // validate age?
    password = validator.checkPassword(password);
    passwordConfirm = validator.checkConfirmPassword(passwordConfirm);

    if (password !== passwordConfirm) throw "Passwords do not match!";

    const checkIfEmailExists = await userCollection.findOne({email: email});
    if (checkIfEmailExists !== null) throw "This email is already registered with us!";

    const hashedPassword = await bcrypt.hash(passwordConfirm, saltRounds);

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        age: age,
        regEvents: [],
        interests: [],
        hashedPassword: hashedPassword
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not create user";

    //there might be a better way to get the id of the user but this way should work for now
    const user = await userCollection.findOne({email: email});
    return {userCreated: true, id: user._id.toString()};
}

async function check(email, password) {
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
    const userCollection = await users();

    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (user === null) throw `There is no user with the ID of ${id}`;

    return user;
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

    return true;
}

async function remove(id) {
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

    const deleteInfo = await userCollection.deleteOne({ _id: ObjectId(id) });
    if (deleteInfo.deletedCount === 0) throw `Could not delete user with the ID of ${id}!`;

    return {userDeleted: true, id: id};
}

module.exports = {
    create,
    check,
    get,
    joinEvent,
    remove,
    unjoinEvent
}