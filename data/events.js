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

    let newEvent = {
        name: name,
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
  const eventCollection=await events();
  const event=await eventCollection.findOne({_id:ObjectId(id)});
  if(!event){
    throw 'No event with that id';
  }
  event._id=event._id.toString();
  return event;

}


async function addComment(eventId,userId,comment,datePosted){
  const newComment= {
    _id:ObjectId(),
    userId:userId,
    comment:comment,
    datePosted:datePosted,
  }

  const eventCollection= await events();
  await eventCollection.updateOne({_id:ObjectId(eventId)},{$push:{comments:newComment}});
  newComment._id=newAlbumInfo._id.toString();
  return newComment;
}


module.exports = {
  createEvent
}