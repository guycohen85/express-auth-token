function extractErrors(details) {
  const errors = {};

  details.forEach((error) => {
    errors[error.path[0]] = error.message;
  });

  return errors;
}

module.exports = {
  extractErrors,
};
