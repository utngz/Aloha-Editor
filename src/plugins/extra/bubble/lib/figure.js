// Generated by CoffeeScript 1.3.3
(function() {

  define(['aloha', 'jquery', 'aloha/console'], function(Aloha, jQuery, console) {
    var filter, populator, selector;
    selector = 'figure';
    filter = function() {
      return this.nodeName.toLowerCase() === 'figure' || jQuery(this).parents('figure')[0];
    };
    populator = function($bubble) {
      var $button, $el, separator;
      $el = this;
      $bubble = jQuery('<div class="figure-popover btn-group"></div>');
      if (!$el.children('.title:not(.empty)')[0]) {
        $button = jQuery('<button class="btn">Add Title</button>');
        $button.on('mousedown', function() {
          var newTitle;
          newTitle = jQuery('<div class="title aloha-optional aloha-empty">Insert Title Here</div>');
          return $el.prepend(newTitle);
        });
        $bubble.append($button);
      }
      separator = jQuery('<span class="divider"></span>');
      $bubble.append(separator);
      if (!$el.children('figcaption:not(.empty)')[0]) {
        $button = jQuery('<button class="btn">Add Caption</button>');
        $button.on('mousedown', function() {
          var newCaption;
          newCaption = jQuery('<figcaption class="aloha-optional aloha-empty">Insert Caption Here</figcaption>');
          return $el.append(newCaption);
        });
        $bubble.append($button);
      }
      $bubble.append('<button class="btn"><i class="icon-certificate"></i> Advanced Options</button>');
      return $bubble;
    };
    return {
      selector: selector,
      populator: populator,
      filter: filter
    };
  });

}).call(this);