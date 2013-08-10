define(function(require, exports, module) {

  var _ = require("lodash");
  var Class = require("webapp/class");

  var testUtil = {
    trim: function(str) {
      return str ? str.replace(/^\s+|\s+$/g, "") : "";
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
    },
    inNodeJs: function() {
      return typeof module !== "undefined" && module.exports;
    },
    // isDomNode
    // Determine if the supplied object is a DOM node (in Node.js, DOM nodes are
    // simulated by Cheerio objects)
    isDomNode: function(obj) {
      if (testUtil.inNodeJs()) {
        return obj && "type" in obj && "children" in obj && "parent" in obj;
      } else {
        return obj && obj.nodeType != null;
      }
    }
  };

  // If this code is running as a Node.js module, attach the utilities to the
  // module.
  if (testUtil.inNodeJs()) {
    exports.testUtil = testUtil;
  }

  describe("View", function() {
    var View = require("webapp/view");

    it("is a constructor", function() {
      expect(View).to.be.a("function");
    });

    it("has Class in the prototype chain", function() {
      expect(Class.isPrototypeOf(View)).to.equal(true);
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
        expect(view.prefix).to.equal("");
        expect(view.tagName).to.equal("div");
        expect(view.useFragment).to.equal(true);
        expect(view.deferred).to.be.a("function");
        expect(view.fetchTemplate).to.be.a("function");
        expect(view.renderTemplate).to.be.a("function");
        expect(view.partial).to.be.a("function");
        expect(view.html).to.be.a("function");
        expect(view.insert).to.be.a("function");
        expect(view.when).to.be.a("function");
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
        expect(view.prefix).to.equal("/templates/");
        expect(View.prototype.prefix).to.equal("/templates/");
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
        expect(view.prefix).to.equal("/templates/raw/");
      });

      it("will not configure the global View", function() {
        expect(View.prototype.prefix).to.not.equal("/templates/");
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
        expect(hit).to.equal(true);
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
        expect(hit).to.equal("extend");
      });

      it("will trigger the fetch provided during create", function() {
        new TestView({ fetch: function() { hit = "create" } }).render();
        expect(hit, "Fetch gets called on a View.");
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
        expect(testUtil.trim(testView.$el.text())).to.equal("hi");
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
        expect(layout.getView("").template).to.equal("template-two");
      });

      it("will override arbitrary properties", function() {
        expect(layout.getView("").lol).to.equal("hi");
      });
    });

  });

});
