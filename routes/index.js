const eventRoutes = require('./events');
const loginRoutes = require('./login');
const signupRoutes = require('./signup');
const allEventsRoutes = require('./landing');
const userRoutes = require('./user');

const constructorMethod = (app) => {
  app.use('/events', allEventsRoutes);
  app.use('/', loginRoutes);
  app.use('/signup', signupRoutes);
  app.use('/user', userRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
