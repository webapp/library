define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("lodash");

  var Component = require("../component");

  module.exports = Component.extend({
    tagName: "webapp-view"
  });
});
