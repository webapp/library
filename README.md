WebApp Library
==============

> a tool for writing web applications

**v0.1.0-pre** [![Build
Status](https://travis-ci.org/webapp/library.png)](https://travis-ci.org/webapp/library)
[![Dependency
Status](https://gemnasium.com/webapp/library.png)](https://gemnasium.com/webapp/library)

A modern fork of the popular MVC library, Backbone.js.  Authored in ES6 and
aimed to be highly compatible and flexible.  Several developers have found
initial bliss in Backbone and angst once they realize it's limitations.

This library provides mechanisms to remain productive and flexible, without
bottlenecking you on naming conventions, manual View construction, and
opinioned feature sets.

## Features ##

* Custom builds
  - Raw build (no dependencies).
  - All bundled (Q, jQuery, Lo-Dash, Ractive, ScopedCss).

* Flexible module/exports support
  - Global (Just drop into the page with a script tag).
  - AMD (RequireJS/Dojo).
  - CJS (Node/Browserify).

* Web Components
  - Scoped stylesheets.
  - Flexible identifiers (ids, custom tag names, etc).

* Improved data communication
  - Unified mechanisms for synchronizing data between Views, APIs, and your
    App.
  - Whenever data is changed events are broadcasted on specific named channels.

* Improved API communication
  - Define custom transports that define how to make a request.
  - Define adapters on how to store and work with the requested data locally.
  - Define resource handlers to communicate with event channels.
