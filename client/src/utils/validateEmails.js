// emailregex
const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default emails => {
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim())
    .filter(email => re.test(email) === false); // Want to feep invalid emails || For every email that exists inside of our array, we're going to call re.test with the email address || Takes our email and validates it against our regular expression

  // If this thing has any emails inside of it
  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`;
  }
  // If no errors
  return;
};
