const eventRoutes = require('./events');

const constructorMethod = (app) => {
  app.use('/events', eventRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;