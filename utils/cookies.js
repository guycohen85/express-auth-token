function setRefreshTokenCookie(res, refreshToken) {
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  res.cookie('token', refreshToken, {
    httpOnly: true,
    // secure: true,
    maxAge: sevenDays,
  });
}

module.exports = { setRefreshTokenCookie };
