define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var Inheritance = require("inheritance");

  describe("Inheritance", function() {
    it("is an object", function() {
      assert.equal(typeof Inheritance, "object");
    });
    
    it("exposes an extend method", function() {
      assert.equal(typeof Inheritance.extend, "function");
    });

    it("exposes a create method", function() {
      assert.equal(typeof Inheritance.create, "function");
    });

    describe("when extending a Parent object", function() {
      function Parent() {
      
      }

      _.extend(Parent, Inheritance);

      var Child = Parent.extend();

      describe("with no arguments", function() {
        var Child = Parent.extend();

        it("will not product a Child with an identical object", function() {
          assert.notEqual(Child, Parent);
        });

        it("will have identical Parent functions", function() {
          assert.equal(Child.extend, Parent.extend);
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
          assert(Child.prototype.hasOwnProperty("str"));
          assert(Child.prototype.hasOwnProperty("bool"));
          assert(Child.prototype.hasOwnProperty("num"));
          assert(Child.prototype.hasOwnProperty("falsey"));
          assert(Child.prototype.hasOwnProperty("fn"));
          assert(Child.prototype.hasOwnProperty("obj"));
          assert(Child.prototype.hasOwnProperty("array"));
        });

        it("will copy over values correctly", function() {
          assert.equal(Child.prototype.str, "value");
          assert.equal(Child.prototype.bool, true);
          assert.equal(Child.prototype.num, 5);
          assert.equal(Child.prototype.falsey, undefined);
          assert.equal(Child.prototype.fn, fn);
          assert.equal(Child.prototype.obj, obj);
          assert.equal(Child.prototype.array, array);
        });

        it("will not modify the parent object", function() {
          assert.deepEqual(Object.keys(Parent), ["create", "extend", "mixin"]);
        });
      });
    });

    describe("when creating an instance of a Parent object", function() {
      function Parent() {}

      _.extend(Parent, Inheritance);

      it("can be initialized with new", function() {
        var parent = new Parent();

        assert.equal(parent instanceof Parent, true);
      });

      it("can be initialized without new", function() {
        var Child = Parent.extend();
        var child = Child();

        assert.equal(child instanceof Child, true);
      });

      it("its prototype will be the parent", function() {
        var parent = Parent.create();

        assert.equal(parent instanceof Parent, true);
      });

      it("will trigger the parent's constructor function", function() {
        var hit = false;
        Parent.prototype.constructor = function() { hit = true; };

        var parent = Parent.create();

        assert.equal(hit, true);
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

        assert.equal(typeof Child.super, "function");
        assert.equal(Child.super(), Parent);

        child.someMethod();
        assert.equal(hit, true);

        hit = false;

        var Third = Child.extend({
          someMethod: function() {
            Third.super("someMethod", this);
          }
        });

        var third = Third.create();

        third.someMethod();
        assert.equal(hit, true);
      });

      describe("with no arguments", function() {
        var parent = Parent.create();

        it("will not product a Child with an identical object", function() {
          assert.notEqual(parent, Parent);
        });

        it("will be deep equal to the parent prototype", function() {
          assert.deepEqual(parent.__proto__, Parent.prototype);
        });
      });

      describe("with arguments", function() {
        var args;

        Parent.prototype.constructor = function() {
          args = arguments;
        };

        var parent = Parent.create({
          str: "value"
        });

        delete Parent.prototype.constructor;

        it("will pass properties to constructor", function() {
          assert.equal(args.length, 1);
          assert.equal(args[0].str, "value");
        });
      });
    });
  });
});
