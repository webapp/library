define(function(require, exports, module) {
  "use strict";

  var Class = require("class");

  describe("Class", function() {
    it("is a constructor", function() {
      expect(Class).to.be.a("function");
    });

    it("exposes a default constructor", function() {
      expect(Class.constructor).to.be.a("function");
    });

    it("exposes an extend method", function() {
      expect(Class.extend).to.be.a("function");
    });

    it("exposes a mixin method", function() {
      expect(Class.mixin).to.be.a("function");
    });
    
    it("has inheritance", function() {
      expect(Class.extend).to.be.a("function");
    });

    describe("when subclassed by extending", function() {
      var MyClass = Class.extend();

      describe("can mix in additional properties", function() {
        MyClass.someProperty = true;

        it("will overwrite existing properties", function() {
          MyClass.mixin({ someProperty: false });

          expect(MyClass.someProperty).to.equal(false);
        });
      });
    });

    describe("when instantiated by create", function() {
      var myClass = Class.create();

      it("will have a prototype equal to the Class", function() {
        expect(myClass instanceof Class).to.be.equal(true);
      });
    });
  });
});
