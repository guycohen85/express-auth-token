
// register
	// client: send username, email and password
	// server: validate credentials
		// create accessToken-15min and refreshToken 2mo
		// save user+refreshToken to db
		// send accessToken+refreshToken

//login
	// client: send email and password
	// server: validate credentials

// protected route
	// server: if no tokens, send error 401
	// client: send access+refresh tokens
	// server: use access token:
		// if expired: use refresh token to generate new access+refresh tokens: send new tokens
		// if refresh token expired, delete from the database and send error 401 
		// if refresh token is not exists in the database, it's mean that it already have been used and deleted
			// reused detected: probably a hacker.
			// try to decode the refresh token, if expired then just return 403
			// if not expired find the user and delete all tokens

	// server: 

	// on change password delete all refresh tokens