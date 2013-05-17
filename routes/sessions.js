var utils = require('./../utils'),
	models = require('./../models'),
	google = require('./../google'),
	nconf = require('nconf');


function getAccessToken(oauth2Client, callback) {
	oauth2Client.getToken(req.body.code, function(err, tokens) {
		// retrieve an access_token and optionally a refresh_token.
		if (err) {
			console.log('Error retrieving tokens from Google: %s', err);
			// throw new Error('Error retrieving tokens from Google: ' + err.message);
		} else if (!tokens) {
			console.log("No tokens in Google's response");
			err = new Error("No tokens in Google's response");
		} else {

			console.log("google tokens: ", tokens);

			// retrieve user info
			// oauth2Client.credentials = {
			// 	access_token: tokens.access_token,
			// 	refresh_token: 'REFRESH TOKEN HERE'
			// };

			oauth2Client.credentials = tokens;

			callback(err);

			// client.plus.people.get({
			// 	userId: 'me'
			// })
			// 	.withAuthClient(oauth2Client)
			// 	.execute(callback);

			// res.clearCookie('token');
			// req.session.token = undefined;
		}
	});
}

function getUserProfile(client, authClient, userId, callback) {
	client.plus.people.get({
		userId: userId
	})
		.withAuthClient(authClient)
		.execute(callback);
}


/*
 * GET Login page.
 */

exports.newSession = function(req, res) {
	// generate anti forgery token, send it to the client and store it on server for further control
	var token = utils.uid(24);
	req.session.token = token;
	res.cookie('token', token, {
		maxAge: 300000,
		path: '/',
		signed: true
	});

	res.render('session/new', {
		title: 'ToDoMap'
	});
};

exports.openSession = function(req, res) {
	// console.log("req: " + req);
	// console.log("req.body: " + JSON.stringify( req.body));
	// console.log("req.body: " + req.body);
	console.log("code: " + req.body.code);

	if (req.body.code) {
		if (google.apiClient) {
			var oauth2Client = google.newOAuth2Client();
			getAccessToken(oauth2Client, function(err) {
				if (err) {
					console.log('Error getting the access token from Google: %s', err);
				} else {
					getUserProfile(client, oauth2Client, 'me', function(err, profile) {
						if (err) {
							console.log('An error occurred');
						} else {
							console.log('Profile: %s', profile);

							res.clearCookie('token');
							req.session.token = undefined;


							User.findOne({
								provider: req.body.provider,
								providerUserId: req.body.providerUserId
							}, function(err, user) {
								if (err || !user) {
									// req.flash('error', 'Incorrect credentials');
									console.log('Error loading user: ' + err);
									res.redirect('/Session/New');
								}

								if (user) {
									console.log('Returning user: ' + user)
									req.session.userId = user.id;
									res.redirect('/');
								} else {
									// req.flash('error', 'Incorrect credentials');
									console.log('New user: ' + user);
								}

								// temp
								res.redirect('/Session/New');
							});
						}
					});
				}

			});
		} else {
			console.log('Google Api Client is undefined');
		}
	} else {

	}


};