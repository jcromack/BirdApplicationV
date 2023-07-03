var mongoose = require('mongoose');

//The URL which will be queried. Run "mongod.exe" for this to connect
//var url = 'mongodb://localhost:27017/test';
//var mongoDB = 'mongodb://0.0.0.0:27017/BirdApp';
//var mongoDB = 'mongodb+srv://jcromack:mrw3n3Lbcl5oo0VM@cluster0.yswcqg6.mongodb.net/?retryWrites=true&w=majority';


mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('MongoDB connected!');
});




