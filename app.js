const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load Models
require('./app/models/User');
require('./app/models/Story');

// Passport Config
require('./config/passport').google(passport);
require('./config/passport').facebook(passport);
require('./config/passport').linkedin(passport);


// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./app/helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser:true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// MEthod Override Middelware
app.use(methodOverride('_method'));

// Handlebars Middleware
app.set('views', path.join(__dirname, './app/views'));
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate:formatDate,
    select:select,
    editIcon: editIcon
  },
  defaultLayout:'main',
  layoutsDir:'./app/views/layouts',
  partialsDir:'./app/views/partials'

}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Set global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.user = req.user || null;
  next();
});

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'app/assets')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
