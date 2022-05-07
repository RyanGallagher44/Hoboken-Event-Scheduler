const dbConnection = require('./config/mongoConnection');
const eventFuncs = require('./data/events');
const userFuncs = require('./data/users');

const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();
  let test = await userFuncs.create("Test", "Account", "test@hbe.com", "1871-09-20", "test", "test");
  let calvin = await userFuncs.create("Calvin", "Lyttle", "clyttle@stevens.edu", "2000-01-01", "password123", "password123");
  let phill = await userFuncs.create("Patrick", "Hill", "phill@stevens.edu", "1990-01-01","debugurc0d3", "debugurc0d3");
  let favardin = await userFuncs.create("Nariman", "Favardin", "president@stevens.edu", "1956-07-15", "Tuition*200", "Tuition*200");
  let ryan = await userFuncs.create("Ryan", "Gallagher", "rgallag1@stevens.edu", "2000-11-27", "123", "123");
  let aaron = await userFuncs.create("Aaron", "Alfaro", "aalfaro2@stevens.edu", "2001-01-01", "123", "123");
  let eddie = await userFuncs.create("Eddie", "Ahn", "eahn@stevens.edu", "2000-02-29", "123", "123");
  let ethan = await userFuncs.create("Ethan", "Che", "eche@stevens.edu", "1999-12-16", "123", "123");

  let hidenseek = await eventFuncs.createEvent("Hide and Seek", [calvin.id, phill.id, ryan.id], favardin.id, "2022-05-28", "12:00", "Palmer Lawn", "Hide and seek on Palmer Lawn", ["Outdoors", "Sports"]);
  let freedogs = await eventFuncs.createEvent("Free Dog Giveaway", [calvin.id], calvin.id, "2022-06-01", "03:30", "Church Square Park", "Come and get a free dog, no questions asked", ["Free Stuff", "Outdoors"]);
  let painting = await eventFuncs.createEvent("Bob Ross Painting", [phill.id, ethan.id, aaron.id, ryan.id], phill.id, "2022-06-07", "10:15", "Bissinger", "Follow along with an episode of Bob Ross", ["Arts and Crafts", "Indoors"]);
  let racing = await eventFuncs.createEvent("Shopping Cart Races", [phill.id, favardin.id, calvin.id, ryan.id, aaron.id, eddie.id, ethan.id], ryan.id, "2022-05-25", "05:00", "ShopRite of Hoboken", "Bring your own shopping cart...", ["Sports", "Indoors", "Shopping"]);
  let rollerhockey = await eventFuncs.createEvent("Roller Hockey Tournament", [], test.id, "2022-05-23", "01:00", "124 Grand Street", "Come alone or with a team!", ["Sports", "Outdoors"]);
  let barhopping = await eventFuncs.createEvent("Hoboken Bar Hopping", [], ethan.id, "2022-05-26", "01:00", "521 Washington Street", "Bring your friends!", ["Bars"]);
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};
  
main().catch(console.log);