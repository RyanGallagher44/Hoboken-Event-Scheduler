const mongoCollections = require('../config/mongoCollections');
const events = mongoCollections.events;
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


