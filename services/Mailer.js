// A lot of Boiler Plate for Sendgrind Email
const sendgrid = require('sendgrid');
const helper = sendgrid.mail; // Traditionally ES6 { mail } = sendgrid - but we're calling it helper (sendgrid documentation) - Helper object that helps us create the mailer
const keys = require('../config/keys'); // Requiring API Keys

// helper.Mail is an object that takes a lot of configuration and spits out a Mailer.
// We want to add more cuztomization to the Mailer class and we do it by extending it to helper.Mailer
class Mailer extends helper.Mail {
  // Need constructor when we use "new Mailer" back in surveyRoutes
  // "content" - HTML string we got from surveyTemplate(survey)
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);

    // Sendgrid specific setup
    this.from_email = new helper.Email('no-reply@emaily.com'); // Who is sending email
    this.subject = subject;
    this.body = new helper.Content('text/html', content); // HTML to display in body
    this.recipients = this.formatAddresses(recipients); // Helper function

    this.addContent(this.body); // Built in functions to add body
    // Enables "click" tracking inside our email
    this.addClickTracking(); // Helper function we define
    this.addRecipients(); // Helper function that takes the formatted list and somehow registers it with the actual email.
  }

  formatAddresses(recipients) {
    // For every recipient - extract email property
    return recipients.map(({ email }) => {
      return new helper.Email(email); // Format email property with helper and return it
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);
    // Take that one variable that we just declared and pass in the second one  we declared
    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();

    // Iterate over out list of recipient that we have assigned to this.recipients and for each recipient will mae use of this "personalize" object we declared
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
