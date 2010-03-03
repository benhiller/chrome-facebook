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
  background.getStream(true, true, function(posts, people) {
    showStream(posts, people);
  });
}

function refreshWall(start, end) {
  background.setStart(start);
  background.setEnd(end);
  background.getStream(true, false, function(posts, people) {
    showWall(posts, people);
  });
}

function refreshInbox(start, end) {
  background.setStart(start);
  background.setEnd(end);
  background.getInbox(true, true, function(threads, people) {
    showThreads(threads, people);
  });
}

function refreshNotifications(start, end) {
  background.setStart(start);
  background.setEnd(end);
  background.getNotifications(true, true, function(posts, apps) {
    showNotifications(posts, apps);
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
  background.getStream(false, true, function(posts, people) {
    showStream(posts, people);
  });
}

function getWall() {
  background.getStream(false, false, function(posts, people) {
    showWall(posts, people);
  });
}

function getInbox() {
  background.getInbox(false, true, function(threads, people) {
    showThreads(threads, people);
  });
}

function getNotifications() {
  background.getNotifications(false, true, function(posts, apps) {
    showNotifications(posts, apps);
  });
}

function markNotificationsAsRead() {
  background.getNotifications(false, false, function(notifications, apps) {
    var unreadIds = [];
    for(var i = 0; i < notifications.length; i++) {
      console.log(notifications[i]);
      if(notifications[i].is_unread) {
        unreadIds.push(notifications[i].notification_id);
      }
    }
    background.markNotificationsAsRead(unreadIds);
  });
}

function forceNotificationRefresh() {
  background.forceNotificationRefresh();
}
