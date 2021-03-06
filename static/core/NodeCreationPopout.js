// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var NodeCreationPopout;
    return NodeCreationPopout = (function(_super) {
      __extends(NodeCreationPopout, _super);

      function NodeCreationPopout(options) {
        this.options = options;
        NodeCreationPopout.__super__.constructor.call(this);
      }

      NodeCreationPopout.prototype.init = function(instances) {
        var _this = this;
        this.topBarCreate = instances["local/TopBarCreate"];
        this.listenTo(instances["local/TopBarCreate"], "popout:open", function() {
          return _this.popout();
        });
        this.$el.appendTo($('#maingraph'));
        this.$blur = $('<div id="blur"><div>').appendTo(this.$el);
        this.createPopout();
        return this.$el.hide();
      };

      NodeCreationPopout.prototype.createPopout = function() {
        var $nodeCreateButton, $nodeInputDesc, $nodeInputName, $nodeInputUrl, $nodeTitle,
          _this = this;
        this.$el.attr('class', 'modal-container');
        this.$modal = $('<div></div>').appendTo(this.$el);
        this.$modal.attr({
          id: 'create-node-popout',
          "class": 'modal'
        });
        this.$formWrapper = $('<div class="form">').appendTo(this.$modal);
        $nodeTitle = $('<h1 class="modal-title">Create a Node!</h1>').appendTo(this.$formWrapper);
        $nodeInputName = $('<input id="popout-node-input-name" placeholder=\"Node Name [optional]\" type="name" class="form-control" /><br />').appendTo(this.$formWrapper);
        $nodeInputUrl = $('<input placeholder="Url [optional]" class="form-control"><br>').appendTo(this.$formWrapper);
        $nodeInputDesc = $('<textarea placeholder="Description #key1 value1 #key2 value2" rows="20" class="form-control"></textarea><br>').appendTo(this.$formWrapper);
        $nodeCreateButton = $('<input type="submit" value="Create Node" />').appendTo(this.$formWrapper);
        $nodeCreateButton.click(function() {
          var contentString;
          contentString = $nodeInputName.val() + " : " + $nodeInputDesc.val() + " #url " + $nodeInputUrl.val();
          _this.createnode(contentString);
          return _this.popdown();
        });
        return this.$blur.click(function() {
          return _this.popdown();
        });
      };

      NodeCreationPopout.prototype.popout = function() {
        this.$el.fadeIn();
        return $('#popout-node-input-name').focus();
      };

      NodeCreationPopout.prototype.popdown = function() {
        return this.$el.fadeOut();
      };

      NodeCreationPopout.prototype.createnode = function(content) {
        return this.topBarCreate.buildNode(this.topBarCreate.parseSyntax(content));
      };

      return NodeCreationPopout;

    })(Backbone.View);
  });

}).call(this);
