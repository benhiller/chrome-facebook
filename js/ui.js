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

function showStream(posts, people) {
  var idToPerson = _.reduce(people, {}, function(pplDict, person) {
    pplDict[person.id] = person;
    return pplDict;
  });
  console.log(posts, idToPerson);
  $('#stream').empty();
  $('#stream').show();
  _.each(posts, function(post) {
    processPost(post, idToPerson);
  });
}

function processPost(post, people) {
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
  pic.append('<img src="' + actor.pic_square + '"> </img>');
  result.append(pic);

  var content = $('<div class="post"></div>');

  var info = $('<div class="info"></div>');
  info.append('<a class="name" href="'+actor.url+'">' + actor.name + '</a>');
  if(post.target_id != null) {
    info.append(' &#155; ')
        .append('<a class="name" href="'+target.url+'">' + target.name + '</a>');
  }
  content.append(info);

  // TODO - attachments, enable like/comment links, view all comments, view all likers

  var message = $('<div class="message"></div>');
  var text = post.message;
  var urls = text.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi);
  if(urls !== null) {
    for(var j = 0; j < urls.length; j++) {
      text = text.replace(urls[j], '<a href="' + urls[j]+ '">'+urls[j] + '</a>"');
    }
  }
  message.append(text);

  var attachmentObject = post.attachment;

  var actions = $('<div class="actions"></div>');

  // TODO - is this correct?
  if(attachmentObject.name) {
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
    var comment = $('<span class="a comment-btn">Comment</span>')
    actions.append(' &#183; ').append(comment);
  }

  if(post.likes.can_like) {
    var like = $('<span class="a like-btn"></span>');
    if(post.likes.user_likes) {
      like.append('Unlike');
    } else {
      like.append('Like');
    }
    actions.append(' &#183; ').append(like);
  }

  content.append(actions);

  var feedback = $('<div class="feedback"></div>');
  if(post.likes.count > 0) {
    var likes = $('<div class="likes"></div>');
    // TODO - need logic for when to say 'and 2 others'...
    for(var i = 0; i < post.likes.sample.length; i++) {
      var liker = people[post.likes.sample[i]];
      likes.append('<a href="'+liker.url+'">'+liker.name+'</a>');
    }
    if(post.likes.count == 1) {
      likes.append(' likes this.');
    } else {
      likes.append(' like this.');
    }
    feedback.append(likes);
  }

  var comments = $('<ul class="comments"></ul>');
  if(post.comments.count > 0) {
    for(var i = 0; i < post.comments.comment_list.length; i++) {
      var row = post.comments.comment_list[i];
      var commenter = people[row.fromid];
      var comment = $('<li class="comment"></li>');
      var commentInfo = $('<div class="comment-info"></div>');
      commentInfo.append('<a href="' + commenter.url + '" class="comment-name">' + commenter.name + '</a>');
      var date = new Date(row.time * 1000);
      commentInfo.append('<span class="comment-time">' + jQuery.timeago(date) + '</a>');

      var commentMsg = $('<div class="comment-msg">'+ row.text +'</div>');
      comment.append(commentInfo).append(commentMsg);
      comments.append(comment);
    }
  }
  feedback.append(comments);
  content.append(feedback);

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
    if($(this).val() == "What's on your mind?") {
      $(this).css('color', '#000').val('');
    }
  }).focusout(function() {
    if($(this).val() == '') {
      $(this).css('color', '#9C9C9C').val("What's on your mind?");
    }
  });

  $('#items li.selected').live('hover', function() {
    showRefresh();
  }).live('mouseleave', function() {
    hideRefresh();
  }).live('click', function() {
    animateRefresh();
  });


  $('#stream-btn.selected').live('click', function() {
    refreshStream(animateRefresh, stopAnimatingRefresh);
  });

  $('.post-comment textarea').live('focus', function() {
    if($(this).val() == "Write a comment...") {
      $(this).css('color', '#000').val('');
    }
  }).live('focusout', function() {
    if($(this).val() == '') {
      $(this).css('color', '#9C9C9C').val('Write a comment...');
    }
  });

  $('.comment-submit').live('click', function() {
    var post = $(this).parents('li.story');
    var postID = post.data('post_id');
    submitComment(postID, post.find('.post-comment textarea').val(), function() { refreshStream(); });
    removeCommentBox(post);
    // Will need to also display comment in list
  });

  $('#composer-submit').click(function() {
      // Submit status
      submitStatus($('#composer textarea').val(),
      function() {
        refreshStream(animateRefresh, stopAnimatingRefresh);
      });
      $('#composer textarea').val('').focusout();
  });

  $('a').live('click', function() {
    chrome.tabs.create({ url: $(this).attr('href') });
  });

  $('span.comment-btn').live('click', function() {
    showAndSelectCommentBox($(this).parents('li.story'));
  });

  $('span.like-btn').live('click', function() {
    likeStory($(this).parents('li.story'));
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
              .append('<span class="blue-btn comment-submit"><button>Comment</button></span>');
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
  if(post.find('.like-btn').text() == 'Like') {
    submitLike(post.data('post_id'));
    post.find('.like-btn').text('Unlike');
  } else {
    removeLike(post.data('post_id'));
    post.find('.like-btn').text('Like');
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
