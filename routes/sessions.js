var utils = require('./../utils'),
	models = require('./../models'),
	google = require('./../google'),
	nconf = require('nconf');


function getAccessToken(oauth2Client, authCode, callback) {
	console.log('Getting access tokens from Google');
	oauth2Client.getToken(authCode, function(err, tokens) {
		// retrieve an access_token and optionally a refresh_token.
		if (err) {
			console.log('Error retrieving tokens from Google: %s', err);
		} else if (!tokens) {
			console.log("No tokens in Google's response");
			err = new Error("No tokens in Google's response");
		} else {

			console.log("Google tokens: ", tokens);
			
			oauth2Client.credentials = tokens;
			callback(err);
		}
	});
}

function getUserProfile(client, authClient, userId, callback) {
	console.log('Getting user profile from Google');
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

	console.log("code: " + req.body.code);

	if (req.body.code) {
		// getting access tokens
		var oauth2Client = google.newOAuth2Client();
		getAccessToken(oauth2Client, req.body.code, function(err) {
			if (err) {
				console.log('Error getting the access token from Google: %s', err);
			} else {
				
				

				// getting user profile
				getUserProfile(google.apiClient, oauth2Client, 'me', function(err, profile) {
					if (err) {
						console.log('Error getting user profile: %s', err);
					} else {
						
						console.log('Profile: %s', JSON.stringify(profile));

						// check if user already in db
						User.findOne({
							provider: req.body.provider,
							providerUserId: req.body.providerUserId
						},
						function(err, user) {
							

							if (user) {
								console.log('Returning user: ' + user)
								// todo: update user


								// loading map
								req.session.userId = user.id;
								res.redirect('/');
							} else {
								if (err) {
									console.log('Error loading user from db (will create new one): %s', err);
								}

								console.log('Completing user informations');

								// getting user email
								getUserEmail(  dddd , function(err, email){
									if(err){
										console.log('Error getting user email: %s', err);
									} else {

										console.log('User email from Google: %s', email);


										console.log('Inserting user in db');

										// loading map
										res.clearCookie('token');
										req.session.token = undefined;


									}
								});

								// todo create user in db
							}


						});

						
					}
				});
			}
		});
	} else {

	}


};