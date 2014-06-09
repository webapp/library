define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var Class = require("class");
  var View = require("view");

  var testUtil = {
    trim: function(str) {
      return str.replace(/^\s+|\s+$/g, "");
    },
    templates: {
      main: "<div class='left'>Left</div><div class='right'></div>",
      test: "<span class='inner-left'><%=text%></span><span class" +
        "='inner-right'></span>",
      testSub: "<%=text%>",
      list: "<ul></ul>",
      item: "<li><%=text%></li>",
      view0: "<div class='view0'>0</div>",
      view1: "<div class='view1'>1</div>",
      view2: "<div class='view2'>2</div>",
      view3: "<div class='view3'>3</div>",
      listItem: "<div class='listItem'><%= item %></div>"
    }
  };

  // If this code is running as a Node.js module, attach the utilities to the
  // module.
  exports.testUtil = testUtil;

  describe("View", function() {
    it("is a constructor", function() {
      assert.equal(typeof View, "function");
    });

    it("has Class in the prototype chain", function() {
      assert.equal(View.__proto__, Class);
    });

    describe("with no configuration", function() {
      var view;

      beforeEach(function() {
        view = new View();
      });

      afterEach(function() {
        view.remove();
      });

      it("has predefined defaults", function() {
        assert.equal(view.prefix, "");
        assert.equal(view.tagName, "div");
        assert.equal(view.useFragment, true);
        assert.equal(typeof view.deferred, "function");
        assert.equal(typeof view.fetchTemplate, "function");
        assert.equal(typeof view.renderTemplate, "function");
        assert.equal(typeof view.partial, "function");
        assert.equal(typeof view.html, "function");
        assert.equal(typeof view.insert, "function");
        assert.equal(typeof view.when, "function");
      });
    });

    describe("when configured globally", function() {
      var view;

      beforeEach(function() {
        View.configure({ prefix: "/templates/" });
        view = new View();
      });

      afterEach(function() {
        delete View.prototype.prefix;
        view.remove();
      });

      it("will configure options on a global and local level", function() {
        assert.equal(view.prefix, "/templates/");
        assert.equal(View.prototype.prefix, "/templates/");
      });
    });

    describe("when overwritten at invocation", function() {
      var view;

      beforeEach(function() {
        view = new View({ prefix: "/templates/raw/" });
      });

      afterEach(function() {
        view.remove();
      });

      it("will configure the options object", function() {
        assert.equal(view.prefix, "/templates/raw/");
      });

      it("will not configure the global View", function() {
        assert.notEqual(View.prototype.prefix, "/templates/");
      });
    });

    describe("when render is overwritten", function() {
      var hit;
      var layout;

      beforeEach(function() {
        hit = false;

        layout = new View({
          template: _.template(testUtil.templates.main),
          fetch: _.identity,

          render: function() {
            hit = true;
          }
        });
      });

      it("will trigger the correct override", function() {
        layout.render();
        assert.equal(hit, true);
      });
    });

    describe("when render is overwritten", function() {
      var hit;
      var TestView;

      beforeEach(function() {
        hit = false;

        TestView = View.extend({
          // A template is required to hit fetch.
          template: "a",

          fetchTemplate: function() {
            hit = "extend";
          }
        });
      });

      it("will trigger the provided fetch", function() {
        new TestView().render();
        assert.equal(hit, "extend");
      });

      it("will trigger the fetch provided during create", function() {
        new TestView().render();
        assert(hit, "Fetch gets called on a View.");
      });
    });

    describe("when a custom template function is provided", function() {
      var TestView;

      beforeEach(function() {
        TestView = View.extend({
          template: function(contents) {
            return contents;
          },

          scope: "hi"
        });
      });

      it("will render the correct text", function() {
        var testView = new TestView().render();
        assert.equal(testUtil.trim(testView.$el.text()), "hi");
      });
    });

    describe("when a custom template function is provided", function() {
      var TestView;
      var layout;

      beforeEach(function() {
        TestView = View.extend({
          template: "template-one",
          lol: "test"
        });

        layout = new View();
        layout.setView(new TestView({ template: "template-two", lol: "hi" }));
      });

      it("will override special properties correctly", function() {
        assert.equal(layout.getView("").template, "template-two");
      });

      it("will override arbitrary properties", function() {
        assert.equal(layout.getView("").lol, "hi");
      });
    });
  });
});
