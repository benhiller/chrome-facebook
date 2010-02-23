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
          background.login(session);
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
    background.setStart(showLoading);
    background.setEnd(hideLoading);

    background.onLogin(function() {
      showActiveIcon();
      hideLogin();
      background.getProfilePic(function(url) {
        showProfilePic(url);
      });
      background.getStream(function(posts, people) {
        showStream(posts, people);
      });
      showComposer();
    });

    background.onLogout(function() {
      chrome.tabs.onUpdated.addListener(checkForSuccessPage);
      checkForSuccessPage();
      showLogin();
      removeProfilePic();
      hideComposer();
      removeStream();
      showInactiveIcon();
    });

    initEvents();

});
