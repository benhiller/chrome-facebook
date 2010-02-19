var success_url = 'http://www.facebook.com/connect/login_success.html';
var cancel_url = 'http://www.facebook.com/connect/login_failure.html';
var permissions = 'read_stream,publish_stream,offline_access';
var api_key = '61615cf294eae2e565943c210d7a9387';
var login_url = 'http://www.facebook.com/login.php?api_key=' + api_key +
                '&fbconnect=true' +
                '&v=1.0' +
                '&connect_display=page' +
                '&return_session=true' +
                '&session_key_only=true' +
                '&next=' + success_url +
                '&cancel_url=' + cancel_url +
                '&req_perms=' + permissions;

$(document).ready(function() {
    $('#login-btn').click(function() {
      chrome.tabs.create({ url: login_url });
    });

    $('#finish-login-btn').click(function() {
      chrome.tabs.getAllInWindow(null, function(tabs) {
        for(var i = 0; i < tabs.length; i++) {
          if(tabs[i].url.match(success_url)) {
            var params = tabs[i].url.split('?')[1].split('&');
            for(idx in params) {
              console.log(JSON.parse(unescape(params[idx].split('=')[1])));
            }
            break;
          }
        }
      });
    });
});
