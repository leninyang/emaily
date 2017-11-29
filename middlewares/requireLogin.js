module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' }); // Sth is wrong - Send response to user
  }

  next(); // User is logged in - Move on.
};
