import _ from "lodash";
import Events from "events";
import Inheritance from "inheritance";

function Class() {}

// All Classes should provide events.
_.extend(Class.prototype, Events, {
  // Set the default constructor to the above named constructor.
  constructor: Class
});

// Classes provide inheritance.
_.extend(Class, Inheritance);

export default Class;
