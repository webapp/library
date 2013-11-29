import Events from "./events";
module Inheritance from "./inheritance";

module _ from "lodash";

function Class() {}

// Classes provide events.
_.extend(Class.prototype, Events, {
  // Set the default constructor.
  constructor: Class
});

// Classes provide inheritance.
_.extend(Class, Inheritance);

export default Class;
