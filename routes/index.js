const eventRoutes = require('./events');
const loginRoutes = require('./login');
const signupRoutes = require('./signup');
const allEventsRoutes = require('./landing');
const userRoutes = require('./user');
const commentRoutes = require('./comment');
const calendarRoutes = require('./calendar');

const constructorMethod = (app) => {
  app.use('/events', eventRoutes); //moved the route in landing.js to events.js
  app.use('/', loginRoutes);
  app.use('/signup', signupRoutes);
  app.use('/user', userRoutes);
  app.use('/comment', commentRoutes);
  app.use('/calendar', calendarRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
