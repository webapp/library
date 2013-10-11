import Events from "events";
import Inheritance from "inheritance";

import _extend from "lodash/objects/assign";

function Class() {}

// Classes provide events.
_extend(Class.prototype, Events, {
  // Set the default constructor.
  constructor: Class
});

// Classes provide inheritance.
_extend(Class, Inheritance);

export default Class;
