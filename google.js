var googleapis = require('googleapis'),
	nconf = require('nconf'),
	OAuth2Client = googleapis.OAuth2Client,
	apiClient;

(function loadApiClient() {
	console.log('Loading Google Api Client');
	googleapis
		.discover('plus', 'v1')
		.execute(function(err, client) {
			if(err){
				console.log('Error while loading google oauth2Client: %s', err);
			} else {
				console.log('Google API Client OK');
				apiClient = client;
			}
		});
})();

function newOAuth2Client() {
	var oauth2Client = new OAuth2Client(
		nconf.get('google:clientId'),
		nconf.get('google:clientSecret'),
		nconf.get('google:redirectUrl')
	);
	return oauth2Client;
}

exports.apiClient = apiClient;
exports.newOAuth2Client = newOAuth2Client;