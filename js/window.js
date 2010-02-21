function loginAttempt() {
  chrome.tabs.create({ url: loginURL });
  background.setupProcess = 1;
}

function logout() {
  background.logout();
}

function submitComment(postID, comment) {
  background.addComment(postID, comment, console.log);
}
