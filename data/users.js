const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

async function create(firstName, lastName, email, age, gender, regEvents, interests, hashedPassword) {
    const userCollection = await users();

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        age: age,
        gender: gender,
        regEvents: [],
        interests: [],
        hashedPassword: hashedPassword
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not create user";

    const newId = insertInfo.insertedId.toString();
    const user = await this.get(newId);
    user._id = user._id.toString();

    return {ok: "user created"};
}

async function get(id) {
    const userCollection = await users();

    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (user === null) throw `There is no user with the ID of ${id}`;

    return {ok: "user found"};
}

module.exports = {
    create,
    get
}