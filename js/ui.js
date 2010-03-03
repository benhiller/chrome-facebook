function showLogin(error) {
  $('#logout-btn').hide();
  $('#login').show();
  if(error) {
    $('#error').show();
  }
}

function hideLogin() {
  $('#login').hide();
  $('#logout-btn').show();
}

function showProfilePic(url) {
  $('#profile-pic').append('<img src="'+url+'" width="40" height="40"></img>');
}

function showComposer() {
  $('#composer').show();
}

function hideComposer() {
  $('#composer').hide();
}

function removeProfilePic() {
  $('#profile-pic').empty();
}

function removeStream() {
  $('#stream').empty();
}

function showThreads(threads, people) {
  console.log(threads, people);
  $('#inbox').empty();
  $('#inbox').show();
  _.each(threads, function(thread) {
    processThreads(thread, people[thread.snippet_author]);
  });
}

function processThreads(thread, snippet_author) {
  var result = $('<li class="story"></li>');
  if(thread.unread > 0) result.addClass('unread');

  var pic = $('<div class="pic"></div>');
  pic.append('<a href="'+snippet_author.url+'"><img src="' + snippet_author.pic_square + '"> </img></a>');
  result.append(pic);

  var post = $('<div class="post"></div>');

  var message = $('<div class="message"></div>');
  message.append('<div class="subject"><a href="http://facebook.com/?sk=messages&tid='+thread.thread_id+'">'+thread.subject+'</a></div>');
  message.find('.subject a').click(function() {
    setTimeout("forceNotificationRefresh()", 1000);
  });
  message.append('<a class="name" href="'+snippet_author.url+'">'+snippet_author.name+'</a>');
  message.append('<div class="snippet">'+thread.snippet+'</div>');
  post.append(message);
  result.append(post);

  var dummy = $('<div class="dummy"></div>');
  result.append(dummy);

  $('#inbox').append(result);
}

function showNotifications(notifications, apps) {
  console.log(notifications, apps);
  $('#notifications').empty();
  $('#notifications').show();
  _.each(notifications, function(notification) {
    processNotification(notification, apps[notification.app_id]);
  });
}

function processNotification(notification, app) {
  var notif = $('<li></li>');
  var text = $('<span class="notif-text"></span>');
  text.append(notification.title_html);
  if(app && app.icon_url) notif.append(text).css('background-image', 'url('+app.icon_url+')');
  if(notification.is_unread) {
    notif.addClass('unread');
  }
  $('#notifications').append(notif);
}

function showStream(posts, people) {
  var idToPerson = _.reduce(people, {}, function(pplDict, person) {
    pplDict[person.id] = person;
    return pplDict;
  });
  console.log(posts, idToPerson);
  $('#stream').empty();
  $('#stream').show();
  _.each(posts, function(post) {
    processPost(post, idToPerson, $('#stream'));
  });
}

function showWall(posts, people) {
  var idToPerson = _.reduce(people, {}, function(pplDict, person) {
    pplDict[person.id] = person;
    return pplDict;
  });
  console.log(posts, idToPerson);
  $('#wall').empty();
  $('#wall').show();
  _.each(posts, function(post) {
    processPost(post, idToPerson, $('#wall'));
  });
}

function processPost(post, people, area) {
  var actor = people[post.actor_id];
  var target;
  if(post.target_id != null) {
    target = people[post.target_id];
  }

  var result = $('<li class="story"></li>');
  result.data('post_id', post.post_id);

  // This is where the bulk of the interaction with the raw API data takes place.
  // Possibly, as it evolves, I will find ways to split it up more, but for now
  // this will be a fairly large (ugly) function

  var pic = $('<div class="pic"></div>');
  pic.append('<a href="'+actor.url+'"><img src="' + actor.pic_square + '"> </img></a>');
  result.append(pic);

  var content = $('<div class="post"></div>');

  var info = $('<div class="info"></div>');
  info.append('<a class="name" href="'+actor.url+'">' + actor.name + '</a>');
  if(post.target_id != null) {
    info.append(' &#155; ')
        .append('<a class="name" href="'+target.url+'">' + target.name + '</a>');
  }
  content.append(info);

  // TODO - view all likers

  var message = $('<div class="message"></div>');
  var text = post.message;
  var urls = text.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi);
  if(urls !== null) {
    for(var j = 0; j < urls.length; j++) {
      text = text.replace(urls[j], '<a href="' + urls[j]+ '">'+urls[j] + '</a>');
    }
  }
  message.append(text);

  var attachmentObject = post.attachment;

  var actions = $('<div class="actions"></div>');

  // TODO - is this correct?
  if(attachmentObject.name || isArray(attachmentObject.media)) {
    var attachment = $('<div class="attch"></div>');
    actions.css('clear', 'both');

    var media = $('<div class="attch-media"></div>');
    _.each(attachmentObject.media, function(medium) {
      switch(medium.type) {
        case "link":
          // TODO Will it always have href and src?
          media.append('<a href="'+medium.href+'"><img src="'+medium.src+'"> </img></a>');
          break;
        case "photo":
          // TODO Will it always have href and src?
          media.append('<a href="'+medium.href+'"><img src="'+medium.src+'"> </img></a>');
          break;
        case "video":
          // Sample
          //    0: Object
          //      alt: "Modern Family "In The Moonlight (Do Me)" Music Video"
          //      href: "http://www.facebook.com/l.php?u=http%253A%252F%252Fwww.youtube.com%252Fwatch%253Fv%253D66TqUyjqM40&h…"
          //      src: "http://external.ak.fbcdn.net/safe_image.php?d=6e8849bb62d2d1d0f88612f00db9e42b&w=90&h=90&url=http%3A…"
          //      type: "video"
          //      video: Object
          //        display_url: "http://www.youtube.com/watch?v=66TqUyjqM40"
          //        owner: 1602720005
          //        permalink: "http://www.facebook.com/profile.php?v=feed&story_fbid=324744676650&id=1515120004"
          //        source_type: "html"
          //        source_url: "http://www.youtube.com/v/66TqUyjqM40&autoplay=1"
          // TODO Will it always have href and src?
          media.append('<a href="'+medium.href+'"><img src="'+medium.src+'"> </img></a>');
          break;
        case "swf":
          // Sample:
          //    0: Object
          //      alt: ""
          //      href: "http://www.facebook.com/"
          //      src: "http://platform.ak.fbcdn.net/www/app_full_proxy.php?app=24320081510&v=1&size=p&cksum=a9b0c5a4e10ac83…"
          //      swf: Object
          //        flash_vars: ""
          //        height: "90"
          //        preview_img: "http://platform.ak.fbcdn.net/www/app_full_proxy.php?app=24320081510&v=1&size=p&cksum=a9b0c5a4e10ac83…"
          //        source_url: "http://www.lala.com/external/flash/PlaylistWidget.swf?host=www.lala.com&autoPlay=true&partnerId=fbco…"
          //        width: "90"
          //      type: "swf"
          // Not ideal, would want to behave like on facebook,
          media.append('<a href="'+medium.swf.source_url+'"><img src="'+medium.swf.preview_img+'"> </img></a>');
          break;

        // Fill in more cases here
      }
    });
    attachment.append(media);

    var attachmentInfo = $('<div class="attch-info"></div>');
    if(attachmentObject.name) attachmentInfo.append('<div class="attch-name"><a href="' + attachmentObject.href + '">' + attachmentObject.name + '</div>');
    if(attachmentObject.caption) attachmentInfo.append('<div class="attch-caption">' + attachmentObject.caption + '</div>');
    if(attachmentObject.description) attachmentInfo.append('<div class="attch-desc">' + attachmentObject.description + '</div>');
    attachment.append(attachmentInfo);

    message.append(attachment);
  }

  content.append(message);


  var time = $('<span class="time"></span>');
  var date = new Date(post.created_time*1000);
  time.append(jQuery.timeago(date));
  actions.append(time);

  if(post.comments.can_post) {
    var comment = $('<span class="a comment-btn">' + commentText + '</span>')
    actions.append(' &#183; ').append(comment);
  }

  if(post.likes.can_like) {
    var like = $('<span class="a like-btn"></span>');
    if(post.likes.user_likes) {
      like.append(unlikeText);
    } else {
      like.append(likeText);
    }
    actions.append(' &#183; ').append(like);
  }

  content.append(actions);

  var feedback = $('<div class="feedback"></div>');
  if(post.likes.count > 0) {
    var likes = $('<div class="likes"></div>');
    // TODO - need logic for when to say 'and 2 others'...
    if(isArray(post.likes.sample)) {
      for(var i = 0; i < post.likes.sample.length; i++) {
        var liker = people[post.likes.sample[i]];
        if(liker.name !== '') {
          likes.append('<a href="'+liker.url+'">'+liker.name+'</a>');
        } else {
          likes.append('<span class="a">' + someoneText + '</a>');
        }
      }
      if(post.likes.count == 1) {
        likes.append(likesThisText);
      } else {
        likes.append(likeThisText);
      }
    } else {
      likes.append(someoneText + likesThisText);
    }
    feedback.append(likes);
  }

  var comments = renderComments(post.comments, people);

  feedback.append(comments);
  content.append(feedback);

  result.append(content);

  var dummy = $('<div class="dummy"></div>');
  result.append(dummy);
  area.append(result);
}

function initEvents() {
  $('#login-btn').click(function() {
    loginAttempt();
  });

  $('#logout-btn').click(function() {
    logout();
  });

  $('#logout-btn span button').val(logoutText);

  $('#login-text').text(loginButtonText);
  $('#intro').text(introText);
  $('#error').text(errorText);

  $('#composer-area').focus(function() {
    if($(this).val() == statusFillerText) {
      $(this).css('color', '#000').val('');
    }
  }).focusout(function() {
    if($(this).val() == '') {
      $(this).css('color', '#9C9C9C').val(statusFillerText);
    }
  });

  $('#items li.selected').live('hover', function() {
    showRefresh();
  }).live('mouseleave', function() {
    hideRefresh();
  }).live('click', function() {
    animateRefresh();
  });

  $('#items li:not(.selected)').live('click', function() {
      var content = $($(this).data('content'));
      $($('#items li.selected').data('content')).slideUp().hide();
      $('#items li.button').each(function() {
        $($(this).data('content')).hide();
      });
      content.slideDown();
      $('#items li.selected').removeClass('selected');
      $(this).addClass('selected');
      if(content.hasClass('empty')) {
        ($(this).data('init'))();
        content.removeClass('empty');
      }
  });

  $('#stream-btn').data('refresh', function() {
    refreshStream(animateRefresh, stopAnimatingRefresh);
  }).data('init', function() {
    getStream();
  }).data('content', '#stream');

  $('#wall-btn').data('refresh', function() {
    refreshWall(animateRefresh, stopAnimatingRefresh);
  }).data('init', function() {
    getWall();
  }).data('content', '#wall');

  $('#inbox-btn').data('refresh', function() {
      console.log('a');
    refreshInbox(animateRefresh, stopAnimatingRefresh);
  }).data('init', function() {
    getInbox();
  }).data('content', '#inbox');


  $('#notifications-btn').data('refresh', function() {
    refreshNotifications(animateRefresh, stopAnimatingRefresh);
    markNotificationsAsRead();
  }).data('init', function() {
    getNotifications();
    markNotificationsAsRead();
  }).data('content', '#notifications');

  $('#items li.selected.tab').live('click', function() {
    ($(this).data('refresh'))();
  });

  $('.post-comment textarea').live('focus', function() {
    if($(this).val() == commentFillerText) {
      $(this).css('color', '#000').val('');
    }
  }).live('focusout', function() {
    if($(this).val() == '') {
      $(this).css('color', '#9C9C9C').val(commentFillerText);
    }
  });

  $('#composer-area').css('width', chrome.i18n.getMessage('statusWidth'));

  $('.comment-submit').live('click', function() {
    var post = $(this).parents('li.story');
    var postID = post.data('post_id');
    submitComment(postID, post.find('.post-comment textarea').val(), function() { getAllComments(post, postID); });
    removeCommentBox(post);
    // Will need to also display comment in list
  });

  $('#composer-submit').click(function() {
      // Submit status
      if($('#composer textarea').val() == "What's on your mind?") {
        return;
      }
      submitStatus($('#composer textarea').val(),
      function() {
        refreshStream(animateRefresh, stopAnimatingRefresh);
      });
      $('#composer textarea').val('').focusout();
  });

  $('#composer textarea').val(statusFillerText);
  $('#composer-submit').text(shareText);

  $('a').live('click', function() {
    chrome.tabs.create({ url: $(this).attr('href') });
  });

  $('span.comment-btn').live('click', function() {
    showAndSelectCommentBox($(this).parents('li.story'));
  });

  $('span.like-btn').live('click', function() {
    likeStory($(this).parents('li.story'));
  });

  $('.show-more-comments').live('click', function() {
    var story = $(this).parents('li.story');
    getAllComments(story, story.data('post_id'));
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

function showAndSelectCommentBox(post) {
  var commentBox;
  if(post.find('.post-comment').length == 0) {
    commentBox = $('<li class="post-comment"></li>');
    commentBox.append('<textarea rows="2"></textarea')
              .append('<span class="blue-btn comment-submit"><button>' + commentText + '</button></span>');
    post.find('.comments').append(commentBox);
  } else {
    commentBox = post.find('.post-comment');
  }
  commentBox.find('textarea').focus();
}

function removeCommentBox(post) {
  post.find('.post-comment').remove();
}

function likeStory(post) {
  if(post.find('.like-btn').text() == likeText) {
    submitLike(post.data('post_id'));
    post.find('.like-btn').text(unlikeText);
  } else {
    removeLike(post.data('post_id'));
    post.find('.like-btn').text(likeText);
  }
}

function showRefresh() {
  var refreshBtn = $('#items li.selected').children('img.refresh-btn');
  refreshBtn.fadeIn(200);
  $('#items li.selected').children('img.button').stop(true, true).animate({opacity: 0.44}, 200);
}

function hideRefresh() {
  $('#items li.selected').children('img.refresh-btn').fadeOut(300);
  $('#items li.selected').children('img.button').stop(true, true).animate({opacity: 1}, 300);
}

function animateRefresh() {
  $('#items li.selected').children('img.refresh-btn').addClass('rotate');
}

function stopAnimatingRefresh() {
  $('#items li.selected').children('img.refresh-btn').removeClass('rotate');
}

function showAllComments(post, comments, people) {
  post.find('.comments').replaceWith(renderComments(comments, people));
}

function renderComments(commentsObj, people) {
  var commentList = $('<ul class="comments"></ul>');
  var comments;
  if(isArray(commentsObj)) {
    comments = commentsObj;
  } else if(isArray(commentsObj.comment_list)) {
    comments = commentsObj.comment_list;
    if(commentsObj.count != comments.length) {
      commentList.append('<li class="show-more-comments"><span class="a">' + viewAllText + commentsObj.count + commentsText + '</span></li>');
    }
  } else {
    if(commentsObj.count > 0) {
      commentList.append('<li class="show-more-comments"><span class="a">' + viewAllText + commentsObj.count + commentsText + '</span></li>');
    }
    // Don't know how to handle this object, probably no comments
    return commentList;
  }
  for(var i = 0; i < comments.length; i++) {
    var row = comments[i];
    var commenter = people[row.fromid];
    var commentItem = $('<li class="comment"></li>');
    var commentInfo = $('<div class="comment-info"></div>');
    commentInfo.append('<a href="' + commenter.url + '" class="comment-name">' + commenter.name + '</a>');
    var date = new Date(row.time * 1000);
    commentInfo.append('<span class="comment-time">' + jQuery.timeago(date) + '</a>');
    var commentMsg = $('<div class="comment-msg">'+ row.text +'</div>');
    commentItem.append(commentInfo).append(commentMsg);
    commentList.append(commentItem);
  }
  return commentList;
}

// TODO move to more proper place
function isArray(obj) {
  return obj && (length in obj) && typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'));
}
