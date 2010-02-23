function loginAttempt() {
  chrome.tabs.create({ url: loginURL });
  background.setupProcess = 1;
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
