function loginAttempt() {
  background.setupProcess = 1;
  chrome.tabs.create({ url: loginURL });
}

function logout() {
  background.logout();
}

function submitComment(postID, comment) {
  background.addComment(postID, comment, function(r) { console.log(r); } );
}

function submitStatus(status) {
  background.publish(status, function(r) { console.log(r); } );
}

function submitLike(postID) {
  background.addLike(postID, function(r) { console.log(r); } );
}
