/* All events page: Ethan
    -Get all events
    -Get events based on tags
    -Search for events based on search term */

const mongoCollections = require('../config/mongoCollections');
const events = mongoCollections.events;
const validation = require('../validation');

async function get_all_events() { //Get and return a list of all the events
    const eventCollection = await events();
    const eventList = await eventCollection.find({}, {projection: {_id: 1, comments: 0, users_registered: 0}}).toArray();
    if (!eventList) throw "Error: Could not get all events";

    for (let x of eventList) {
        x._id = x._id.toString();
    }

    return eventList;
}

async function get_all_upcoming_events() {
    const eventCollection = await events();
    const eventList = await eventCollection.find({}).toArray();
    if (!eventList) throw "Error: Could not get all events";

    const currentDate = new Date();
    let upcomingEventList = [];
    for (let x of eventList) {
        let eventDate = new Date(x.date + ' ' + x.time);
        if (eventDate.getTime() >= currentDate.getTime()) {
            upcomingEventList.push(x);
        }
    }

    return upcomingEventList;
}

async function get_all_tags() {
    const eventCollection = await events();

    const eventList = await eventCollection.find({}).toArray();
    if (!eventList) throw "Error: Could not get all tags";

    const currentDate = new Date();
    let tags = [];
    eventList.forEach((event) => {
        let eventDate = new Date(event.date);
        if (eventDate >= currentDate) {
            (event.tags).forEach((tag) => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        }
    });

    return tags;
}

async function get_events_by_tag(tag) { //Get and return a list of events that contain the specific tag
    //validate input
    tag = tag.trim();
    tag = validation.checkString(tag, 'Tag');
    allTags=await get_all_tags();
    if(!allTags.includes(tag)){
        throw 'Value is not equal to one of the options that the user can select';
    }
    const eventCollection = await events();
    const eventList = await eventCollection.find({tags: tag}, {projection: {_id: 1, comments: 0, users_registered: 0}}).toArray(); //find events that contain the tag
    if (!eventList) throw "Error: Could not get events";

    const currentDate = new Date();
    let upcomingEventList = [];
    for (let x of eventList) {
        let eventDate = new Date(x.date);
        if (eventDate >= currentDate) {
            upcomingEventList.push(x);
        }
    }

    for (let x of upcomingEventList) {
        x._id = x._id.toString();
    }

    return upcomingEventList;
}

async function search_for_event(search_term) {
    //validate input
    search_term = search_term.trim();
    search_term=validation.checkString(search_term,'Search Term');
    const eventCollection = await events();
    const eventList = await eventCollection.find({name: { $regex : new RegExp(search_term, "i") }}, {projection: {_id: 1, comments: 0, users_registered: 0}}).toArray(); //find events that contain the tag
    if (!eventList) throw "Error: Could not get events";

    const currentDate = new Date();
    let upcomingEventList = [];
    for (let x of eventList) {
        let eventDate = new Date(x.date);
        if (eventDate >= currentDate) {
            upcomingEventList.push(x);
        }
    }

    for (let x of upcomingEventList) {
        x._id = x._id.toString();
    }

    return upcomingEventList;
}

module.exports = {
    get_all_events,
    get_events_by_tag,
    search_for_event,
    get_all_tags,
    get_all_upcoming_events
};