const mongoCollections = require('../config/mongoCollections');
const events = mongoCollections.events;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const createEvent = async function createEvent(name, users_registered, creator, date, time, location, description, tags){
    //check all the inputs
    name = validation.checkString(name, 'Name');
    creator = validation.checkId(creator, 'Creator');
    date = validation.checkDate(date, time, 'Date');
    time = validation.checkTime(time, 'Time');
    location = validation.checkString(location, 'Location');
    description = validation.checkString(description, 'Description');
    tags = validation.checkStringArray(tags, 'Tags', 1);

    const eventCollection = await events();
    const userCollection = await users();

    let numAttending = 0;
    if (!users_registered) { 
      users_registered = [];
    } else {
      numAttending = users_registered.length;
    }

    let newEvent = { //changed so events start out with empty comments field
        name: name,
        comments: [],
        users_registered: users_registered,
        creator: creator,
        date: date,
        time: time,
        location: location,
        description: description,
        tags: tags,
        numAttending: numAttending
    }

    const insertInfo = await eventCollection.insertOne(newEvent);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Could not add event';
    }

    let user = await userCollection.findOne({_id: ObjectId(creator)});
    let firstName = user.firstName;
    let lastName = user.lastName;
    
    const currentDate = new Date();
    let updated = await userCollection.updateOne({_id: ObjectId(creator)}, {$push:{activity: {time: `${currentDate.getHours()}:${currentDate.getMinutes()}`, str: `${firstName} ${lastName} created a new event: ${name}!`}}});

    return true;
}

async function get(id){
  //check all the inputs
  id=id.trim();
  id = validation.checkId(id, 'Event ID');
  const eventCollection=await events();
  const event=await eventCollection.findOne({_id:ObjectId(id)});
  if(!event){
    throw 'No event with that id';
  }
  event._id=event._id.toString();
  return event;

}


async function addComment(eventId,userId,comment,datePosted){ //check these inputs
  const newComment= {
    _id:ObjectId(),
    userId:userId,
    comment:comment,
    datePosted:datePosted,
  }

  const eventCollection= await events();
  await eventCollection.updateOne({_id:ObjectId(eventId)},{$push:{comments:newComment}}); //maybe check if this errors?
  newComment._id=newComment._id.toString(); //fixed typo here
  return newComment;
}

async function addUserToEvent(eventId, userId) { //Need to update events and users collections
  eventId = validation.checkId(eventId, 'Event ID');
  userId = validation.checkId(userId, 'User ID');
  const eventCollection= await events();
  //Check if user is already registered
  let event = await eventCollection.findOne({_id:ObjectId(eventId)});
  if (!event) throw "No event with that ID";
  if (!(event.users_registered.includes(userId))) { //Only register user for event if they arent already registered
    let updated = await eventCollection.updateOne({_id: ObjectId(eventId)}, {$push:{users_registered: userId}});
    //if (!updated.insertedId) throw "Could not register user to event";
  }

  return true;
}

async function removeUserFromEvent(eventId, userId) { //Need to update events and users collections
  eventId = validation.checkId(eventId, 'Event ID');
  userId = validation.checkId(userId, 'User ID');
  const eventCollection= await events();

  let updated = await eventCollection.updateOne({_id: ObjectId(eventId)}, {$pull:{users_registered: userId}});

  return true;
}

module.exports = {
  createEvent,
  get,
  addComment,
  addUserToEvent,
  removeUserFromEvent
}