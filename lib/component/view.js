define(function(require, exports, module) {
  "use strict";

  var Component = require("../component");

  var ViewComponent = Component.extend({
    selector: "webapp-view"
  });

  module.exports = ViewComponent;
});
