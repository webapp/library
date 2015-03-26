define(function(require, exports, module) {
  "use strict";

  var Class = require("./class");
  var _ = require("lodash");

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Class.extend({
    constructor: function(options) {
      Router.super("constructor", this, arguments);

      options = _.extend(this, options);

      // Useful for nested functions.
      var root = this;
      // Use for normal routes.
      var routes = {};
      // Use for attached routers.
      var routers = this.routers = {};
      // Router attached routes, normalized.
      var normalizedRoutes = this.routes;

      // Iterate and augment the routes hash to accept Routers.
      _.each(normalizedRoutes, function(action, route) {
        var parent, router, SubRouter, originalRoute;
        var prefix = root.prefix;

        // Prefix is optional, set to empty string if not passed.
        if (!prefix) {
          prefix = route || "";
        }

        // Allow for optionally omitting trailing /.  Since base routes do not
        // trigger with a trailing / this is actually kind of important =).
        if (prefix.charAt(prefix.length-1) === "/") {
          prefix = prefix.substr(0, prefix.length-1);
        }

        // SubRouter constructors need to be augmented to allow for filters, they
        // are also attached to a special property on the RouteManager for
        // easy accessibility and event binding.
        if (action.prototype instanceof Router) {
          // Maintain a reference to the user-supplied constructor.
          parent = action.prototype.constructor;

          // Extend the SubRouter to override the constructor function.
          SubRouter = action.extend({
            constructor: function(options) {
              var ctor = Router.prototype.constructor;

              // keep routes in a separate hash or IE<9 reloop over new object index
              var tempRoutes = {};

              // Make sure to prefix all routes.
              _.each(_.clone(this.routes), function(method, route) {
                delete this.routes[route];

                route = route ? prefix + "/" + route : prefix;

                // Replace the route with the override.
                tempRoutes[route] = method;
                this[method] = Router.handleRoute.call(this, this[method],
                  route);
              }, this);

              this.routes = tempRoutes;

              return ctor.apply(this, arguments);
            },

            // Overrideable options.
            options: Router.prototype.options
          });

          // Initialize the Router inside the collection.
          router = routers[route] = new SubRouter();

          // Give the router state!
          route._state = {};

          // Internal object cache for special RouteManager functionality.
          router.__manager__ = {
            // Used to avoid multiple lookups for router+prefix.
            prefix: prefix,
            // Necessary to know the top level Router.
            root: root
          };

          // If there is a custom constructor function provided by the user;
          // make sure to be a good samaritan.
          if (_.isFunction(parent)) {
            parent.call(router);
          }

          // No need to delete from this.routes, since the entire object is
          // replaced anyways.

        // If it is not a Backbone.Router, then its a normal route, assuming
        // the action and route are strings.
        } else if (_.isString(action) && _.isString(route)) {
          // Reset this here, since we don't want duplicate routes
          prefix = root.prefix ? root.prefix : "";

          // Add the route callbacks to the instance, since they are
          // currently inside the options object.
          root[action] = Router.handleRoute.call(root, root[action], route);

          // Add route to collection of "normal" routes, ensure prefixing.
          if (route) {
            return routes[prefix + route] = action;
          }

          // If the path is "" just set to prefix, this is to comply
          // with how Backbone expects base paths to look gallery vs gallery/.
          routes[prefix] = action;
        }
      });

      // Add the manager routes.
      this.routes = routes;
      this._bindRoutes();
      this.initialize.apply(this, arguments);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Router.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Router.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Router.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Router.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Router.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    },

    __manager__: { prefix: "" }
  });

  Router.mixin({
    // This static method allows for global configuration of RouteManager.
    configure: function(options) {
      var existing = Router.prototype.options;

      // Without this check the application would react strangely to a foreign
      // input.
      if (_.isObject(options)) {
        return _.extend(existing, options);
      }
    },

    // Wraps a route and provides the before/after filters and params object.
    handleRoute: function(original, route) {
      var fragment, routeName;
      var router = this;
      var options = router.options;

      // Detect the identifiers out of the route.
      var identifiers = _.map(route.match(/:(\w+)|\*(\w+)/g), function(arg) {
        return arg.slice(1);
      });

      // Replace the route function with the wrapped version.
      return function() {
        var args = arguments;

        // Its possible this function's context will be set to pull the wrong
        // router, ensure the correct property is selected.
        var router = this;

        // Set the fragment, as detected by Backbone.
        fragment = Router.history.fragment;

        // Reduce the arguments to the names inside the params object.
        this.params = _.reduce(identifiers, function(memo, arg, i) {
          memo[arg] = args[i];
        }, {});

        // Navigate the original route and then call the after callbacks.
        if (_.isFunction(original)) {
          original.apply(this, args);
        }
      };
    }
  });

  module.exports = Router;
});
