/*
  Story[] getStream(bool refresh, id filter_key); // Can get wall or news feed, just change filter_key
  Story[] getNotifications(bool refresh); // Maybe need diff return type

  // Obviously, expand as needed
*/


function login(sess, perms) {
  // Ignore perms for now
  // TODO: Look at http://static.ak.fbcdn.net/connect/en_US/core.debug.js
  // and figure out how to use setSession
  loggedIn = true;
}

function logout() {
  FB.logout(function(result) {
    // TODO - Make sure it worked?
  });
}

function ifLoggedIn(cb) {
  return FB.getLoginStatus(function(result) {
    if(response.session) {
      cb();
    }
  });
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

function getStream(

function startBackground() {
  // Do things here that must be done when the extension is
  // installed/opened
  // Such as, test login status, load news feed, check for
  // notifications
}
