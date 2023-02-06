//  I used the function isAdmin in the utils and not the User model because I didn't want
// to call the database to get the user fot just checking if a user is an admin.
// the downside of this approach is that if the user is no longer an admin, the user will still
// remain an admin until the token will be expired(15min)
exports.isAdmin = (req) => req.user.roles?.includes('admin');
