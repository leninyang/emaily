const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User'); // User Model
require('./models/Survey'); // Survey Model
require('./services/passport');
// Routes
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // Duration
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

// authRoutes(app);
require('./routes/authRoutes')(app);
// billingRoutes(app);
require('./routes/billingRoutes')(app);
// surveyRoutes(app);
require('./routes/surveyRoutes')(app);

// Only run in Production
if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets - main.js/main.css
  app.use(express.static('client/build'));
  // Express will serve up the index.html file if it doesnt recognize route.
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
