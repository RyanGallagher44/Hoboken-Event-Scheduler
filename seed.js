const dbConnection = require('./config/mongoConnection');
const eventFuncs = require('./data/events');
const userFuncs = require('./data/users');
const bcrpyt = require('bcrypt');

const main = async () => {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    let calvin = await userFuncs.create("Calvin", "Lyttle", "clyttle@stevens.edu", 20, "password123", "password123");
    let phill = await userFuncs.create("Patrick", "Hill", "phill@stevens.edu", 95,"debugurc0d3", "debugurc0d3");
    let favardin = await userFuncs.create("Nariman", "Favardin", "president@stevens.edu", 58, "Tuition*200", "Tuition*200");

    let hidenseek = await eventFuncs.createEvent("Hide and seek", [calvin.id, phill.id], favardin.id, "04/30/2022", "12:00", "Palmer Lawn", "Hide and seek on Palmer Lawn", ["Outdoors", "Sports"]);
    let freedogs = await eventFuncs.createEvent("Free Dog Giveaway", [calvin.id], calvin.id, "05/03/2022", "03:30", "Church Square Park", "Come and get a free dog, no questions asked", ["Free Stuff", "Outdoors"]);
    let painting = await eventFuncs.createEvent("Bob Ross Painting", [phill.id], favardin.id, "06/03/2022", "10:15", "Bissinger", "Follow along with an episode of Bob Ross", ["Arts and Crafts", "Indoors"]);
    console.log('Done seeding database');
    await dbConnection.closeConnection();
  };
  
  main().catch(console.log);