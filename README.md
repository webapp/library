WebApp/Library
--------------

> a tool for writing web applications

**Stable: 0.1.0**

A modern fork of the popular MV\* library, Backbone.js.  Authored using the
simplified CommonJS AMD format.

### Features: ###

* Custom builds
  - Raw build (no dependencies).
  - All bundled (Promise, jQuery, Lo-Dash, Ractive).

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

### What's new and different from Backbone? ###
