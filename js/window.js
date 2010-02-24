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

function submitStatus(status, cb) {
  background.publish(status, function(r) { console.log(r); cb(); } );
}

function submitLike(postID) {
  background.addLike(postID, function(r) { console.log(r); } );
}

function removeLike(postID) {
  background.removeLike(postID, function(r) { console.log(r); } );
}

function refreshStream(start, end) {
  background.setStart(start);
  background.setEnd(end);
  background.getStream(function(posts, people) {
    showStream(posts, people);
  });
}

function getAllComments(post, postID) {
  background.getAllComments(postID, function(comments, people) {
    showAllComments(post, comments, people);
  });
}
