// Generated by CoffeeScript 1.6.3
(function() {
  define([], function() {
    var ForceSliders;
    return ForceSliders = (function() {
      function ForceSliders() {}

      ForceSliders.prototype.init = function(instances) {
        var force, scale;
        scale = d3.scale.linear().domain([-20, -2000]).range([0, 100]);
        force = instances["GraphView"].getForceLayout();
        return instances["Sliders"].addSlider("Spacing", scale(force.charge()), function(val) {
          force.charge(scale.invert(val));
          return force.start();
        });
      };

      return ForceSliders;

    })();
  });

}).call(this);
