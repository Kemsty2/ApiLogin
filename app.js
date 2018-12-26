import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import passport from "passport";
import session from "express-session";
import "dotenv/config";
import models from "./models";
import exphbs from "express-handlebars"
import flash from "connect-flash";

const app = express();

require('./config/passport');

models.sequelize.sync().then( () => {
  console.log("Nice! Database Looks Fine")
}).catch( err => {
  console.log(err, "Something Went Wrong With The Database Update");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
	extname: '.hbs',
	defaultLayout: 'layout'
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sess = {
	secret: process.env.SESSION_SECRET,
	cookie: {
	  maxAge: 180 * 60 * 1000
  },
	saveUninitialized: false,
	resave:false
};

if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', 1); // trust first proxy
	sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(passport.initialize(null));
app.use(passport.session(null));
app.use(flash());

app.use('/', indexRouter);

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
  const errCode = err.status || 500;
  res.status(errCode);
  res.json(errCode);
  console.log(err.message);
});

module.exports = app;
