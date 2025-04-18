const Hapi = require("@hapi/hapi");
const sequelize = require("./config/db")
const authRoutes = require('./routes/auth.routes');
const routeRoutes = require('./routes/route.route');
const busRoutes = require("./routes/bus.route")
const scheduleRoutes = require("./routes/schedule.route")

require("dotenv").config();

const init = async ()=>{
    const server = Hapi.Server({
        port:process.env.port,
        host:process.env.DB_HOST,
        routes: {
            cors: {
              origin: ['*']
            }
          }
    })

    server.route(authRoutes);
    server.route(routeRoutes)
    server.route(busRoutes)
    server.route(scheduleRoutes)

    try {
        await sequelize.authenticate();
        console.log('Database Connected');
      } catch (error) {
        console.error('Unable to connect to the database:', error.message);
      }
      
      await sequelize.sync({ alter: true });
      await server.start();
  console.log(`Server running on ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

 init();