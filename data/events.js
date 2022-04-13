const mongoCollections = require('../config/mongoCollections');
const bands = mongoCollections.events;
const { ObjectId } = require('mongodb');

async function create(name, users_registered, creator, date, time, location, description, tags){
    //check all the inputs
    let newEvent = {
        name: name,
        users_registered: users_registered,
        creator: creator,
        date: date,
        time: time,
        location: location,
        description: description,
        tags: tags
    }
    const insertInfo = await bandCollection.insertOne(newEvent);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Could not add event';
    }
}