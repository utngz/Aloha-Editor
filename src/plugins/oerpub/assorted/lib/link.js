// Generated by CoffeeScript 1.3.3
(function() {

  define(['aloha', 'jquery', 'popover', 'ui/ui', 'aloha/console', 'css!assorted/css/link.css'], function(Aloha, jQuery, Popover, UI, console) {
    var DIALOG_HTML, populator, selector, showModalDialog, unlink;
    DIALOG_HTML = '<form class="modal" id="linkModal" tabindex="-1" role="dialog" aria-labelledby="linkModalLabel" aria-hidden="true">\n  <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>\n    <h3 id="linkModalLabel">Edit link</h3>\n  </div>\n  <div class="modal-body">\n    <div id="link-text">\n      <h4>Text to display</h4>\n      <div>\n        <input id="link-contents" class="input-xlarge" type="text" placeholder="Enter a phrase here" required />\n      </div>\n    </div>\n    <h4 id="link-destination">Link Destination</h4>\n    <div class="tabbable tabs-left"> <!-- Only required for left/right tabs -->\n      <ul class="nav nav-tabs">\n        <li><a href="#link-tab-external" data-toggle="tab">External</a></li>\n        <li><a href="#link-tab-internal" data-toggle="tab">Internal</a></li>\n      </ul>\n      <div class="tab-content">\n        <div class="tab-pane" id="link-tab-external">\n          <h4 for="link-external">Link to webpage</h4>\n          <input class="link-input link-external" id="link-external" type="url" placeholder="http://"/>\n        </div>\n        <div class="tab-pane" id="link-tab-internal">\n          <label for="link-internal">Link to a part in this document</label>\n          <select class="link-input link-internal" id="link-internal" size="5" multiple="multiple"></select>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="modal-footer">\n    <button class="btn btn-primary link-save">Submit</button>\n    <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>\n  </div>\n</form>';
    showModalDialog = function($el) {
      var appendOption, dialog, figuresAndTables, href, linkContents, linkExternal, linkInput, linkInputId, linkInternal, linkSave, orgElements, root,
        _this = this;
      root = Aloha.activeEditable.obj;
      dialog = jQuery(DIALOG_HTML);
      if (!$el.children()[0]) {
        linkContents = dialog.find('#link-contents');
        linkContents.val($el.text());
      }
      linkExternal = dialog.find('.link-external');
      linkInternal = dialog.find('.link-internal');
      linkSave = dialog.find('.link-save');
      linkInput = dialog.find('.link-input');
      appendOption = function(id, contentsToClone) {
        var clone, contents, option;
        clone = contentsToClone[0].cloneNode(true);
        contents = jQuery(clone).contents();
        option = jQuery('<option></option>');
        option.attr('value', '#' + id);
        option.append(contents);
        return option.appendTo(linkInternal);
      };
      orgElements = root.find('h1,h2,h3,h4,h5,h6');
      figuresAndTables = root.find('figure,table');
      orgElements.filter(':not([id])').each(function() {
        return jQuery(this).attr('id', GENTICS.Utils.guid());
      });
      orgElements.each(function() {
        var id, item;
        item = jQuery(this);
        id = item.attr('id');
        return appendOption(id, item);
      });
      figuresAndTables.each(function() {
        var caption, id, item;
        item = jQuery(this);
        id = item.attr('id');
        caption = item.find('caption,figcaption');
        if (caption[0]) {
          return appendOption(id, caption);
        }
      });
      dialog.find('a[data-toggle=tab]').on('shown', function(evt) {
        var newTab, prevTab;
        prevTab = jQuery(jQuery(evt.relatedTarget).attr('href'));
        newTab = jQuery(jQuery(evt.target).attr('href'));
        prevTab.find('.link-input').removeAttr('required');
        return newTab.find('.link-input').attr('required', true);
      });
      href = $el.attr('href');
      dialog.find('.active').removeClass('active');
      linkInputId = '#link-tab-external';
      if ($el.attr('href').match(/^#/)) {
        linkInputId = '#link-tab-internal';
      }
      dialog.find(linkInputId).addClass('active').find('.link-input').attr('required', true).val(href);
      dialog.find("a[href=" + linkInputId + "]").parent().addClass('active');
      dialog.on('submit', function(evt) {
        var active;
        evt.preventDefault();
        if (linkContents.val() && linkContents.val().trim()) {
          $el.contents().remove();
          $el.append(linkContents.val());
        }
        active = dialog.find('.link-input[required]');
        href = active.val();
        $el.attr('href', href);
        return dialog.modal('hide');
      });
      dialog.modal('show');
      dialog.on('hidden', function() {
        return dialog.remove();
      });
      return dialog;
    };
    unlink = function($a) {
      var a, newRange, preserveContents;
      a = $a.get(0);
      $a.removeData('aloha-bubble-openTimer', 0);
      $a.removeData('aloha-bubble-closeTimer', 0);
      $a.removeData('aloha-bubble-selected', false);
      $a.popover('destroy');
      newRange = new GENTICS.Utils.RangeObject();
      newRange.startContainer = newRange.endContainer = a.parentNode;
      newRange.startOffset = GENTICS.Utils.Dom.getIndexInParent(a);
      newRange.endOffset = newRange.startOffset + 1;
      newRange.select();
      preserveContents = true;
      GENTICS.Utils.Dom.removeFromDOM(a, newRange, preserveContents);
      newRange.startContainer = newRange.endContainer;
      newRange.startOffset = newRange.endOffset;
      newRange.select();
      return newRange;
    };
    selector = 'a';
    populator = function($el) {
      var $bubble, $edit, $remove, baseUrl, details, editable, href;
      editable = Aloha.activeEditable;
      $bubble = jQuery('<div class="link-popover"></div>');
      href = $el.attr('href');
      baseUrl = Aloha.settings.baseUrl;
      details = jQuery('<div class="link-popover-details">\n  <a class="edit-link" >\n    <img src="' + baseUrl + '/../plugins/cnx/assorted/img/pencil_cnx.png" />\n  <span title="Edit link">Edit link ...</span>\n</a>\n&nbsp; | &nbsp;\n<a class="delete-link">\n  <img src="' + baseUrl + '/../plugins/cnx/assorted/img/delete_icon.png" />\n  <span title="Unlink (remove the link, leaving just the text)">Unlink</span>\n</a>\n&nbsp; | &nbsp;\n<span  class="visit-link">\n  <img src="' + baseUrl + '/../plugins/cnx/assorted/img/external-link-02.png" />\n<a href="' + href + '">' + href + '</a>\n  </span>\n</div>\n<br/>');
      $bubble.append(details);
      $edit = details.find('.edit-link');
      $edit.on('click', function() {
        var dialog;
        Aloha.activeEditable = editable;
        return dialog = showModalDialog($el);
      });
      $remove = details.find('.delete-link');
      $remove.on('click', function() {
        Aloha.activeEditable = editable;
        return unlink($el);
      });
      return $bubble.contents();
    };
    UI.adopt('insertLink', null, {
      click: function() {
        var dialog, newLink,
          _this = this;
        newLink = jQuery('<a href="" class="aloha-new-link"></a>');
        dialog = showModalDialog(newLink);
        return dialog.on('hidden', function() {
          var range;
          if (!newLink.attr('href')) {
            return;
          }
          range = Aloha.Selection.getRangeObject();
          if (range.isCollapsed()) {
            GENTICS.Utils.Dom.extendToWord(range);
          }
          if (range.isCollapsed()) {
            GENTICS.Utils.Dom.insertIntoDOM(newLink, range, Aloha.activeEditable.obj);
            range.startContainer = range.endContainer = newLink.contents()[0];
            range.startOffset = 0;
            range.endOffset = newLink.text().length;
          } else {
            GENTICS.Utils.Dom.addMarkup(range, newLink, false);
          }
          newLink = Aloha.activeEditable.obj.find('.aloha-new-link');
          return newLink.removeClass('aloha-new-link');
        });
      }
    });
    return {
      selector: selector,
      populator: populator
    };
  });

}).call(this);
