var helper = (function () {
    var BASE_API_PATH = 'plus/v1/';

    return {
        /**
         * Hides the sign in button and starts the post-authorization operations.
         *
         * @param {Object} authResult An Object which contains the access token and
         *   other authentication information.
         */
        onSignInCallback_OLD: function (authResult) {
            gapi.client.load('plus', 'v1', function () {
                $('#authResult').html('Auth Result:<br/>');
                for (var field in authResult) {
                    $('#authResult').append(' ' + field + ': ' + authResult[field] + '<br/>');
                }
                if (authResult['access_token']) {
                    $('#authOps').show('slow');
                    $('#gConnect').hide();
                    helper.profile();
                    helper.mail();
                } else if (authResult['error']) {
                    // There was an error, which means the user is not signed in.
                    // As an example, you can handle by writing to the console:
                    console.log('There was an error: ' + authResult['error']);
                    $('#authResult').append('Logged out');
                    $('#authOps').hide('slow');
                    $('#gConnect').show();
                }
                console.log('authResult', authResult);
            });
        },

        onSignInCallback: function (authResult) {
            if (authResult['code']) {
                console.log('authResult: ', authResult);

                // Hide the sign-in button now that the user is authorized, for example:
                $('#gConnect').hide();

                // Send the code to the server
                $.ajax({
                    type: 'POST',
                    url: '/Session/Open',
                    contentType: 'application/json; charset=utf-8',
                    // dataType: 'json',
                    success: function(result) {
                        // Handle or verify the server response if necessary.

                        // Prints the list of people that the user has allowed the app to know
                        // to the console.
                        console.log(result);
                        if (result['profile'] && result['people']) {
                            $('#results').html('Hello ' + result['profile']['displayName'] + '. You successfully made a server side call to people.get and people.list');
                        } else {
                            $('#results').html('Failed to make a server-side call. Check your configuration and console.');
                        }
                    },
                    processData: false,
                    data: JSON.stringify({'code': authResult.code})
                });
            } else if (authResult['error']) {
                // There was an error.
                // Possible error codes:
                //   "access_denied" - User denied access to your app
                //   "immediate_failed" - Could not automatially log in the user
                // console.log('There was an error: ' + authResult['error']);
                console.log('There was an error: ' + authResult['error']);
                    $('#authResult').append('Logged out');
                    $('#authOps').hide('slow');
                    $('#gConnect').show();
            }
        },

        /**
         * Calls the OAuth2 endpoint to disconnect the app for the user.
         */
        disconnect: function () {
            // Revoke the access token.
            $.ajax({
                type: 'GET',
                url: 'https://accounts.google.com/o/oauth2/revoke?token=' + gapi.auth.getToken().access_token,
                async: false,
                contentType: 'application/json',
                dataType: 'jsonp',
                success: function (result) {
                    console.log('revoke response: ' + result);
                    $('#authOps').hide();
                    $('#profile').empty();
                    $('#authResult').empty();
                    $('#gConnect').show();
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },

        /**
         * Gets and renders the currently signed in user's profile data.
         */
        profile: function () {
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            request.execute(function (profile) {
                $('#profile').empty();
                if (profile.error) {
                    $('#profile').append(profile.error);
                    return;
                }
                $('#profile').append(
                    $('<p><img src=\"' + profile.image.url + '\"></p>'));
                $('#profile').append(
                    $('<p>Hello ' + profile.displayName + '!<br />Tagline: ' + profile.tagline + '<br />About: ' + profile.aboutMe + '</p>'));
                if (profile.cover && profile.coverPhoto) {
                    $('#profile').append(
                        $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
                }
            });
        },

        mail: function() {
            // Load the oauth2 libraries to enable the userinfo methods.
            gapi.client.load('oauth2', 'v2', function() {
                var request = gapi.client.oauth2.userinfo.get();
                request.execute( function(userinfo){
                    if (userinfo.error) {
                    $('#profile').append(userinfo.error);
                        return;
                    }
                    $('#profile').append($('<p> ' + userinfo.email +  '</p>'));
                });
            });
        }
    };
})();

/**
 * jQuery initialization
 */
$(document).ready(function() {
  $('#disconnect').click(helper.disconnect);
  $('#loaderror').hide();
  if ($('[data-clientid="YOUR_CLIENT_ID"]').length > 0) {
    alert('This sample requires your OAuth credentials (client ID) ' +
        'from the Google APIs console:\n' +
        '    https://code.google.com/apis/console/#:access\n\n' +
        'Find and replace YOUR_CLIENT_ID with your client ID.'
    );
  }
});

/**
 * Calls the helper method that handles the authentication flow.
 *
 * @param {Object} authResult An Object which contains the access token and
 *   other authentication information.
 */
function signinCallback(authResult) {
  helper.onSignInCallback(authResult);
}