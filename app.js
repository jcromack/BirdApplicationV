
const express = require('express');
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');


var index = require('./routes/index');
var users = require('./routes/users');
var createPost = require('./routes/createpost');
var login = require('./routes/login');

const viewpostRouter = require('./routes/viewpost');

console.log('Registering createpost route...');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' });

app.use('/', indexRouter)

mongoose.connect('mongodb+srv://jcromack:mrw3n3Lbcl5oo0VM@cluster0.yswcqg6.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


//end

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/createpost', createPost);
app.use('/login', login);

// Import connection function
const connectToDatabase = require('./database/connect.js');

connectToDatabase();


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Listen on port 3000
app.listen(3000, () => {
  console.log('App listening on port 3000');
});

module.exports = app;
