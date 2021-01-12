// require('regenerator-runtime/runtime');
require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const eta = require('eta');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const cors = require('cors');
const session = require('express-session');
const compress = require('compression');
const passport = require('passport');
const { flash } = require('express-flash-message');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const assert = require('assert');

const router = require('./routes');

/** MONGODB DATABASE CONNECTION */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB_URI.trim(), { useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Jumga MongoDB connection to database successful! :)');
});
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.error(
    'MongoDB connection error. Please make sure MongoDB is running. => ',
    err
  );
  process.exit();
});

const app = express();

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

/** ETA TEMPLATE ENGINE */
app.engine('eta', eta.renderFile);
app.set('view engine', 'eta');
app.set('views', path.join(__dirname, 'views')); // crucial! lol
eta.configure({ views: path.resolve('src/views'), useWith: true });

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(compress());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');

/** OTHER THINGS */
const store = new MongoStore({
  url: process.env.MONGO_DB_URI.trim(),
  collection: 'sessions',
  mongooseConnection: mongoose.connection,
  stringify: false,
});

store.on('error', (error) => {
  console.error("can't connect to mongo: MongoStore", error);
  assert.ifError(error);
  assert.ok(false);
});

function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) return res.sendStatus(204).end();

  return next();
}

app.use(
  session({
    name: 'jumga.sid',
    secret: process.env.SESSION_SECRET,
    cookie: {
      path: '/',
      maxAge: 60000 * 60 * 24 * 14,
      httpOnly: true,
    },
    store,
    resave: false,
    saveUninitialized: false,
    touchAfter: 24 * 3600,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/** FLASH MESSAGES */
app.use(flash());

/**
 * Set up Passport Sessions :)
 */
// const publicPaths = ['/signin', '/signup', '/'];
// app.use(function (req, res, next) {
//   console.log('public paths =>', publicPaths.includes(req.path));

//   console.log('is authenticated', req.isAuthenticated());

//   if (publicPaths.includes(req.path) || !req.isAuthenticated()) {
//     next();
//   } else {
//     console.log('here in secured paths');
//     next();
//     // passport.session()(req, res, next);
//   }
// });

app.use(ignoreFavicon);

// eslint-disable-next-line func-names
app.use(async function (req, res, next) {
  if (req.session.passport) {
    res.locals.user = req.session.passport.user;
  }

  res.locals.country = req.session.country || 'NG';

  if (req.session.pageCount) {
    res.locals.pageCount = req.session.pageCount;
  }

  res.locals.route = {
    query: req.query,
    params: req.params,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
  };

  res.locals.host = req.headers.host;

  res.locals.title = 'Jumga E-Plaza';

  res.locals.route_name = '';

  res.locals.env = process.env.NODE_ENV.trim();

  res.locals.alerts = {
    info: await req.consumeFlash('info'),
    error: await req.consumeFlash('error'),
    success: await req.consumeFlash('success'),
  };

  next();
});

// For returnTo's...
app.use(function (req, res, next) {
  if (req.session.returnTo) {
    console.log('returnTo in session => ', req.session.returnTo);
    return next();
  }
  if (req.query.returnTo) {
    console.log('returnTo in url query => ', req.query.returnTo);
    req.session.returnTo = req.query.returnTo;
  }
  // else {
  //   console.log('last last return TO', req.header('Referer'));
  //   req.session.returnTo = req.header('Referer') || '/';
  // }
  return next();
});

// app.use(function (req, res, next) {
//   if (req.session.pageCount) req.session.pageCount++;
//   else req.session.pageCount = 1;
//   next();
// });

/** Setup Passport sessions */
require('./config/passport');

app.use('/', router);
// app.use('/users', usersRouter);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV.trim() === 'dev') {
  // only use in development
  app.use(errorHandler());
} else {
  // Render an actual error page here :/
  app.use((err, req, res) => {
    console.error(err);
    res
      .status(500)
      .send("Server Error :( \n\n please contact support, that's me! XD");
  });
}

app.get('*', (req, res) => {
  res.render('error');
});

server.listen(port, () => {
  console.log(`Jumga Server listening on Port: ${port}`);
});

// process
//   .on("SIGTERM", shutdown("SIGTERM"))
//   .on("SIGINT", shutdown("SIGINT"))
//   .on("uncaughtException", shutdown("uncaughtException"));

module.exports = app;
