import Events from "./events";
import Inheritance from "./inheritance";

import extend from "lodash/objects/assign";

function Class() {}

// All Classes should provide events.
extend(Class.prototype, Events, {
  // There needs to be a top level constructor, so we're setting it to itself.
  constructor: Class
});

// Classes provide inheritance.
extend(Class, Inheritance);

export default Class;
