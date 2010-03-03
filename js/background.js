var setupProcess = 0;
var start;
var end;
var timeout;
var emptyCache = { notifications: { lastUpdated: 0 },
                   wall: { lastUpdated: 0 },
                   inbox: { lastUpdated: 0 },
                   profilePic: { lastUpdated: 0 },
                   stream: { lastUpdated: 0 }};
var cache = emptyCache;

function login(session) {
  setupProcess = 2;
  localStorage.session = JSON.stringify(session);
  localStorage.logged_in = 'true';
  FB.Auth.setSession(session, 'connected');
}

function logout() {
  setupProcess = 0;
  localStorage.logged_in = 'false';
  // Clear the cache
  cache = emptyCache;
  FB.Auth.setSession(null, 'notConnected');
}

function onLogin(cb) {
  FB.Event.subscribe('auth.login', function() {
    console.log("Now logged in");
    cb();
  });
  if(FB.getSession()) {
    console.log("Already logged in", FB.getSession());
    cb();
  }
}

function onLogout(cb) {
  FB.Event.subscribe('auth.logout', function() {
    cb();
  });
  if(!FB.getSession()) {
    cb();
  }
}

function isLoggedIn() {
  return FB.getSession();
}

function publish(status, cb) {
  FB.api({
    method: 'stream.publish',
    message: status,
  }, function(result) {
    console.log(result);
    cb(result);
  });
}

function addComment(post_id, comment, cb) {
  FB.api({
    method: 'stream.addComment',
    post_id: post_id,
    comment: comment
  }, function(result) {
    console.log(result);
    cb(result);
  });
}

function addLike(post_id, cb) {
  FB.api({
    method: 'stream.addLike',
    post_id: post_id
  }, function(result) {
    console.log(result);
    cb(result);
  });
}

function removeLike(post_id, cb) {
  FB.api({
    method: 'stream.removeLike',
    post_id: post_id
  }, function(result) {
    console.log(result);
    cb(result);
  });
}

function getAllComments(postID, cb) {
  FB.api({
    method: 'fql.multiquery',
    queries:
      { comments: 'SELECT fromid, time, text FROM comment WHERE post_id="' + postID + '"',
        people: 'SELECT id, name, pic_square, url FROM profile WHERE id IN (SELECT fromid FROM #comments)'
      }
  },
  function(result) {
    console.log(result);
    var comments = result[0].fql_result_set;
    var people = _.reduce(result[1].fql_result_set, {}, function(d, person) {
      d[person.id] = person;
      return d;
    });
    cb(comments, people);
  });
}

function getInbox(refresh, active, cb) {
  if(active && start) start();
  if(refresh || (!refresh && (new Date()).valueOf() - cache.inbox.lastUpdated > refreshTime)) {
    FB.api({
      method: 'fql.multiquery',
      queries:
        { threads: 'SELECT thread_id, subject, recipients, updated_time, snippet, snippet_author, object_id, unread FROM thread WHERE folder_id = 0 LIMIT 20',
          people: 'SELECT id, name, pic_square, url FROM profile WHERE id IN (SELECT snippet_author FROM #threads)'
        }
    },
    function(result) {
      var threads = result[0].fql_result_set;
      var peopleArray = result[1].fql_result_set;
      var people = _.reduce(peopleArray, {}, function(pplDict, person) {
        pplDict[person.id] = person;
        return pplDict;
      });
      cache.inbox.lastUpdated = (new Date()).valueOf();
      cache.inbox.threads = threads;
      cache.inbox.people = people;
      if(active && end) end();
      cb(threads, people);
    });
  } else {
    if(active && end) end();
    cb(cache.inbox.threads, cache.inbox.people);
  }
}

function getNotifications(refresh, active, cb) {
  if(active && start) start();
  if(refresh || (!refresh && (new Date()).valueOf() - cache.notifications.lastUpdated > refreshTime)) {
    FB.api({
      method: 'fql.multiquery',
      queries:
        { notifications: 'SELECT notification_id, title_html, app_id, created_time, is_unread FROM notification WHERE is_hidden = 0 AND recipient_id=' + uid(),
          apps: 'SELECT app_id, icon_url FROM application WHERE app_id IN (SELECT app_id FROM #notifications)'
        }
    },
    function(result) {
      var notifications = result[0].fql_result_set;
      var appsArray = result[1].fql_result_set;
      var apps = _.reduce(appsArray, {}, function(appDict, app) {
        appDict[app.app_id] = app;
        return appDict;
      });
      cache.notifications.lastUpdated = (new Date()).valueOf();
      cache.notifications.notifications = notifications;
      cache.notifications.apps = apps;
      if(active && end) end();
      cb(notifications, apps);
    });
  } else {
    if(active && end) end();
    cb(cache.notifications.notifications, cache.notifications.apps);
  }
}


function getStream(refresh, stream, cb) {
  if(start) start();
  var cond = stream ? 'filter_key="nf" AND is_hidden = 0' : 'source_id='+uid();
  if(refresh || (!refresh &&
      (stream && (new Date()).valueOf() - cache.stream.lastUpdated > refreshTime)
    || (!stream && (new Date()).valueOf() - cache.wall.lastUpdated > refreshTime)
)) {
    FB.api({
      method: 'fql.multiquery',
      queries:
        { news_feed: 'SELECT likes, comments, attachment, post_id, created_time, target_id, actor_id, message FROM stream WHERE ' + cond + ' LIMIT 20',
          people: 'SELECT id, name, pic_square, url FROM profile WHERE id IN (SELECT actor_id FROM #news_feed) OR id IN (SELECT target_id FROM #news_feed)'
        }
    },
    function(result) {
      console.log(result);
      var posts = result[0].fql_result_set;
      var uids = _.reduce(posts, [], function(ids, p) {
        ids = ids.concat(_.map(p.comments.comment_list, function (c) { return c.fromid; }));
        if(p.likes.can_like && p.likes.sample.length > 0)
          ids = ids.concat(p.likes.sample);
        return _.uniq(ids);
      });

      var people = _.reduce(result[1].fql_result_set, {}, function(d, person) {
        d[person.id] = person;
        return d;
      });


      FB.api({
        method: 'fql.query',
        query: 'SELECT id, name, pic_square, url FROM profile WHERE id IN (' + uids + ')'
      },
      function(more_people) {
        more_people = _.reduce(more_people, {}, function(d, person) {
          d[person.id] = person;
          return d;
        });
        for(var id in more_people) {
          people[id] = more_people[id];
        }
        if(stream) {
          cache.stream.lastUpdated = (new Date()).valueOf();
          cache.stream.posts = posts;
          cache.stream.people = people;
        } else {
          cache.wall.lastUpdated = (new Date()).valueOf();
          cache.wall.posts = posts;
          cache.wall.people = people;
        }
        if(end) end();
        cb(posts, people);
      });
    });
  } else {
    if(end) end();
    if(stream) {
      cb(cache.stream.posts, cache.stream.people);
    } else {
      cb(cache.wall.posts, cache.wall.people);
    }
  }
}

function checkForSuccessPage() {
  if(!isLoggedIn()) {
    chrome.tabs.getAllInWindow(null, function(tabs) {
      for(var i = 0; i < tabs.length; i++) {
        if(tabs[i].url.indexOf(successURL) == 0) {
          // We found a match, now extract the login info and actually login
          var params = tabs[i].url.split('?')[1].split('&');
          var session = JSON.parse(unescape(params[0].split('=')[1]));
          var perms = JSON.parse(unescape(params[1].split('=')[1]));
          login(session);
          chrome.tabs.onUpdated.removeListener(checkForSuccessPage);
          return;
        }
      }
    });
  }
}

$(document).ready(function() {
  // Do things here that must be done when the extension is
  // installed/opened
  // Such as, test login status, load news feed, check for
  // notifications
  if(localStorage.logged_in == 'true') {
    login(JSON.parse(localStorage.session));
  }

  setupLoginLogoutHandlers();
});

function setupLoginLogoutHandlers() {
  FB.Event.clear('auth.login');
  FB.Event.clear('auth.logout');

  onLogout(function() {
    chrome.tabs.onUpdated.addListener(checkForSuccessPage);
    checkForSuccessPage();
    showInactiveIcon();
  });

  onLogin(function() {
    showActiveIcon();
  });

  checkNotificationsAndInbox();
}

function checkNotificationsAndInbox() {
  if(isLoggedIn()) {
    getNotifications(true, false, function(notifications, apps) {
      console.log('updating notifications');
      getInbox(true, false, function(threads, people) {
        console.log('updating inbox');
        var count = 0;
        for(var i = 0; i < notifications.length; i++) {
          if(notifications[i].is_unread) {
            count++;
          }
        }
        for(var i = 0; i < threads.length; i++) {
          if(threads[i].unread > 0) {
            count++;
          }
        }
        if(count != 0) {
          chrome.browserAction.setBadgeText({text: count + ""});
        } else {
          chrome.browserAction.setBadgeText({text: ""});
        }
      });
    });
  }

  timeout = setTimeout("checkNotificationsAndInbox()", refreshTime);
}

function getProfilePic(cb) {
  if(cache.profilePic.lastUpdated == 0) {
    FB.api({
      method: 'fql.query', query: 'SELECT pic_square FROM profile WHERE id=' + FB.getSession().uid
    },
    function(result) {
      console.log(result);
      cache.profilePic.url = result[0].pic_square;
      cache.profilePic.lastUpdated = (new Date()).valueOf();
      cb(result[0].pic_square);
    });
  } else {
    cb(cache.profilePic.url);
  }
}

function setStart(cb) {
  start = cb;
}

function setEnd(cb) {
  end = cb;
}

function uid() {
  // Assumed to only be called when logged in
  return FB.getSession().uid;
}

function markNotificationsAsRead(ids) {
  FB.api({
    method: 'notifications.markRead',
    notification_ids: ids
  }, function(result) {
    console.log(result);
    forceNotificationRefresh();
  });
}

function forceNotificationRefresh() {
    clearTimeout(timeout);
    checkNotificationsAndInbox();
}
