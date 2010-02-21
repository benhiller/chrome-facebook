/*
  Story[] getStream(bool refresh, id filter_key); // Can get wall or news feed, just change filter_key
  Story[] getNotifications(bool refresh); // Maybe need diff return type

  // Obviously, expand as needed
*/

var setupProcess = 0;
var start;
var end;

function login(session, perms) {
  // Ignore perms for now
  setupProcess = 2;
  localStorage.session = JSON.stringify(session);
  localStorage.logged_in = 'true';
  FB.init({ apiKey: apiKey, session: session, status: true });
}

function logout() {
  setupProcess = 0;
  localStorage.logged_in = 'false';
  FB.logout(function(result) {
    // TODO - Make sure it worked?
  });
}

function onLogin(cb) {
  FB.Event.subscribe('auth.login', function() {
    cb();
  });
  if(FB.getSession() !== null) {
    cb();
  }
  // I do not think we need to check current login status
}

function onLogout(cb) {
  FB.Event.subscribe('auth.logout', function() {
    cb();
  });
}

function isLoggedIn() {
  return (FB.getSession() !== null);
}

function publish(status) {
  FB.publish({
    message: status
  }, function(result) {
    // TODO - Ensure it succeeded, report error
  });
}

function addComment(post_id, comment) {
  FB.api({
    method: 'stream.addComment',
    post_id: post_id,
    comment: comment
  }, function(result) {
    // Handle response in some manner
  });
}

function addLike(post_id) {
  FB.api({
    method: 'stream.addLike',
    post_id: post_id
  }, function(result) {
    // Handle response in some manner
  });
}

// TODO - probably need to parameterize things in query at some point
function getStream(cb) {
  if(start) start();
  FB.api({
    method: 'fql.multiquery',
    queries:
      { news_feed: 'SELECT likes, comments, attachment, post_id, created_time, target_id, actor_id, message FROM stream WHERE filter_key="nf"',
        people: 'SELECT uid, name, pic_square, profile_url from user WHERE uid IN (SELECT actor_id FROM #news_feed) OR uid IN (SELECT target_id FROM #news_feed)'
      }
      // TODO - what about people who liked/commented on something!
  },
  function(result) {
    var posts = result[0].fql_result_set;
    var uids = _.reduce(posts, [], function(ids, p) {
      ids = ids.concat(_.map(p.comments.comment_list, function (c) { return c.fromid; }));
      if(p.likes.sample.length > 0)
        ids = ids.concat(p.likes.sample);
      return _.uniq(ids);
    });

    var people = _.reduce(result[1].fql_result_set, {}, function(d, person) {
      d[person.uid] = person;
      return d;
    });


    FB.api({
      method: 'fql.query',
      query: 'SELECT uid, name, pic_square, profile_url FROM user WHERE uid IN (' + uids + ')'
    },
    function(more_people) {
      more_people = _.reduce(more_people, {}, function(d, person) {
        d[person.uid] = person;
        return d;
      });
      for(var uid in more_people) {
        people[uid] = more_people[uid];
      }
      if(end) end();
      cb(posts, people);
    });
  });
}

$(document).ready(function() {
  // Do things here that must be done when the extension is
  // installed/opened
  // Such as, test login status, load news feed, check for
  // notifications
  if(localStorage.logged_in == 'true') {
    login(JSON.parse(localStorage.session));
  }
});

function getProfilePic(cb) {
  FB.api({
    method: 'fql.query', query: 'SELECT pic_square FROM profile WHERE id=' + FB.getSession().uid
  },
  function(result) {
    cb(result[0].pic_square);
  });
}

function setStart(cb) {
  start = cb;
}

function setEnd(cb) {
  end = cb;
}
