require("dotenv").config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const hbs = require('express-handlebars')
// const flash = require('connect-flash')
const { v4: uuidv4 } = require("uuid")
const logger = require('morgan');
const usersRouter = require('./routes/users');      
const adminRouter = require('./routes/admin');
const app = express();
const db = require('./config/connection')
/* -------------------------------------------------------------------------- */
/*                              view engine setup                             */
/* -------------------------------------------------------------------------- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* -------------------------------------------------------------------------- */
/*                             IF EQUAL TO HELPER                             */
/* -------------------------------------------------------------------------- */

var Hbs = hbs.create({});
Hbs.handlebars.registerHelper('if_eq', function(a, b, opts) {
  if(a == b) // Or === depending on your needs
      return opts.fn(this);
  else
      return opts.inverse(this);
});

app.engine('hbs',hbs.engine({
  extname:'hbs',defaultLayout:false,layoutsDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/partials/',helpers: {
    inc: function (value, options) {
      return parseInt(value) + 1;
    }
  }
}))

/* -------------------------------------------------------------------------- */
/*                           Browser cache clearing                           */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {
  if (!req.admin) {
    res.header("cache-control", "private,no-cache,no-store,must revalidate");
    res.header("Express", "-3");
  }
  next();
});


/* -------------------------------------------------------------------------- */
/*                              Session Creation                              */
/* -------------------------------------------------------------------------- */

const maxAge = 24 * 60 * 60 * 1000;
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: maxAge }
  })
);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', usersRouter);
app.use('/', adminRouter);




/* -------------------------------------------------------------------------- */
/*                              Mongodb creation                              */
/* -------------------------------------------------------------------------- */

db.connect((err) => {
  if (err) {

    console.log('connection erorr' + err)
  }
  else {

    console.log("database connected")
  }
});


/* -------------------------------------------------------------------------- */
/*                   catch 404 and forward to error handler                   */
/* -------------------------------------------------------------------------- */

app.use(function (req, res, next) {
  next(createError(404));
});

/* -------------------------------------------------------------------------- */
/*                                error handler                               */
/* -------------------------------------------------------------------------- */

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* -------------------------------------------------------------------------- */
  /*                            render the error page                           */
  /* -------------------------------------------------------------------------- */

  res.status(err.status || 500);
  res.render('404page');
});







module.exports = app;
