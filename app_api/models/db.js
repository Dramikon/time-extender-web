var mongoose = require('mongoose');
require('./schema');

var dbURI = 'mongodb://localhost/TimeExtender';
if(process.env.NODE_ENV === 'production'){
    dbURI = 'mongodb://valentin_kononov:dramikon108@ds149724.mlab.com:49724/heroku_sr444s7w';
}
mongoose.connect(dbURI, { useMongoClient: true })
//mongoose.openUri(dbURI)

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('TEW: Mongoose disconnected through ' + msg);
        callback();
    });
};
//for nodemon restart
process.once('SIGUSR2', function () {
   gracefulShutdown('TEW: nodemon restart', function () {
      process.kill(process.pid, 'SIGUSR2');
   });
});
//for app termination
process.on('SIGINT', function () {
   gracefulShutdown('TEW: app termination', function () {
        process.exit(0);
   });
});
//for heroku app termination
process.on('SIGTERM', function () {
    gracefulShutdown('TEW: Heroku app termination', function () {
        process.exit(0);
    });
});