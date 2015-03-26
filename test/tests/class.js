define(function(require, exports, module) {
  "use strict";

  var Class = require("class");

  describe("Class", function() {
    it("is a constructor", function() {
      assert.equal(typeof Class, "function");
    });

    it("exposes a default constructor", function() {
      assert.equal(typeof Class.constructor, "function");
    });

    it("exposes an extend method", function() {
      assert.equal(typeof Class.extend, "function");
    });

    it("exposes a mixin method", function() {
      assert.equal(typeof Class.mixin, "function");
    });

    it("has inheritance", function() {
      assert.equal(typeof Class.extend, "function");
    });

    describe("when subclassed by extending", function() {
      var MyClass = Class.extend();

      describe("can mix in additional properties", function() {
        MyClass.someProperty = true;

        it("will overwrite existing properties", function() {
          MyClass.mixin({ someProperty: false });

          assert.equal(MyClass.someProperty, false);
        });
      });
    });

    describe("when instantiated by create", function() {
      var myClass = Class.create();

      it("will have a prototype equal to the Class", function() {
        assert.equal(myClass instanceof Class, true);
      });
    });
  });
});
