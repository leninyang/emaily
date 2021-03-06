const _ = require('lodash');
const Path = require('path-parser'); // Helps us parse through urls
const { URL } = require('url'); // Built in helper - Helps us parse through URL's
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys'); // Mongoose model class - For creating new instances

module.exports = app => {
  // =====================================
  // GET ROUTE - LIST OF SURVEYS
  // =====================================
  // requireLogin - make sure Authenticated
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }) // Find surveys by current user
      .select({ recipients: false }); // Do not include recipients

    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });
  // =====================================
  // POST ROUTE - WEBHOOKS
  // =====================================
  app.post('/api/surveys/webhooks', (req, res) => {
    // Extract survey ID and Choice
    // 1) Create a parser object
    const p = new Path('/api/surveys/:surveyId/:choice'); // object we can use
    // Map over list of events - then extract Id and Choice
    _.chain(req.body)
      .map(({ email, url }) => {
        // Contains id and choice
        const match = p.test(new URL(url).pathname); // Will be either object or null
        if (match) {
          return {
            email: email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      // Iterate through our event list and remove any "undefined"
      .compact()
      // Remove duplicate records
      .uniqBy('email', 'surveyId')
      // For every event we want to run our query
      .each(({ surveyId, email, choice }) => {
        // MONGO QUERY
        Survey.updateOne(
          {
            // Find and update one record
            _id: surveyId, // Find survey with this given ID
            recipients: {
              // And recipient
              $elemMatch: { email: email, responded: false } // with this given email and has not responded to survey
            }
          },
          {
            // Then make this update
            $inc: { [choice]: 1 }, // Increment choice (yes or no) by 1
            $set: { 'recipients.$.responded': true }, // Update recipient's reponded property to true
            lastResponded: new Date()
          }
        ).exec(); // Executes query
      })
      .value();

    res.send({});
  });

  // =====================================
  // POST ROUTE - CREATES NEW SURVEY
  // =====================================
  // 1) Check if user is logged in (Authenticated) by requiring the requireLogin middleware and adding it as a second argument.
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    // Using lowercase survey to indicate new instance of survey
    const survey = new Survey({
      title: title,
      subject: subject,
      body: body,
      // Split the String by comma - Returns array of strings
      // For every email address => return a new object with property of email with the email address
      recipients: recipients.split(',').map(email => {
        return { email: email.trim() }; // trim() cuts out any extra white space
      }),
      _user: req.user.id, // Pass in ID thats automatically generated by mongo
      dateSent: Date.now() // Returns a date object
    });
    // Great place to send email
    // Anytime we want to send email, we pass an object "survey" containing diff properties
    // As a second arugement will pass in the content of the actual e-mail | HTML
    const mailer = new Mailer(survey, surveyTemplate(survey));
    // Watches these three await keywords - If anything goes wrong with these async statements - catch the request and immediatly send back a response.
    try {
      await mailer.send(); // So mailer sends itself
      await survey.save(); // Save survey we just sent
      req.user.credits -= 1; // Deduct credit
      const user = await req.user.save(); // Save user
      res.send(user); // Send back updated user model with updated number of credits
    } catch (err) {
      res.status(422); // Unprocessable entity
    }
  });
};
