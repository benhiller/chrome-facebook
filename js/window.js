var newsFeedCond = 'filter_key="nf" AND is_hidden = 0';
var wallCond = 'source_id = ';

function loginAttempt() {
  background.setupProcess = 1;
  chrome.tabs.create({ url: loginURL });
}

function logout() {
  background.logout();
}

function submitComment(postID, comment, cb) {
  background.addComment(postID, comment, function(r) { console.log(r); cb(); } );
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
  background.getStream(newsFeedCond, function(posts, people) {
    showStream(posts, people);
  });
}

function getAllComments(post, postID) {
  background.getAllComments(postID, function(comments, people) {
    showAllComments(post, comments, people);
  });
}

function getProfilePic() {
  background.getProfilePic(function(url) {
    showProfilePic(url);
  });
}

function getStream() {
  background.getStream(newsFeedCond, function(posts, people) {
    showStream(posts, people);
  });
}

function getWall() {
  background.getStream(wallCond + background.uid(), function(posts, people) {
    showWall(posts, people);
  });
}
