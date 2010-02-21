function showLogin() {
  $('#login').show();
}

function hideLogin() {
  $('#login').hide();
}

function showLoginError() {
  $('#error').show();
}

function showProfilePic(url) {
  $('#profile-pic').append('<img src="'+url+'" width="40" height="40"></img>');
}

function showComposer() {
  $('#composer').show();
}

function removeProfilePic() {
  $('#profile-pic').empty();
}

function removeStream() {
  $('#stream').empty();
}

function showStream(posts, people) {
  var idToPerson = _.reduce(people, {}, function(pplDict, person) {
    pplDict[person.uid] = person;
    return pplDict;
  });
  console.log(posts, idToPerson);
  _.each(posts, function(post) {
    processPost(post, idToPerson);
  });
  $('#stream').show();
}

function processPost(post, people) {
  var actor = people[post.actor_id];
  var target;
  if(post.target_id != null) {
    target = people[post.target_id];
  }

  var result = $('<li></li>');
  result.data(post.post_id);

  // This is where the bulk of the interaction with the raw API data takes place.
  // Possibly, as it evolves, I will find ways to split it up more, but for now
  // this will be a fairly large (ugly) function

  var pic = $('<div class="pic"></div>');
  pic.append('<img src="' + actor.pic_square + '"> </img>');
  result.append(pic);

  var content = $('<div class="post"></div>');

  var info = $('<div class="info"></div>');
  info.append('<a class="name" href="'+actor.profile_url+'">' + actor.name + '</a>');
  if(post.target_id != null) {
    info.append(' &#155; ')
        .append('<a class="name" href="'+target.profile_url+'">' + target.name + '</a>');
  }
  content.append(info);

  // TODO - attachments, enable like/comment links, view all comments, view all likers

  var message = $('<div class="message"></div>');
  message.append(post.message);
  content.append(message);

  var actions = $('<div class="actions"></div>');

  var time = $('<span class="time"></span>');
  var date = new Date(post.created_time*1000);
  time.append(jQuery.timeago(date));
  actions.append(time);

  if(post.comments.can_post) {
    var comment = $('<span class="a comment-btn">Comment</span>')
    actions.append(' &#183; ').append(comment);
  }

  if(post.likes.can_like) {
    var like = $('<span class="a like-btn">Like</span>')
    actions.append(' &#183; ').append(like);
  }

  content.append(actions);

  if(post.likes.count > 0 || post.comments.count > 0) {
    var feedback = $('<div class="feedback"></div>');
    if(post.likes.count > 0) {
      var likes = $('<div class="likes"></div>');
      // TODO - need logic for when to say 'and 2 others'...
      for(var i = 0; i < post.likes.sample.length; i++) {
        var liker = people[post.likes.sample[i]];
        likes.append('<a href="'+liker.profile_url+'">'+liker.name+'</a>');
      }
      if(post.likes.count == 1) {
        likes.append(' likes this.');
      } else {
        likes.append(' like this.');
      }
      feedback.append(likes);
    }

    if(post.comments.count > 0) {
      var comments = $('<ul class="comments"></ul>');
      for(var i = 0; i < post.comments.comment_list.length; i++) {
        var row = post.comments.comment_list[i];
        var commenter = people[row.fromid];
        var comment = $('<li class="comment"></li>');
        var commentInfo = $('<div class="comment-info"></div>');
        commentInfo.append('<a href="' + commenter.profile_url + '" class="comment-name">' + commenter.name + '</a>');
        var date = new Date(row.time * 1000);
        commentInfo.append('<span class="comment-time">' + jQuery.timeago(date) + '</a>');

        var commentMsg = $('<div class="comment-msg">'+ row.text +'</div>');
        comment.append(commentInfo).append(commentMsg);
        comments.append(comment);
      }
      feedback.append(comments);
    }
    content.append(feedback);
  }

  result.append(content);

  var dummy = $('<div class="dummy"></div>');
  result.append(dummy);
  $('#stream').append(result);
}

function initEvents() {
  $('#login-btn').click(function() {
    loginAttempt();
  });

  $('#logout-btn').click(function() {
    logout();
  });

  $('#composer-area').focus(function() {
    $(this).css('color', '#000').val('');
  });

  $('#composer-submit').click(function() {
      // Submit status
  });

  $('a').live('click', function() {
    chrome.tabs.create({ url: $(this).attr('href') });
  });
}

function showActiveIcon() {
  chrome.browserAction.setIcon({ path: '../images/icon19.png'});
}

function showInactiveIcon() {
  chrome.browserAction.setIcon({ path: '../images/icon-loggedout.png'});
}

function showLoading() {
  $('#loading').show();
}

function hideLoading() {
  $('#loading').hide();
}
