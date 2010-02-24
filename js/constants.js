var background = chrome.extension.getBackgroundPage();
var apiKey = '61615cf294eae2e565943c210d7a9387';
var successURL = 'http://benhiller.github.com/success.html';
var cancelURL = 'http://www.facebook.com/connect/login_failure.html';
var permissions = 'read_stream,publish_stream,offline_access';
var loginURL = 'http://www.facebook.com/login.php?api_key=' + apiKey +
                '&fbconnect=true' +
                '&v=1.0' +
                '&connect_display=page' +
                '&return_session=true' +
                '&session_key_only=true' +
                '&next=' + successURL +
                '&cancel_url=' + cancelURL +
                '&req_perms=' + permissions;

