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

function checkOnUpdate(tab) {
  if(background.setupProcess != 2) {
    checkForSuccessPage();
  }
}

function checkForSuccessPage() {
  if(background.setupProcess != 2) {
    chrome.tabs.getAllInWindow(null, function(tabs) {
      for(var i = 0; i < tabs.length; i++) {
        if(tabs[i].url.match(successURL)) {
          // We found a match, now extract the login info and actually login
          var params = tabs[i].url.split('?')[1].split('&');
          var session = JSON.parse(unescape(params[0].split('=')[1]));
          var perms = JSON.parse(unescape(params[1].split('=')[1]));
          background.login(session, perms);
          chrome.tabs.onUpdated.removeListener(checkOnUpdate);
          return;
        }
      }

      // We did not find a tab, show the connect button again and an error
      // message
      background.setupProcess = 0;
      $('#login').show();
      if(background.setupProcess == 1) {
        $('#error').show();
      }
    });
  }
}

$(document).ready(function() {
    chrome.tabs.onUpdated.addListener(checkOnUpdate);

    // For logging in to FB4C
    checkForSuccessPage();
    if(background.setupProcess == 0) {
      // Show connect to FB button
      $('#login').show();
    }

    background.onLoginOrLoggedIn(function() {
      $('#login').hide();
      background.getProfilePic(function(picURL) {
        console.log(picURL);
        setProfilePic(picURL);
      });
    });

    $('#login-btn').click(function() {
      chrome.tabs.create({ url: loginURL });
      background.setupProcess = 1;
    });
});
