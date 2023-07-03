var mongoose = require('mongoose');

//The URL which will be queried. Run "mongod.exe" for this to connect
//var url = 'mongodb://localhost:27017/test';
const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb+srv://jcromack:mrw3n3Lbcl5oo0VM@cluster0.yswcqg6.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
