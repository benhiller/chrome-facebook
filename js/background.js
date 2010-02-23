var setupProcess = 0;
var start;
var end;

function login(session) {
  setupProcess = 2;
  localStorage.session = JSON.stringify(session);
  localStorage.logged_in = 'true';
  FB.Auth.setSession(session, 'connected');
  // FB.init({ apiKey: apiKey, session: session, status: true });
}

function logout() {
  setupProcess = 0;
  localStorage.logged_in = 'false';
  FB.Auth.setSession(null, 'notConnected');
  //FB.logout(function(result) {
    // TODO - Make sure it worked?
  //});
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
    // action_links: [{text: 'Dislike', href: 'localhost'}] // April fools joke?
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

function addLike(post_id) {
  FB.api({
    method: 'stream.addLike',
    post_id: post_id
  }, function(result) {
    console.log(result);
    // Handle response in some manner
  });
}

// TODO - probably need to parameterize things in query at some point
function getStream(cb) {
  if(start) start();
  FB.api({
    method: 'fql.multiquery',
    queries:
      { news_feed: 'SELECT likes, comments, attachment, post_id, created_time, target_id, actor_id, message FROM stream WHERE filter_key="nf" AND is_hidden = 0',
        people: 'SELECT uid, name, pic_square, profile_url from user WHERE uid IN (SELECT actor_id FROM #news_feed) OR uid IN (SELECT target_id FROM #news_feed)'
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
      d[person.uid] = person;
      return d;
    });


    FB.api({
      method: 'fql.query',
      query: 'SELECT uid, name, pic_square, profile_url FROM user WHERE uid IN (' + uids + ')'
    },
    function(more_people) {
      console.log(more_people);
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
    console.log(result);
    cb(result[0].pic_square);
  });
}

function setStart(cb) {
  start = cb;
}

function setEnd(cb) {
  end = cb;
}
