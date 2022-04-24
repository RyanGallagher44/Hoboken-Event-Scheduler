const userData = require('./users');
const allEventData=require('./all_events');

module.exports = {
    allEvents:allEventData,
    events: require("./events"),
    users: userData
};