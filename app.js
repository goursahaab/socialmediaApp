// .env configure 
require("dotenv").config({ path: "./.env" });

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ImageKit = require('imagekit');




// express-fileupload require
const fileUpload=require('express-fileupload')


// connect data base 


require("./models/database").connectDB();

var indexRouter = require('./routes/index.route');
var usersRouter = require('./routes/users.route');
var postRoutes = require("./routes/post.route");

var app = express();


app.use(
  fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
  })
);

const session=require('express-session')
const passport=require('passport')
const userCollection=require('./models/user.schema')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// password authentication boilerplate --->

app.use(
  session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,

  })
)

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userCollection.serializeUser());
passport.deserializeUser(userCollection.deserializeUser());



app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use("/post", postRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
