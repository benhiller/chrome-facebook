function showLogin() {
  $('#login').show();
}

function hideLogin() {
  $('#login').hide();
}

function showLoginError() {
  $('#error').show();
}

function showProfilePic(url) {
  $('#profile-pic').append('<img src="'+url+'" width="40" height="40"></img>');
}

function removeProfilePic() {
  $('#profile-pic').empty();
}

function removeStream() {
  $('#stream').empty();
}

function showStream(stream) {
  // TODO - actually implement this
}

function initClicks() {
  $('#login-btn').click(function() {
    loginAttempt();
  });

  $('#logout-btn').click(function() {
    logout();
  });
}

function showActiveIcon() {
  chrome.browserAction.setIcon({ path: '../images/icon19.png'});
}

function showInactiveIcon() {
  chrome.browserAction.setIcon({ path: '../images/icon-loggedout.png'});
}
