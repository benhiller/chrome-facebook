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
var background = chrome.extension.getBackgroundPage();

function checkForSuccessPage() {
  if(!background.isLoggedIn()) {
    chrome.tabs.getAllInWindow(null, function(tabs) {
      for(var i = 0; i < tabs.length; i++) {
        if(tabs[i].url.indexOf(successURL) == 0) {
          // We found a match, now extract the login info and actually login
          var params = tabs[i].url.split('?')[1].split('&');
          var session = JSON.parse(unescape(params[0].split('=')[1]));
          var perms = JSON.parse(unescape(params[1].split('=')[1]));
          background.login(session, perms);
          chrome.tabs.onUpdated.removeListener(checkForSuccessPage);
          return;
        }
      }

      // We did not find a tab, show the connect button again and an error
      // message
      background.setupProcess = 0;
      showLogin();
      if(background.setupProcess == 1) {
        showLoginError();
      }
    });
  }
}

$(document).ready(function() {
    chrome.tabs.onUpdated.addListener(checkForSuccessPage);

    // For logging in to FB4C
    checkForSuccessPage();
    if(background.setupProcess === 0) {
      // Show connect to FB button
      showLogin();
    }

    background.onLoginOrLoggedIn(function() {
      hideLogin();
      background.getProfilePic(function(picURL) {
        showProfilePic(picURL);
      });
      // TODO - just a prototype
      background.getStream(function(stream) {
        showStream(stream);
      });
    });

    background.onLogout(function() {
      showLogin();
      removeProfilePic();
      removeStream();
    });

    initClicks();

});
