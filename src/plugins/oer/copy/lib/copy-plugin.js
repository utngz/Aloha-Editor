// Generated by CoffeeScript 1.6.3
(function() {
  define(['aloha', 'aloha/plugin', 'jquery', 'ui/ui', 'ui/button', 'PubSub', './path', 'css!copy/css/copy.css'], function(Aloha, Plugin, jQuery, UI, Button, PubSub, Path) {
    var buffer, srcpath;
    buffer = '';
    srcpath = null;
    return Plugin.create('copy', {
      getCurrentPath: function() {
        if (this.settings.path) {
          return this.settings.path();
        }
        return null;
      },
      getBuffer: function() {
        if (localStorage) {
          return localStorage.alohaOerCopyBuffer;
        } else {
          return buffer;
        }
      },
      getSrcPath: function() {
        if (localStorage) {
          return localStorage.alohaOerCopySrcPath;
        } else {
          return srcpath;
        }
      },
      buffer: function(content, path) {
        buffer = content;
        buffer = buffer.replace(/id="[^"]+"/, '');
        srcpath = path;
        if (localStorage) {
          localStorage.alohaOerCopyBuffer = buffer;
        }
        if (localStorage) {
          localStorage.alohaOerCopySrcPath = srcpath;
        }
        return jQuery('.action.paste').fadeIn('fast');
      },
      copySection: function($el) {
        var e, html, path, selector, _i, _len;
        selector = "h1,h2,h3".substr(0, "h1,h2,h3".indexOf($el[0].nodeName.toLowerCase()) + 2);
        if ($el.addBack) {
          $el = $el.nextUntil(selector).addBack();
        } else {
          $el = $el.nextUntil(selector).andSelf();
        }
        html = '';
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          e = $el[_i];
          html += jQuery(e).outerHtml();
        }
        path = this.getCurrentPath();
        if (path !== null) {
          return this.buffer(html, path);
        } else {
          return this.buffer(html);
        }
      },
      init: function() {
        var addCopyUi, focusHeading, plugin,
          _this = this;
        plugin = this;
        jQuery('body').on('enable-action', '.action.paste,.action.copy', function(e) {
          e.preventDefault();
          return jQuery(this).fadeIn('fast');
        }).on('disable-action', '.action.paste,.action.copy', function(e) {
          e.preventDefault();
          return jQuery(this).fadeOut('fast');
        });
        focusHeading = null;
        PubSub.sub('aloha.selection.context-change', function(m) {
          if (m.range.startOffset === m.range.endOffset && jQuery(m.range.startContainer).parents('h1,h2,h3').length) {
            focusHeading = jQuery(m.range.startContainer).parents('h1,h2,h3').first();
            return _this.copybutton.enable();
          } else {
            return _this.copybutton.disable();
          }
        });
        this.pastebutton = UI.adopt('paste', Button, {
          tooltip: 'Paste',
          click: function(e) {
            var $elements, dstpath, range;
            e.preventDefault();
            range = Aloha.Selection.getRangeObject();
            $elements = jQuery(plugin.getBuffer());
            dstpath = plugin.getCurrentPath();
            if (dstpath !== null) {
              dstpath = Path.dirname(dstpath);
              srcpath = Path.dirname(plugin.getSrcPath());
              if (srcpath !== dstpath) {
                console.log("Rewriting images, src=" + srcpath + ", dst=" + dstpath);
                $elements.find('img').each(function(idx, ob) {
                  var imgpath, newuri, uri;
                  imgpath = jQuery(ob).attr('data-src');
                  if (!Path.isabs(imgpath)) {
                    uri = Path.normpath(srcpath + '/' + imgpath);
                    newuri = Path.relpath(uri, dstpath);
                    console.log("Rewriting " + imgpath);
                    console.log("Absolute location is " + uri);
                    console.log("Rewritten relative to " + dstpath + " = " + newuri);
                    return jQuery(ob).attr('data-src', newuri);
                  } else {
                    return console.log("Image path already absolute: " + imgpath);
                  }
                });
              }
            }
            return GENTICS.Utils.Dom.insertIntoDOM($elements, range, Aloha.activeEditable.obj);
          }
        });
        this.copybutton = UI.adopt("copy", Button, {
          click: function(e) {
            e.preventDefault();
            return plugin.copySection(focusHeading);
          }
        });
        addCopyUi = function($ob) {
          $ob = $ob.filter(function() {
            return !jQuery(this).has('.copy-section-controls').length;
          });
          return $ob.append('<div class="aloha-ephemera copy-section-controls"\n     contenteditable="false">\n  <span href="#" title="Copy section" class="copy-section"><i class="icon-copy"></i> Copy section</span>\n</div>');
        };
        return Aloha.bind('aloha-editable-created', function(evt, editable) {
          if (localStorage && localStorage.alohaOerCopyBuffer) {
            _this.pastebutton.enable();
          } else {
            _this.pastebutton.disable();
          }
          addCopyUi(editable.obj.find('h1,h2,h3'));
          editable.obj.on('change-heading', function(e) {
            return addCopyUi(jQuery(e.target));
          });
          return editable.obj.on('click', '.copy-section-controls .copy-section', function(e) {
            return plugin.copySection(jQuery(e.target).parent().parent());
          });
        });
      }
    });
  });

}).call(this);
