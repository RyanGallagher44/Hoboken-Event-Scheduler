const mongoCollections = require('../config/mongoCollections');
const events = mongoCollections.events;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

const createEvent = async function createEvent(name, users_registered, creator, date, time, location, description, tags){
    //check all the inputs
    name = validation.checkString(name, 'Name');
    //change this to id
    creator = validation.checkString(creator, 'Creator');
    date = validation.checkDate(date, 'Date');
    time = validation.checkTime(time, 'Time');
    location = validation.checkString(location, 'Location');
    description = validation.checkString(description, 'Description');
    tags = validation.checkStringArray(tags, 'Tags', 1);
    //check creator ID here for valid user

    const eventCollection = await events();

    let newEvent = { //changed so events start out with empty comments field
        name: name,
        comments: [],
        users_registered: [],
        creator: creator,
        date: date,
        time: time,
        location: location,
        description: description,
        tags: tags
    }

    const insertInfo = await eventCollection.insertOne(newEvent);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Could not add event';
    }

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


module.exports = {
  createEvent,
  get,
  addComment,
  addUserToEvent
}