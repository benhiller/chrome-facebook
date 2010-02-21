/*
  Story[] getStream(bool refresh, id filter_key); // Can get wall or news feed, just change filter_key
  Story[] getNotifications(bool refresh); // Maybe need diff return type

  // Obviously, expand as needed
*/

var setupProcess = 0;

function login(session, perms) {
  // Ignore perms for now
  setupProcess = 2;
  localStorage.session = JSON.stringify(session);
  localStorage.logged_in = 'true';
  FB.init({ apiKey: apiKey, session: session, status: true });
}

function logout() {
  setupProcess = 0;
  localStorage.logged_in = 'false';
  FB.logout(function(result) {
    // TODO - Make sure it worked?
  });
}

function onLoginOrLoggedIn(cb) {
  FB.Event.subscribe('auth.login', function() {
    cb();
  });
  if(FB.getSession() !== null) {
    cb();
  }
  // I do not think we need to check current login status
}

function onLogout(cb) {
  FB.Event.subscribe('auth.logout', function() {
    cb();
  });
}

function isLoggedIn() {
  return (FB.getSession() !== null);
}

function publish(status) {
  FB.publish({
    message: status
  }, function(result) {
    // TODO - Ensure it succeeded, report error
  });
}

function addComment(post_id, comment) {
  FB.api({
    method: 'stream.addComment',
    post_id: post_id,
    comment: comment
  }, function(result) {
    // Handle response in some manner
  });
}

function addLike(post_id) {
  FB.api({
    method: 'stream.addLike',
    post_id: post_id
  }, function(result) {
    // Handle response in some manner
  });
}

function getStream(cb) {
}

$(document).ready(function() {
  // Do things here that must be done when the extension is
  // installed/opened
  // Such as, test login status, load news feed, check for
  // notifications
  if(localStorage.logged_in == 'true') {
    login(JSON.parse(localStorage.session));
  }
});

function getProfilePic(cb) {
  FB.api({
    method: 'fql.query', query: 'SELECT pic_square FROM profile WHERE id=' + FB.getSession().uid
  },
  function(result) {
    cb(result[0].pic_square);
  });
}
