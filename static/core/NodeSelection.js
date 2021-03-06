// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var Selection;
    return Selection = (function(_super) {
      __extends(Selection, _super);

      function Selection(options) {
        this.options = options;
        Selection.__super__.constructor.call(this);
      }

      Selection.prototype.init = function(instances) {
        var _this = this;
        _.extend(this, Backbone.Events);
        this.keyListener = instances['KeyListener'];
        this.graphView = instances['GraphView'];
        this.linkFilter = this.graphView.getLinkFilter();
        this.graphModel = instances['GraphModel'];
        this.listenTo(this.keyListener, "down:17:65", this.selectAll);
        this.listenTo(this.keyListener, "down:27", this.deselectAll);
        this.listenTo(this.keyListener, "down:46", this.removeSelection);
        this.listenTo(this.keyListener, "down:13", this.removeSelectionCompliment);
        this.graphView.on("enter:node:click", function(datum) {
          var node, _i, _len, _ref;
          if (__indexOf.call(_this.getSelectedNodes(), datum) >= 0) {
            return _this.toggleSelection(datum);
          } else {
            _ref = _this.getSelectedNodes();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              node = _ref[_i];
              _this.toggleSelection(node);
            }
            return _this.toggleSelection(datum);
          }
        });
        this.graphView.on("enter:node:shift:click", function(datum) {
          return _this.toggleSelection(datum);
        });
        this.graphView.on("enter:node:dblclick", function(datum) {
          return _this.selectConnectedComponent(datum);
        });
        this.graphView.on("enter:link:click", function(datum) {
          var node, _i, _len, _ref, _results;
          _ref = _this.getSelectedNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(_this.toggleSelection(node));
          }
          return _results;
        });
        return this.graphView.on("view:click", function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.getSelectedNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(_this.toggleSelection(node));
          }
          return _results;
        });
      };

      Selection.prototype.renderSelection = function() {
        var nodeSelection;
        nodeSelection = this.graphView.getNodeSelection();
        if (nodeSelection) {
          return nodeSelection.call(function(selection) {
            return selection.classed("selected", function(d) {
              return d.selected;
            });
          });
        }
      };

      Selection.prototype.filterSelection = function(filter) {
        _.each(this.graphModel.getNodes(), function(node) {
          return node.selected = filter(node);
        });
        return this.renderSelection();
      };

      Selection.prototype.selectAll = function() {
        this.filterSelection(function(n) {
          return true;
        });
        return this.trigger("change");
      };

      Selection.prototype.deselectAll = function() {
        this.filterSelection(function(n) {
          return false;
        });
        return this.trigger("change");
      };

      Selection.prototype.selectNode = function(node) {
        node.selected = true;
        this.trigger("change");
        return this.renderSelection();
      };

      Selection.prototype.toggleSelection = function(node) {
        node.selected = !node.selected;
        this.trigger("change");
        return this.renderSelection();
      };

      Selection.prototype.removeSelection = function() {
        return this.graphModel.filterNodes(function(node) {
          return !node.selected;
        });
      };

      Selection.prototype.removeSelectionCompliment = function() {
        return this.graphModel.filterNodes(function(node) {
          return node.selected;
        });
      };

      Selection.prototype.getSelectedNodes = function() {
        return _.filter(this.graphModel.getNodes(), function(node) {
          return node.selected;
        });
      };

      Selection.prototype.selectBoundedNodes = function(dim) {
        var intersect, selectRect;
        selectRect = {
          left: dim.x,
          right: dim.x + dim.width,
          top: dim.y,
          bottom: dim.y + dim.height
        };
        intersect = function(rect1, rect2) {
          return !(rect1.right < rect2.left || rect1.bottom < rect2.top || rect1.left > rect2.right || rect1.top > rect2.bottom);
        };
        this.graphView.getNodeSelection().each(function(datum, i) {
          var bcr;
          bcr = this.getBoundingClientRect();
          return datum.selected = intersect(selectRect, bcr);
        });
        this.trigger('change');
        return this.renderSelection();
      };

      Selection.prototype.selectConnectedComponent = function(node) {
        var allTrue, graph, lookup, newSelected, seen, visit,
          _this = this;
        this.nodeHash = this.graphModel.get("nodeHash");
        visit = function(id) {
          if (!_.has(seen, id)) {
            seen[id] = 1;
            return _.each(graph[id], function(ignore, neighborID) {
              return visit(neighborID);
            });
          }
        };
        graph = {};
        lookup = {};
        _.each(this.graphModel.getNodes(), function(node) {
          graph[_this.nodeHash(node)] = {};
          return lookup[_this.nodeHash(node)] = node;
        });
        _.each(this.linkFilter.filter(this.graphModel.getLinks()), function(link) {
          graph[_this.nodeHash(link.source)][_this.nodeHash(link.target)] = 1;
          return graph[_this.nodeHash(link.target)][_this.nodeHash(link.source)] = 1;
        });
        seen = {};
        visit(this.nodeHash(node));
        allTrue = true;
        _.each(seen, function(ignore, id) {
          return allTrue = allTrue && lookup[id].selected;
        });
        newSelected = !allTrue;
        _.each(seen, function(ignore, id) {
          return lookup[id].selected = newSelected;
        });
        this.trigger("change");
        return this.renderSelection();
      };

      return Selection;

    })(Backbone.View);
  });

}).call(this);
