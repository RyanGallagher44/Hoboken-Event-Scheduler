const dbConnection = require('./config/mongoConnection');
const eventFuncs = require('./data/events');
const userFuncs = require('./data/users');

const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();
  let calvin = await userFuncs.create("Calvin", "Lyttle", "clyttle@stevens.edu", 20, "password123", "password123");
  let phill = await userFuncs.create("Patrick", "Hill", "phill@stevens.edu", 95,"debugurc0d3", "debugurc0d3");
  let favardin = await userFuncs.create("Nariman", "Favardin", "president@stevens.edu", 58, "Tuition*200", "Tuition*200");
  let ryan = await userFuncs.create("Ryan", "Gallagher", "rgallag1@stevens.edu", 21, "123", "123");
  let aaron = await userFuncs.create("Aaron", "Alfaro", "aalfaro2@stevens.edu", 21, "123", "123");
  let eddie = await userFuncs.create("Eddie", "Ahn", "eahn@stevens.edu", 21, "123", "123");
  let ethan = await userFuncs.create("Ethan", "Che", "eche@stevens.edu", 21, "123", "123");

  let hidenseek = await eventFuncs.createEvent("Hide and Seek", [calvin.id, phill.id, ryan.id], favardin.id, "04/30/2022", "12:00", "Palmer Lawn", "Hide and seek on Palmer Lawn", ["Outdoors", "Sports"]);
  let freedogs = await eventFuncs.createEvent("Free Dog Giveaway", [calvin.id], calvin.id, "05/03/2022", "03:30", "Church Square Park", "Come and get a free dog, no questions asked", ["Free Stuff", "Outdoors"]);
  let painting = await eventFuncs.createEvent("Bob Ross Painting", [phill.id, ethan.id, aaron.id, ryan.id], favardin.id, "06/03/2022", "10:15", "Bissinger", "Follow along with an episode of Bob Ross", ["Arts and Crafts", "Indoors"]);
  let racing = await eventFuncs.createEvent("Shopping Cart Races", [phill.id, favardin.id, calvin.id, ryan.id, aaron.id, eddie.id, ethan.id], ryan.id, "04/26/2022", "05:00", "ShopRite of Hoboken", "Bring your own shopping cart...", ["Sports", "Indoors", "Shopping"]);
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};
  
main().catch(console.log);