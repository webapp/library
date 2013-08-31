import _ from "lodash";
import Events from "./events";
import Inheritance from "./inheritance";

function Class() {}

// All Classes should provide events.
_.extend(Class.prototype, Events, {
  // There needs to be a top level constructor, so we're setting it to itself.
  constructor: Class
});

// Classes provide inheritance.
_.extend(Class, Inheritance);

export default Class;
