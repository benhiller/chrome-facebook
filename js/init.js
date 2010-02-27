$(document).ready(function() {
    background.setStart(showLoading);
    background.setEnd(hideLoading);

    background.setupLoginLogoutHandlers();

    background.onLogin(function() {
      showActiveIcon();
      hideLogin();
      getProfilePic();
      getStream();
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
