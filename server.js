const { app, sequelize } = require('./app');

const port = app.get('port');
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
    app.listen(port, () => {
      console.log(`Servidor corriendo en puerto: ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar modelos:', err);
  });
