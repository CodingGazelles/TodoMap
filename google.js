var googleapis = require('googleapis'),
	nconf = require('nconf'),
	OAuth2Client = googleapis.OAuth2Client,
	apiClient;

function loadApiClient() {
	console.log('Loading Google Api Client');
	googleapis
		.discover('plus', 'v1')
		.execute(function(err, client) {
			if(err){
				console.log('Error while loading google oauth2Client: %s', err);
			} else {
				console.log('Google API Client OK: %s', client);
				apiClient = client;
			}
		});
}

function newOAuth2Client() {
	console.log('Loading Google oauth2Client');
	var oauth2Client = new OAuth2Client(
		nconf.get('google:clientId'),
		nconf.get('google:clientSecret'),
		nconf.get('google:redirectUrl')
	);

	console.log("Google oauth2Client OK: ", oauth2Client);
	return oauth2Client;
}

exports.apiClient = apiClient;
exports.loadApiClient = loadApiClient;
exports.newOAuth2Client = newOAuth2Client;