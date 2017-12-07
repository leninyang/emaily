module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    return res.status(403).send({ error: 'Not enough credits' }); // Sth is wrong - Send response to user
  }

  next(); // User has enough credit - Move on.
};
