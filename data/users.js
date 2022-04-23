const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

async function create(firstName, lastName, email, age, password, passwordConfirm) {
    const userCollection = await users();

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

    //Check if user is already registered
    let user = await userCollection.findOne({_id:ObjectId(userId)});
    if (!user) throw "No user with that ID";
    if (!(user.regEvents.includes(eventId))) { //Only register user for event if they arent already registered
        let updated = await userCollection.updateOne({_id: ObjectId(userId)}, {$push:{regEvents: eventId}});
        //if (!updated.insertedId) throw "Could not register user to event";
    }
    
    return true;
}

module.exports = {
    create,
    check,
    get,
    joinEvent
}