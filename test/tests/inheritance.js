define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var Inheritance = require("inheritance");

  describe("Inheritance", function() {
    it("is an object", function() {
      expect(Inheritance).to.be.a("object");
    });
    
    it("exposes an extend method", function() {
      expect(Inheritance.extend).to.be.a("function");
    });

    it("exposes a create method", function() {
      expect(Inheritance.create).to.be.a("function");
    });

    describe("when extending a Parent object", function() {
      function Parent() {
      
      }

      _.extend(Parent, Inheritance);

      var Child = Parent.extend();

      describe("with no arguments", function() {
        var Child = Parent.extend();

        it("will not product a Child with an identical object", function() {
          expect(Child).to.not.equal(Parent);
        });

        it("will have identical Parent functions", function() {
          expect(Child.extend).to.equal(Parent.extend);
        });
      });

      describe("with arguments", function() {
        var fn = function() {};
        var obj = {};
        var array = [];

        var Child = Parent.extend({
          str: "value",
          bool: true,
          num: 5,
          falsey: undefined,
          fn: fn,
          obj: obj,
          array: array
        });

        it("will copy over all properties regardless of type", function() {
          expect(Child.prototype).to.have.ownProperty("str");
          expect(Child.prototype).to.have.ownProperty("bool");
          expect(Child.prototype).to.have.ownProperty("num");
          expect(Child.prototype).to.have.ownProperty("falsey");
          expect(Child.prototype).to.have.ownProperty("fn");
          expect(Child.prototype).to.have.ownProperty("obj");
          expect(Child.prototype).to.have.ownProperty("array");
        });

        it("will copy over values correctly", function() {
          expect(Child.prototype.str).to.equal("value");
          expect(Child.prototype.bool).to.equal(true);
          expect(Child.prototype.num).to.equal(5);
          expect(Child.prototype.falsey).to.equal(undefined);
          expect(Child.prototype.fn).to.equal(fn);
          expect(Child.prototype.obj).to.equal(obj);
          expect(Child.prototype.array).to.equal(array);
        });

        it("will not modify the parent object", function() {
          expect(Object.keys(Parent)).to.eql(["create", "extend", "mixin"]);
        });
      });
    });

    describe("when creating an instance of a Parent object", function() {
      function Parent() {}

      _.extend(Parent, Inheritance);

      it("its prototype will be the parent", function() {
        var child = Parent.create();

        expect(child instanceof Parent).to.equal(true);
      });

      it("will trigger the parent's constructor function", function() {
        var hit = false;
        Parent.prototype.constructor = function() { hit = true; };

        var child = Parent.create();

        expect(hit).to.equal(true);
      });

      it("will provide super access to the Parent", function() {
        var hit = false;

        Parent.prototype.someMethod = function() {
          hit = true;
        };

        var Child = Parent.extend({
          someMethod: function() {
            Child.super("someMethod", this);
          }
        });

        var child = Child.create();

        expect(Child.super).to.be.a("function");
        expect(Child.super()).to.equal(Parent);

        child.someMethod();
        expect(hit).to.equal(true);

        hit = false;

        var Third = Child.extend({
          someMethod: function() {
            Third.super("someMethod", this);
          }
        });

        var third = Third.create();

        third.someMethod();
        expect(hit).to.equal(true);
      });

      describe("with no arguments", function() {
        var child = Parent.create();

        it("will not product a Child with an identical object", function() {
          expect(child).to.not.equal(Parent);
        });

        it("will be identical to the parent otherwise", function() {
          expect(child).to.eql(Parent.prototype);
        });
      });

      describe("with arguments", function() {
        var args;

        Parent.prototype.constructor = function() {
          args = arguments;
        };

        var child = Parent.create({
          str: "value"
        });

        delete Parent.prototype.constructor;

        it("will pass properties to constructor", function() {
          expect(args.length).to.equal(1);
          expect(args[0].str).to.equal("value");
        });
      });
    });
  });
});
