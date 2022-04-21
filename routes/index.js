const eventRoutes = require('./events');
const eventRoutes = require('./login');

const constructorMethod = (app) => {
  app.use('/events', eventRoutes);
  app.use('/login', loginRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
