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
      showLogin(background.setupProcess == 1);
      removeProfilePic();
      hideComposer();
      removeStream();
      showInactiveIcon();
    });

    initEvents();

});
