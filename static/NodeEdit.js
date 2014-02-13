// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var NodeEdit;
    return NodeEdit = (function(_super) {
      __extends(NodeEdit, _super);

      function NodeEdit(options) {
        this.options = options;
        this.assign_properties = __bind(this.assign_properties, this);
        this.addField = __bind(this.addField, this);
        this.deleteNode = __bind(this.deleteNode, this);
        this.cancelEditing = __bind(this.cancelEditing, this);
        NodeEdit.__super__.constructor.call(this);
      }

      NodeEdit.prototype.init = function(instances) {
        var _this = this;
        this.dataController = instances['local/Neo4jDataController'];
        this.graphModel = instances['GraphModel'];
        this.graphModel.on("change", this.update.bind(this));
        this.selection = instances["NodeSelection"];
        this.selection.on("change", this.update.bind(this));
        this.listenTo(instances["KeyListener"], "down:80", function() {
          return _this.$el.toggle();
        });
        $(this.el).appendTo($('#omniBox'));
        return this.Create = instances['local/Create'];
      };

      NodeEdit.prototype.update = function() {
        var $container, blacklist, selectedNodes,
          _this = this;
        this.$el.empty();
        selectedNodes = this.selection.getSelectedNodes();
        $container = $("<div class=\"node-profile-helper\"/>").appendTo(this.$el);
        blacklist = ["index", "x", "y", "px", "py", "fixed", "selected", "weight"];
        return _.each(selectedNodes, function(node) {
          var $nodeDiv, $nodeEdit, header;
          $nodeDiv = $("<div class=\"node-profile\"/>").appendTo($container);
          header = _this.findHeader(node);
          $("<div class=\"node-profile-title\">" + header + "</div>").appendTo($nodeDiv);
          _.each(node, function(value, property) {
            var makeLinks;
            value += "";
            if (blacklist.indexOf(property) < 0) {
              if (value != null) {
                makeLinks = value.replace(/((https?|ftp|dict):[^'">\s]+)/gi, "<a href=\"$1\" target=\"_blank\" style=\"target-new: tab;\">$1</a>");
              } else {
                makeLinks = value;
              }
              if (property === "_Last_Edit_Date" || property === "_Creation_Date") {
                return $("<div class=\"node-profile-property\">" + property + ":  " + (makeLinks.substring(4, 21)) + "</div>").appendTo($nodeDiv);
              } else if (property !== "color") {
                return $("<div class=\"node-profile-property\">" + property + ":  " + makeLinks + "</div>").appendTo($nodeDiv);
              }
            }
          });
          $nodeEdit = $("<input id=\"NodeEditButton" + node['_id'] + "\" class=\"NodeEditButton\" type=\"button\" value=\"Edit this node\">").appendTo($nodeDiv);
          return $nodeEdit.click(function() {
            return _this.editNode(node, $nodeDiv, blacklist);
          });
        });
      };

      NodeEdit.prototype.editNode = function(node, nodeDiv, blacklist) {
        var $nodeCancel, $nodeDelete, $nodeMoreFields, $nodeSave, colorEditingField, colors, header, hexColors, nodeInputNumber, origColor,
          _this = this;
        console.log("Editing node: " + node['_id']);
        nodeInputNumber = 0;
        origColor = "#A9A9A9";
        colors = ["darkgray", "aqua", "black", "blue", "darkblue", "fuchsia", "green", "darkgreen", "lime", "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal", "yellow"];
        hexColors = ["#A9A9A9", "#00FFFF", "#000000", "#0000FF", "#00008B", "#FF00FF", "#008000", "#006400", "#00FF00", "#800000", "#000080", "#808000", "#FFA500", "#800080", "#FF0000", "#C0C0C0", "#008080", "#FFFF00"];
        header = this.findHeader(node);
        nodeDiv.html("<div class=\"node-profile-title\">Editing " + header + " (id: " + node['_id'] + ")</div><form id=\"Node" + node['_id'] + "EditForm\"></form>");
        _.each(node, function(value, property) {
          var newEditingFields;
          if (blacklist.indexOf(property) < 0 && ["_id", "text", "color", "_Last_Edit_Date", "_Creation_Date"].indexOf(property) < 0) {
            newEditingFields = "<div id=\"Node" + node['_id'] + "EditDiv" + nodeInputNumber + "\" class=\"Node" + node['_id'] + "EditDiv\">\n  <input style=\"width:80px\" id=\"Node" + node['_id'] + "EditProperty" + nodeInputNumber + "\" value=\"" + property + "\" class=\"propertyNode" + node['_id'] + "Edit\"/> \n  <input style=\"width:80px\" id=\"Node" + node['_id'] + "EditValue" + nodeInputNumber + "\" value=\"" + value + "\" class=\"valueNode" + node['_id'] + "Edit\"/> \n  <input type=\"button\" id=\"removeNode" + node['_id'] + "Edit" + nodeInputNumber + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\">\n</div>";
            $(newEditingFields).appendTo("#Node" + node['_id'] + "EditForm");
            return nodeInputNumber = nodeInputNumber + 1;
          } else if (property === "color") {
            if (__indexOf.call(colors, value) >= 0) {
              return origColor = hexColors[colors.indexOf(value)];
            } else if (__indexOf.call(hexColors, origColor) >= 0) {
              return origColor = value;
            }
          }
        });
        colorEditingField = '\
            <form action="#" method="post">\
                <div class="controlset">Color<input id="color' + node['_id'] + '" name="color' + node['_id'] + '" type="text" value="' + origColor + '"/></div>\
            </form>\
          ';
        $(colorEditingField).appendTo(nodeDiv);
        $("#color" + node['_id']).colorPicker({
          showHexField: false
        });
        $nodeMoreFields = $("<input id=\"moreNode" + node['_id'] + "EditFields\" type=\"button\" value=\"+\">").appendTo(nodeDiv);
        $nodeMoreFields.click(function() {
          _this.addField(nodeInputNumber, "Node" + node['_id'] + "Edit");
          return nodeInputNumber = nodeInputNumber + 1;
        });
        $nodeSave = $("<input name=\"nodeSaveButton\" type=\"button\" value=\"Save\">").appendTo(nodeDiv);
        $nodeSave.click(function() {
          var newNode, newNodeObj;
          newNodeObj = _this.assign_properties("Node" + node['_id'] + "Edit");
          if (newNodeObj[0]) {
            newNode = newNodeObj[1];
            newNode['color'] = $("#color" + node['_id']).val();
            newNode['_id'] = node['_id'];
            newNode['_Creation_Date'] = node['_Creation_Date'];
            return _this.dataController.nodeEdit(node, newNode, function(savedNode) {
              _this.graphModel.filterNodes(function(node) {
                return !(savedNode['_id'] === node['_id']);
              });
              _this.graphModel.putNode(savedNode);
              _this.selection.toggleSelection(savedNode);
              return _this.cancelEditing(savedNode, nodeDiv, blacklist);
            });
          }
        });
        $nodeDelete = $("<input name=\"NodeDeleteButton\" type=\"button\" value=\"Delete\">").appendTo(nodeDiv);
        $nodeDelete.click(function() {
          if (confirm("Are you sure you want to delete this node?")) {
            return _this.deleteNode(node, function() {
              return _this.selection.toggleSelection(node);
            });
          }
        });
        $nodeCancel = $("<input name=\"NodeCancelButton\" type=\"button\" value=\"Cancel\">").appendTo(nodeDiv);
        return $nodeCancel.click(function() {
          return _this.cancelEditing(node, nodeDiv, blacklist);
        });
      };

      NodeEdit.prototype.cancelEditing = function(node, nodeDiv, blacklist) {
        var $nodeEdit,
          _this = this;
        nodeDiv.html("<div class=\"node-profile-title\">" + (this.findHeader(node)) + "</div>");
        _.each(node, function(value, property) {
          if (blacklist.indexOf(property) < 0) {
            if (property === "_Last_Edit_Date" || property === "_Creation_Date") {
              return $("<div class=\"node-profile-property\">" + property + ":  " + (value.substring(4, 21)) + "</div>").appendTo(nodeDiv);
            } else if (property !== "color") {
              return $("<div class=\"node-profile-property\">" + property + ":  " + value + "</div>").appendTo(nodeDiv);
            }
          }
        });
        $nodeEdit = $("<input id=\"NodeEditButton" + node['_id'] + "\" class=\"NodeEditButton\" type=\"button\" value=\"Edit this node\">").appendTo(nodeDiv);
        return $nodeEdit.click(function() {
          return _this.editNode(node, nodeDiv, blacklist);
        });
      };

      NodeEdit.prototype.deleteNode = function(delNode, callback) {
        var _this = this;
        return this.dataController.nodeDelete(delNode, function(response) {
          if (response === "error") {
            if (confirm("Could not delete node. There might be links remaining on this node. Do you want to delete the node (and all links to it) anyway?")) {
              return _this.dataController.nodeDeleteFull(delNode, function(responseFull) {
                console.log("Node Deleted");
                _this.graphModel.filterNodes(function(node) {
                  return !(delNode['_id'] === node['_id']);
                });
                return callback();
              });
            }
          } else {
            console.log("Node Deleted");
            _this.graphModel.filterNodes(function(node) {
              return !(delNode['_id'] === node['_id']);
            });
            return callback();
          }
        });
      };

      NodeEdit.prototype.addField = function(inputIndex, name, defaultKey, defaultValue) {
        var $row;
        if (!(defaultKey != null)) {
          defaultKey = "propertyEx";
        }
        if (!(defaultValue != null)) {
          defaultValue = "valueEx";
        }
        $row = $("<div id=\"" + name + "Div" + inputIndex + "\" class=\"" + name + "Div\">\n<input style=\"width:80px\" name=\"property" + name + inputIndex + "\" placeholder=\"" + defaultKey + "\" class=\"property" + name + "\">\n<input style=\"width:80px\" name=\"value" + name + inputIndex + "\" placeholder=\"" + defaultValue + "\" class=\"value" + name + "\">\n<input type=\"button\" id=\"remove" + name + inputIndex + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\">\n</div>");
        return $("#" + name + "Form").append($row);
      };

      NodeEdit.prototype.assign_properties = function(form_name, is_illegal) {
        var editDate, propertyObject, submitOK;
        if (is_illegal == null) {
          is_illegal = this.dataController.is_illegal;
        }
        submitOK = true;
        propertyObject = {};
        editDate = new Date();
        propertyObject["_Last_Edit_Date"] = editDate;
        $("." + form_name + "Div").each(function(i, obj) {
          var property, value;
          property = $(this).children(".property" + form_name).val();
          value = $(this).children(".value" + form_name).val();
          if (is_illegal(property, "Property")) {
            return submitOK = false;
          } else if (property in propertyObject) {
            alert("Property '" + property + "' already assigned.\nFirst value: " + propertyObject[property] + "\nSecond value: " + value);
            return submitOK = false;
          } else {
            return propertyObject[property] = value.replace(/'/g, "\\'");
          }
        });
        return [submitOK, propertyObject];
      };

      NodeEdit.prototype.findHeader = function(node) {
        if (node.name != null) {
          return node.name;
        } else if (node.title != null) {
          return node.title;
        } else {
          return '';
        }
      };

      return NodeEdit;

    })(Backbone.View);
  });

}).call(this);
