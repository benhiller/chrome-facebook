var successURL = 'http://www.facebook.com/connect/login_success.html';
var cancelURL = 'http://www.facebook.com/connect/login_failure.html';
var permissions = 'read_stream,publish_stream,offline_access';
var apiKey = '61615cf294eae2e565943c210d7a9387';
var loginURL = 'http://www.facebook.com/login.php?api_key=' + apiKey +
                '&fbconnect=true' +
                '&v=1.0' +
                '&connect_display=page' +
                '&return_session=true' +
                '&session_key_only=true' +
                '&next=' + successURL +
                '&cancel_url=' + cancelURL +
                '&req_perms=' + permissions;

function getBackground() {
  return chrome.extension.getBackgroundPage();
}

$(document).ready(function() {
    getBackground.ifLoggedIn(function() {
      // Init news feed and stuff 
    });

    $('#login-btn').click(function() {
      chrome.tabs.create({ url: loginURL });
    });

    $('#finish-login-btn').click(function() {
      chrome.tabs.getAllInWindow(null, function(tabs) {
        for(var i = 0; i < tabs.length; i++) {
          if(tabs[i].url.match(success_url)) {
            var params = tabs[i].url.split('?')[1].split('&');
            var session = JSON.parse(unescape(params[0].split('=')[1]));
            var perms = JSON.parse(unescape(params[1].split('=')[1]));
            getBackground().login(session, perms);
            break;
          }
        }
      });
    });
});
