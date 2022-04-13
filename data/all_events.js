/* All events page: Ethan
    -Get all events
    -Get events based on tags
    -Search for events based on search term */

const mongoCollections = require('../config/mongoCollections');
const events = mongoCollections.events;

async function get_all_events() { //Get and return a list of all the events
    const eventCollection = await events();
    const eventList = await eventCollection.find({}, {projection: {_id: 1, comments: 0, users_registered: 0}}).toArray();
    if (!eventList) throw "Error: Could not get all events";

    for (let x of eventList) {
        x._id = x._id.toString();
    }

    return eventList;
}

async function get_events_by_tag(tag) { //Get and return a list of events that contain the specific tag
    //validate input
    tag = tag.trim();
    const eventCollection = await events();
    const eventList = await eventCollection.find({tags: tag}, {projection: {_id: 1, comments: 0, users_registered: 0}}).toArray(); //find events that contain the tag
    if (!eventList) throw "Error: Could not get events";

    for (let x of eventList) {
        x._id = x._id.toString();
    }

    return eventList;
}

async function search_for_event(search_term) {
    //validate input
    search_term = search_term.trim();
    const eventCollection = await events();
    const eventList = await eventCollection.find({name: { $regex : new RegExp(search_term, "i") }}, {projection: {_id: 1, comments: 0, users_registered: 0}}).toArray(); //find events that contain the tag
    if (!eventList) throw "Error: Could not get events";

    for (let x of eventList) {
        x._id = x._id.toString();
    }

    return eventList;
}

module.exports = {
    get_all_events,
    get_events_by_tag,
    search_for_event
};