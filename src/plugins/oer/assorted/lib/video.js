// Generated by CoffeeScript 1.3.3
(function() {

  define(['aloha', 'jquery', 'popover', 'ui/ui', 'css!assorted/css/image.css'], function(Aloha, jQuery, Popover, UI) {
    var DIALOG_HTML, WARNING_IMAGE_PATH, active_embedder, active_embedder_value, checkURL, embedder, embedders, getTimeString, populator, selector, showModalDialog, uploadImage, vimeo_embed_code_generator, vimeo_embedder, vimeo_query_generator, vimeo_search_results_generator, vimeo_url_validator, youtube_embed_code_generator, youtube_embedder, youtube_query_generator, youtube_search_results_generator, youtube_url_validator;
    embedder = function(url_validator, embed_code_generator, query_generator, search_results_generator) {
      var result;
      this.embed_code_gen = embed_code_generator;
      this.url_validator = url_validator;
      this.query_generator = query_generator;
      this.search_results_generator = search_results_generator;
      return result = this;
    };
    youtube_url_validator = function(url) {
      var regexp, result;
      regexp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
      return result = url.match(regexp) ? RegExp.$1 : false;
    };
    youtube_embed_code_generator = function(id) {
      return jQuery('<iframe style="width:640px; height:360px" width="640" height="360" src="http:\/\/www.youtube.com/embed/' + id + '?wmode=transparent" frameborder="0" allowfullscreen></iframe>');
    };
    youtube_query_generator = function(queryTerms) {
      var terms;
      terms = queryTerms.split(' ');
      return 'https://gdata.youtube.com/feeds/api/videos?q=' + terms.join('+') + '&alt=json&v=2';
    };
    youtube_search_results_generator = function(responseObj) {
      var eleList, idTokens, newEntry, thumbnailHeight, thumbnailUrl, thumbnailWidth, video, videoDescription, videoId, videoLengthString, videoList, videoTitle, _i, _len;
      eleList = [];
      videoList = responseObj.feed.entry;
      for (_i = 0, _len = videoList.length; _i < _len; _i++) {
        video = videoList[_i];
        thumbnailUrl = video.media$group.media$thumbnail[0].url;
        thumbnailHeight = video.media$group.media$thumbnail[0].height;
        thumbnailWidth = video.media$group.media$thumbnail[0].width;
        videoTitle = video.title.$t;
        videoDescription = video.media$group.media$description.$t;
        videoLengthString = getTimeString(video.media$group.yt$duration.seconds);
        idTokens = video.id.$t.split(':');
        videoId = idTokens[idTokens.length - 1];
        newEntry = jQuery('<div style="width:100%;border-bottom: 1px solid black;" class="search-result" id=' + videoId + '><table><tr><td rowspan=3><img src=' + thumbnailUrl + ' /></td><td><b>' + videoTitle + '</b></td></tr><tr><td>' + videoDescription + '</td></tr><tr><td>Duration: ' + videoLengthString + '</td></tr></table></div>');
        eleList.push(newEntry);
      }
      return eleList;
    };
    vimeo_url_validator = function(url) {
      var c, intRegex, videoIdStr, _i, _len;
      if (url.indexOf('https://vimeo.com/') === 0) {
        videoIdStr = url.substring(18);
        intRegex = /^[0-9]$/;
        for (_i = 0, _len = videoIdStr.length; _i < _len; _i++) {
          c = videoIdStr[_i];
          if (!intRegex.test(c)) {
            return false;
          }
        }
        return videoIdStr;
      }
      return false;
    };
    vimeo_embed_code_generator = function(url) {
      return '<p></p>';
    };
    vimeo_query_generator = function(queryTerms) {
      var terms, url;
      terms = queryTerms.split(' ');
      url = 'http://vimeo.com/api/rest/v2&format=json&method=vimeo.videos.search&oauth_consumer_key=c1f5add1d34817a6775d10b3f6821268&oauth_nonce=da3f0c0437ad303c7cdb11c522abef4f&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1365564937&oauth_token=1bba5c6f35030672b0b4b5c8cf8ed156&oauth_version=1.0&page=0&per_page=50&query=' + terms.join('+') + '&user_id=jmaxg3';
      console.debug(url);
      return url;
    };
    vimeo_search_results_generator = function(responseObj) {
      var eleList;
      eleList = [];
      console.debug(responseObj);
      return [];
    };
    youtube_embedder = new embedder(youtube_url_validator, youtube_embed_code_generator, youtube_query_generator, youtube_search_results_generator);
    vimeo_embedder = new embedder(vimeo_url_validator, vimeo_embed_code_generator, vimeo_query_generator, vimeo_search_results_generator);
    embedders = [];
    embedders[0] = youtube_embedder;
    embedders[1] = vimeo_embedder;
    active_embedder = youtube_embedder;
    active_embedder_value = 'youtube';
    checkURL = function(url) {
      var _i, _len;
      for (_i = 0, _len = embedders.length; _i < _len; _i++) {
        embedder = embedders[_i];
        if (embedder.url_validator(url)) {
          console.debug('Url validated');
          return true;
        }
      }
      return false;
    };
    WARNING_IMAGE_PATH = '/../plugins/oerpub/image/img/warning.png';
    DIALOG_HTML = '<form class="plugin video modal hide fade" id="linkModal" tabindex="-1" role="dialog" aria-labelledby="linkModalLabel" aria-hidden="true" data-backdrop="false">\n  <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n    <h3>Insert video</h3>\n  </div>\n  <div class="modal-body">\n    <div class="image-options">\n        <center><input type="text" style="width:80%;" id="video-url-input" class="upload-url-input" placeholder="Enter URL of video ..."/></center>\n    </div>\n    <center>OR</center>\n    <div class="modal-body" >\n        <center><input type="text" style="width:80%;" id="video-search-input" class-"upload-url-input" placeholder="Enter search terms for your video ..."/></center>\n        <center><table><tr><td><input id=\'media-sites\' type="radio" name="video-site" value="youtube" checked>Youtube</input></td><td><input id=\'media-sites\' type="radio" name="video-site" value="vimeo">Vimeo</input></td></tr></table></center>\n        <center><button type="search" class="btn btn-primary action search">Search</button></center>\n    </div>\n    <div class="modal-body" >\n        <div style="border:1px solid; height:200px; width:100%; overflow-x:auto; overflow-y:scroll;" id="search-results">\n        </div>\n    </div>\n  </div>\n  <div class="modal-footer">\n    <button type="submit" class="btn btn-primary action insert">Insert</button>\n    <button class="btn action cancel">Cancel</button>\n  </div>\n</form>';
    getTimeString = function(timeInSeconds) {
      var ivalue, nHours, nMinutes, nSeconds, str;
      nHours = 0;
      nMinutes = 0;
      nSeconds = 0;
      ivalue = parseInt(timeInSeconds);
      if (ivalue > 3600) {
        nHours = Math.floor(ivalue / 3600);
        ivalue = ivalue - (3600 * nHours);
      }
      if (ivalue > 60) {
        nMinutes = Math.floor(ivalue / 60);
        ivalue = ivalue - (60 * nMinutes);
      }
      nSeconds = ivalue;
      str = '';
      if (nHours > 0) {
        str = str + nHours.toString() + ' hours';
      }
      if (nMinutes > 0) {
        if (str.length !== 0) {
          str = str + ', ';
        }
        str = str + nMinutes.toString() + ' mins';
      }
      if (nSeconds > 0) {
        if (str.length !== 0) {
          str = str + ', ';
        }
        str = str + nSeconds.toString() + ' secs';
      }
      return str;
    };
    showModalDialog = function($el) {
      var $placeholder, $searchResults, $searchTerms, $submit, $uploadUrl, deferred, dialog, imageAltText, loadLocalFile, radio, root, settings, setvideoSource, videoSource, _i, _len, _ref,
        _this = this;
      console.debug('Inside showModalDialog');
      settings = Aloha.require('assorted/assorted-plugin').settings;
      root = Aloha.activeEditable.obj;
      dialog = jQuery(DIALOG_HTML);
      $placeholder = dialog.find('.placeholder.preview');
      $uploadUrl = dialog.find('.upload-url-input');
      $searchTerms = dialog.find('#video-search-input');
      $searchResults = dialog.find('#search-results');
      $submit = dialog.find('.action.insert');
      dialog.find("#video-url-input")[0].onkeyup = function(event) {
        var currentVal, target, valid;
        target = event.currentTarget;
        currentVal = target.value;
        console.debug(currentVal);
        valid = checkURL(currentVal);
        console.debug(valid);
        if (valid) {
          target.style.borderColor = 'green';
          return target.style.borderWidth = 'medium';
        } else {
          target.style.borderColor = 'red';
          return target.style.borderWidth = 'medium';
        }
      };
      _ref = dialog.find('#media-sites');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        radio = _ref[_i];
        radio.onclick = function(event) {
          var index, val, _j, _len1, _ref1, _results;
          console.debug('Radio button clicked');
          val = event.target.value;
          if (active_embedder_value !== val) {
            index = 0;
            _ref1 = dialog.find('#media-sites');
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              radio = _ref1[_j];
              if (radio.value === val) {
                console.debug('Setting ' + radio.value);
                active_embedder_value = radio.value;
                active_embedder = embedders[index];
                break;
              }
              _results.push(index = index + 1);
            }
            return _results;
          }
        };
      }
      if ($el.is('img')) {
        videoSource = $el.attr('src');
        imageAltText = $el.attr('alt');
      } else {
        videoSource = '';
        imageAltText = '';
      }
      dialog.find('[name=alt]').val(imageAltText);
      if (checkURL(videoSource)) {
        $uploadUrl.val(videoSource);
        $uploadUrl.show();
      }
      setvideoSource = function(href) {
        videoSource = href;
        return $submit.removeClass('disabled');
      };
      loadLocalFile = function(file, $img, callback) {
        var reader;
        reader = new FileReader();
        reader.onloadend = function() {
          if ($img) {
            $img.attr('src', reader.result);
          }
          setvideoSource(reader.result);
          if (callback) {
            return callback(reader.result);
          }
        };
        return reader.readAsDataURL(file);
      };
      dialog.find('.upload-image-link').on('click', function(evt) {
        evt.preventDefault();
        $placeholder.hide();
        $uploadUrl.hide();
        return console.debug('Hiding placeholder url');
      });
      dialog.find('.upload-url-link').on('click', function(evt) {
        evt.preventDefault();
        $placeholder.hide();
        return $uploadUrl.show();
      });
      $uploadUrl.on('change', function() {
        var $previewImg, url;
        $previewImg = $placeholder.find('img');
        url = $uploadUrl.val();
        setvideoSource(url);
        console.debug('changing');
        if (settings.image.preview) {
          $previewImg.attr('src', url);
          return $placeholder.show();
        }
      });
      deferred = $.Deferred();
      dialog.on('click', '.btn.btn-primary.action.insert', function(evt) {
        var child, mediaElement, video_id, _j, _len1, _ref1;
        evt.preventDefault();
        if ($el.is('img')) {
          $el.attr('src', videoSource);
          return $el.attr('alt', dialog.find('[name=alt]').val());
        } else {
          if (videoSource.length === 0) {
            _ref1 = $searchResults.children();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              child = _ref1[_j];
              if (child.className === 'search-result-selected') {
                video_id = child.id;
                mediaElement = active_embedder.embed_code_gen(video_id);
                break;
              }
            }
          } else {
            mediaElement = active_embedder.embed_code_gen(active_embedder.url_validator(videoSource));
          }
          AlohaInsertIntoDom(mediaElement);
          return dialog.modal('hide');
        }
      });
      dialog.on('click', '.btn.btn-primary.action.search', function(evt) {
        var queryUrl;
        evt.preventDefault();
        queryUrl = active_embedder.query_generator($searchTerms[0].value);
        $searchResults.empty();
        $searchResults.append(jQuery('<div style="width=100%" >Searching...</div>'));
        return jQuery.get(queryUrl, function(data) {
          var ele, responseObj, searchElements, _j, _len1, _results;
          $searchResults.empty();
          responseObj = jQuery.parseJSON(data);
          searchElements = active_embedder.search_results_generator(responseObj);
          _results = [];
          for (_j = 0, _len1 = searchElements.length; _j < _len1; _j++) {
            ele = searchElements[_j];
            console.debug(ele);
            ele[0].onclick = function(evt) {
              var child, target, targetId, _k, _len2, _ref1, _results1;
              console.debug(evt);
              target = evt.target;
              while (target.tagName !== 'DIV') {
                target = target.parentNode;
              }
              targetId = target.id;
              _ref1 = $searchResults.children();
              _results1 = [];
              for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                child = _ref1[_k];
                if (child.id === targetId) {
                  _results1.push(child.className = 'search-result-selected');
                } else {
                  _results1.push(child.className = 'search-result');
                }
              }
              return _results1;
            };
            _results.push($searchResults.append(ele));
          }
          return _results;
        });
      });
      dialog.on('click', '.btn.action.cancel', function(evt) {
        evt.preventDefault();
        deferred.reject({
          target: $el[0]
        });
        return dialog.modal('hide');
      });
      dialog.on('hidden', function(event) {
        if (deferred.state() === 'pending') {
          deferred.reject({
            target: $el[0]
          });
        }
        return dialog.remove();
      });
      return jQuery.extend(true, deferred.promise(), {
        show: function(title) {
          if (title) {
            dialog.find('.modal-header h3').text(title);
          }
          return dialog.modal('show');
        }
      });
    };
    selector = 'img';
    populator = function($el, pover) {
      var $bubble, editable, href;
      editable = Aloha.activeEditable;
      $bubble = jQuery('<div class="link-popover-details">\n    <a class="change">\n      <img src="' + Aloha.settings.baseUrl + '/../plugins/oerpub/assorted/img/edit-link-03.png" />\n  <span title="Change the image\'s properties">Edit image...</span>\n</a>\n&nbsp; | &nbsp;\n<a class="remove">\n  <img src="' + Aloha.settings.baseUrl + '/../plugins/oerpub/assorted/img/unlink-link-02.png" />\n      <span title="Delete the image">Delete</span>\n    </a>\n</div>');
      href = $el.attr('src');
      $bubble.find('.change').on('click', function() {
        var promise;
        Aloha.activeEditable = editable;
        promise = showModalDialog($el);
        promise.done(function(data) {
          if (data.files.length) {
            jQuery(data.target).addClass('aloha-image-uploading');
            return uploadImage(data.files[0], function(url) {
              return jQuery(data.target).attr('src', url).removeClass('aloha-image-uploading');
            });
          }
        });
        return promise.show('Edit image');
      });
      $bubble.find('.remove').on('click', function() {
        pover.stopOne($el);
        return $el.remove();
      });
      return $bubble.contents();
    };
    uploadImage = function(file, callback) {
      var f, plugin, settings, xhr;
      plugin = this;
      settings = Aloha.require('assorted/assorted-plugin').settings;
      xhr = new XMLHttpRequest();
      if (xhr.upload) {
        if (!settings.image.uploadurl) {
          throw new Error("uploadurl not defined");
        }
        xhr.onload = function() {
          var url;
          if (settings.image.parseresponse) {
            url = parseresponse(xhr);
          } else {
            url = JSON.parse(xhr.response).url;
          }
          return callback(url);
        };
        xhr.open("POST", settings.image.uploadurl, true);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        f = new FormData();
        f.append(settings.image.uploadfield || 'upload', file, file.name);
        return xhr.send(f);
      }
    };
    Aloha.bind('aloha-image-selected', function(event, target) {
      var $el, nodes;
      $el = jQuery(target);
      nodes = jQuery(Aloha.activeEditable.obj).find(selector);
      nodes = nodes.not($el);
      nodes.trigger('hide');
      $el.trigger('show');
      $el.data('aloha-bubble-selected', true);
      return $el.off('.bubble');
    });
    UI.adopt('insertVideo-oer', null, {
      click: function() {
        var newEl, promise;
        console.debug('Inserting video..');
        newEl = jQuery('<span class="aloha-ephemera image-placeholder"> </span>');
        promise = showModalDialog(newEl);
        promise.done(function(data) {
          if (data.files.length) {
            newEl.addClass('aloha-image-uploading');
            return uploadImage(data.files[0], function(url) {
              jQuery(data.target).attr('src', url);
              return newEl.removeClass('aloha-image-uploading');
            });
          }
        });
        promise.fail(function(data) {
          var $target;
          $target = jQuery(data.target);
          if (!$target.is('img')) {
            return $target.remove();
          }
        });
        return promise.show();
      }
    });
    return {
      selector: selector,
      populator: populator
    };
  });

}).call(this);
