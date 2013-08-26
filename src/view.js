// Libraries.
import $ from "jquery";
import _ from "lodash";
import Ractive from "ractive";

// Modules.
import Class from "class";

// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

// Cache these methods for performance.
var aConcat = Array.prototype.concat;
var aSplice = Array.prototype.splice;

var View = Class.extend({
  _render: function(manage) {
    // Keep the view consistent between callbacks and deferreds.
    var view = this;
    // Shorthand the state.
    var state = this.__state__;
    // Cache these properties.
    var beforeRender = this.beforeRender;
    // Create a deferred instead of going off 
    var def = this.deferred();

    // Ensure all nested Views are properly scrubbed if re-rendering.
    if (this.hasRendered) {
      View._removeViews(this);
    }

    // This continues the render flow after `beforeRender` has completed.
    state.callback = function() {
      // Clean up asynchronous state properties.
      delete state.isAsync;
      delete state.callback;

      // Always emit a beforeRender event.
      view.trigger("beforeRender", view);

      // Render!
      manage(view).render().then(function() {
        // Complete this deferred once resolved.
        def.resolve();
      });
    };

    // If a beforeRender function is defined, call it.
    if (beforeRender) {
      beforeRender.call(view, view);
    }

    if (!state.isAsync) {
      state.callback();
    }

    // Return this intermediary promise.
    return def.promise();
  },

  // This method is used within specific methods to indicate that they should
  // be treated as asynchronous.  This method should only be used within the
  // render chain, otherwise unexpected behavior may occur.
  async: function() {
    var state = this.__state__;

    // Called outside of an async-enabled method, silently fail for now.
    if (!state.callback) { return; }

    // Set this View's action to be asynchronous.
    state.isAsync = true;

    // Return the callback.
    return state.callback;
  },

  // Configure this View.
  configure: function(propertiesObject) {
    _.extend(this, {
      // Used to contain nested Views.
      views: {},

      // Used to map selectors to a specific name.
      sections: {},

      // Object that can be used to track changes dynamically.
      observable: {}
    }, propertiesObject);

    // Attach the element.
    this.setElement(this.el);

    // Internal state object.
    this.__state__ = {
      // Remove the surrounding element.
      noel: this.el === false,

      // Silence potential warnings from using the above option with multiple
      // top level inner-elements.
      suppressWarnings: this.suppressWarnings
    };
  },

  // Simply pass along the options to configure this new instance.
  constructor: function(propertiesObject) {
    this.configure(propertiesObject || {});
  },

  // Returns the View that matches the `getViews` filter function.
  getView: function(fn) {
    return this.getViews(fn).first();
  },

  // Provide a filter function to get a flattened array of all the subviews.
  // If the filter function is omitted it will return all subviews.  If a
  // String is passed instead, it will return the Views for that selector.
  getViews: function(fn) {
    var views;

    // If the filter argument is a String, then return a chained Version of
    // the elements. The value at the specified filter may be undefined, a
    // single view, or an array of views; in all cases, chain on a flat
    // array.
    if (typeof fn === "string") {
      fn = this.sections[fn] || fn;
      views = this.views[fn] || [];

      // If Views is undefined you are concatenating an `undefined` to an
      // array resulting in a value being returned.  Defaulting to an array
      // prevents this.
      return _([].concat(views));
    }

    // Generate an array of all top level (no deeply nested) Views flattened.
    views = _(this.views).map(function(view) {
      return Array.isArray(view) ? view : [view];
    }, this).flatten();

    // If the argument passed is an Object, then pass it to `_.where`.
    if (typeof fn === "object") {
      return views.where(fn);
    }

    // If a filter function is provided, run it on all Views and return a
    // wrapped chain. Otherwise, simply return a wrapped chain of all Views.
    return typeof fn === "function" ? views.filter(fn) : views;
  },

  // Shorthand to `setView` function with the `insert` flag set.
  insertView: function(selector, view) {
    // If the `view` argument exists, then a selector was passed in.  This
    // code path will forward the selector on to `setView`.
    if (view) {
      return this.setView(selector, view, true);
    }

    // If no `view` argument is defined, then assume the first argument is the
    // View, somewhat now confusingly named `selector`.
    return this.setView(selector, true);
  },

  // Iterate over an object and ensure every value is wrapped in an array to
  // ensure they will be inserted, then pass that object to `setViews`.
  insertViews: function(views) {
    // If an array of views was passed it should be inserted into the
    // root view. Much like calling insertView without a selector.
    if (Array.isArray(views)) {
      return this.setViews({ "": views });
    }

    _.each(views, function(view, selector) {
      views[selector] = Array.isArray(view) ? view : [view];
    });

    return this.setViews(views);
  },

  // Return a Promise for the internal Deferred rendering.
  promise: function() {
    return this.__state__.renderDeferred.promise();
  },

  // Ensure the cleanup function is called whenever remove is called.
  remove: function(force) {
    var parentViews;
    var state = this.__state__;
    var keep = this.keep;

    // Only remove views that do not have `keep` attribute set, unless the
    // View is in `insert` mode and the force flag is set.
    if ((!keep && state.insert === true) || force) {
      // Clean out the events.
      View.cleanViews(this);

      // Since we are removing this view, force subviews to remove
      this.removeView();

      // Remove the View completely.
      this.$el.remove();

      // Bail out early if no parent exists.
      if (!state.parent) { return; }

      // Assign (if they exist) the sibling Views to a property.
      parentViews = state.parent.views[state.selector];

      // If this is an array of items remove items that are not marked to
      // keep.
      if (_.isArray(parentViews)) {
        // Remove duplicate Views.
        return _.each(_.clone(parentViews), function(view, i) {
          // If the state's match, splice off this View.
          if (view && view.__state__ === state) {
            aSplice.call(parentViews, i, 1);
          }
        });
      }

      // Otherwise delete the parent selector.
      delete state.parent.views[state.selector];
    }
  },

  // Use this to remove Views, internally uses `getViews` so you can pass the
  // same argument here as you would to that method.
  removeView: function(fn) {
    // Allow an optional selector or function to find the right model and
    // remove nested Views based off the results of the selector or filter.
    return this.getViews(fn).each(function(nestedView) {
      nestedView.remove(true);
    });
  },

  // By default this should find all nested views and render them into
  // the this.el and call done once all of them have successfully been
  // resolved.
  //
  // This function returns a promise that can be chained to determine
  // once all subviews and main view have been rendered into the view.el.
  render: function() {
    var view = this;
    var options = this.options;
    var state = this.__state__;
    var parent = state.parent;
    var parentState = parent && parent.__state__;
    var def = this.deferred();

    // Triggered once the render has succeeded.
    function resolve() {
      var next;

      // If there is a parent, attach.
      if (parent) {
        if (!view.contains(parent.el, view.el)) {
          // Apply the partial.
          view.partial(parent.$el, view.$el, parentState, state);
        }
      }

      // Ensure events are always correctly bound after rendering.
      view.delegateEvents();

      // Set this View as successfully rendered.
      view.hasRendered = true;

      // Only process the queue if it exists.
      if (next = state.queue.shift()) {
        // Ensure that the next render is only called after all other
        // `done` handlers have completed.  This will prevent `render`
        // callbacks from firing out of order.
        next();
      } else {
        // Once the queue is depleted, remove it, the render process has
        // completed.
        delete state.queue;
      }

      // Reusable function for triggering the afterRender callback and event
      // and setting the hasRendered flag.
      function completeRender() {
        var console = window.console;
        var afterRender = view.afterRender;

        if (afterRender) {
          afterRender.call(view, view);
        }

        // Always emit an afterRender event.
        view.trigger("afterRender", view);

        // If Ractive is included, apply the data binding.
        if (Ractive && !state.binding) {
          state.binding = new Ractive({
            el: view.$el.get(),
            template: view.$el.html(),
            data: view.observable
          });

          // Proxy the accessor/mutator.
          view.set = function() {
            state.binding.set.apply(state.binding, arguments);
            return this;
          };

          view.get = function() {
            return state.binding.get.apply(state.binding, arguments);
          };
        }

        // If there are multiple top level elements and `el: false` is used,
        // display a warning message and a stack trace.
        if (state.noel && view.$el.length > 1) {
          // Do not display a warning while testing or if warning suppression
          // is enabled.
          if (_.isFunction(console.warn) && !view.suppressWarnings) { 
            console.warn("`el: false` with multiple top level elements is " +
              "not supported.");

            // Provide a stack trace if available to aid with debugging.
            if (_.isFunction(console.trace)) {
              console.trace();
            }
          }
        }
      }

      // If the parent is currently rendering, wait until it has completed
      // until calling the nested View's `afterRender`.
      if (parentState && parentState.queue) {
        // Wait until the parent View has finished rendering, which could be
        // asynchronous, and trigger afterRender on this View once it has
        // compeleted.
        parent.once("afterRender", completeRender);
      } else {
        // This View and its parent have both rendered.
        completeRender();
      }

      return def.resolveWith(view, [view]);
    }

    // Actually facilitate a render.
    function actuallyRender() {
      // The `_viewRender` method is broken out to abstract away from having
      // too much code in `actuallyRender`.
      view._render(View._viewRender, options).done(function() {
        // If there are no children to worry about, complete the render
        // instantly.
        if (!_.keys(view.views).length) {
          return resolve();
        }

        // Create a list of promises to wait on until rendering is done.
        // Since this method will run on all children as well, its sufficient
        // for a full hierarchical.
        var promises = _.map(view.views, function(view) {
          var insert = _.isArray(view);

          // If items are being inserted, they will be in a non-zero length
          // Array.
          if (insert && view.length) {
            // Schedule each view to be rendered in order and return a promise
            // representing the result of the final rendering.
            return _.reduce(view.slice(1), function(prevRender, view) {
              return prevRender.then(function() {
                return view.render().__state__.renderDeferred;
              });
            // The first view should be rendered immediately, and the resulting
            // promise used to initialize the reduction.
            }, view[0].render().__state__.renderDeferred);
          }

          // Only return the fetch deferred, resolve the main deferred after
          // the element has been attached to it's parent.
          return !insert ? view.render().__state__.renderDeferred : view;
        });

        // Once all nested Views have been rendered, resolve this View's
        // deferred.
        view.when(promises).done(resolve);
      });
    }

    // Another render is currently happening if there is an existing queue,
    // so push a closure to render later into the queue.
    if (state.queue) {
      state.queue.push(actuallyRender);
    } else {
      state.queue = [];

      // This the first `render`, preceeding the `queue` so render
      // immediately.
      actuallyRender(view, def);
    }

    // Put the deferred inside of the `__state__` object, since we don't
    // want end users accessing this directly anymore in favor of the
    // `afterRender` event.  So instead of doing `render().then(...` do
    // `render().once("afterRender", ...`.
    state.renderDeferred = def;
    
    // Return the actual View for chainability purposes.
    return this;
  },

  // Sometimes it's desirable to only render the child views under the
  // parent.  This is typical for a layout that does not change.  This method
  // will iterate over the child Views and 
  renderViews: function() {
    var view = this;
    var newDeferred = this.deferred();

    // Collect all promises from rendering the child views and wait till they
    // all complete.
    var promises = this.getViews().map(function(view) {
      return view.render().__state__.renderDeferred;
    }).value();

    // Simulate a parent render to remain consistent.
    this.__state__.renderDeferred = newDeferred;

    // Once all child views have completed rendering, resolve parent deferred
    // with the correct context.
    this.when(promises).then(function() {
      newDeferred.resolveWith(view, [view]);
    });

    // Allow this method to be chained.
    return this;
  },

  // Default the scope to the View instance.
  scope: function() {
    return this;
  },

  // jQuery delegate for element lookup, scoped to DOM elements within the
  // current view. This should be prefered to global lookups where possible.
  $: function(selector) {
    return this.$el.find(selector);
  },

  // Clean up and then set a new element.
  setElement: function(element) {
    if (element) {
      // If an element was immediately provided, give that highest
      // precedence.
      this.$el = View.$(element);

      return this;
    } else if (this.el) {
      // If this View has an element property evaluate and use that value.
      this.$el = View.$(_.result(this.options, "el"));

      return this;
    }

    // Assemble a master list of attributes.
    var attrs = _.extend({}, _.result(this, "attributes"), {
      // Attach an id if it exists.
      id: _.result(this, "id"),

      // Attach classes if they were added.
      class: _.result(this, "className")
    });

    // If neither an element was provided nor derived from the `el` property,
    // then craft an element from the `tagName` property.  Defaults to `div`.
    this.$el = View.$("<" + _.result(this, "tagName") + ">");

    // Configure the element.
    this.$el.attr(attrs);

    return this;
  },

  // This takes in a partial name and view instance and assigns them to
  // the internal collection of views.  If a view is not a View
  // instance, then mix in the View prototype.  This ensures
  // all Views can be used successfully.
  //
  // Must definitely wrap any render method passed in or defaults to a
  // typical render function `return layout(this).render()`.
  setView: function(name, view, insert) {
    // If no name was passed, use an empty string and shift all arguments.
    if (typeof name !== "string") {
      insert = view;
      view = name;
      name = "";
    }

    var state = view.__state__;

    state.selector = this.sections[name] || name;

    // Add reference to the parent.
    state.parent = this;

    // Call the `setup` method, since we now have a relationship created.
    _.result(view, "setup");

    // Code path is less complex for Views that are not being inserted.
    // Simply remove existing Views and bail out with the assignment.
    if (!insert) {
      // If the View we are adding has already been rendered, simply inject it
      // into the parent.
      if (view.hasRendered) {
        // Apply the partial.
        view.partial(this.$el, view.$el, this.__state__, state);
      }

      // Ensure remove is called when swapping View's.
      this.removeView(name);

      // Assign to main views object and return for chainability.
      return this.views[state.selector] = view;
    }

    // Ensure this.views[selector] is an array and push this View to
    // the end.
    this.views[state.selector] = _.union(this.views[name] || [], view);

    // Put the view into `insert` mode.
    state.insert = true;

    return view;
  },

  // Allows the setting of multiple views instead of a single view.
  setViews: function(views) {
    // Iterate over all the views and use the View's view method to assign.
    _.each(views, function(view, name) {
      // If the view is an array put all views into insert mode.
      if (Array.isArray(view)) {
        return _.each(view, function(view) {
          this.insertView(name, view);
        }, this);
      }

      // Assign each view using the view function.
      this.setView(name, view);
    }, this);

    // Allow for chaining
    return this;
  },

  delegateEvents: function(events) {
    if (!(events || (events = _.result(this, 'events')))) return this;
    this.undelegateEvents();
    for (var key in events) {
      var method = events[key];
      if (!_.isFunction(method)) method = this[events[key]];
      if (!method) continue;

      var match = key.match(delegateEventSplitter);
      var eventName = match[1], selector = match[2];
      method = _.bind(method, this);
      eventName += '.delegateEvents' + this.cid;
      if (selector === '') {
        this.$el.on(eventName, method);
      } else {
        this.$el.on(eventName, selector, method);
      }
    }
    return this;
  },

  undelegateEvents: function() {
    this.$el.off('.delegateEvents' + this.cid);
    return this;
  }
});

// This are 'Class-level' properties that shouldn't be associated with any
// specific View.
View.mixin({
  // Expose jQuery.
  $: $,

  // Clearable cache.
  _cache: {},

  // Cache templates into View._cache.
  cache: function(path, contents) {
    // If template path is found in the cache, return the contents.
    if (path in this._cache && contents == null) {
      return this._cache[path];
    // Ensure path and contents aren't undefined.
    } else if (path != null && contents != null) {
      return this._cache[path] = contents;
    }

    // If the template is not in the cache, return undefined.
  },

  // Remove all nested Views.
  _removeViews: function(root, force) {
    // Shift arguments around.
    if (typeof root === "boolean") {
      force = root;
      root = this;
    }

    // Allow removeView to be called on instances.
    root = root || this;

    // Iterate over all of the nested View's and remove.
    root.getViews().each(function(view) {
      // Force doesn't care about if a View has rendered or not.
      if (view.hasRendered || force) {
        View.remove(view, force);
      }
    });
  },

  // Accept either a single view or an array of views to clean of all DOM
  // events internal model and collection references and all Events.
  cleanViews: function(views) {
    // Clear out all existing views.
    _.each(aConcat.call([], views), function(view) {
      var cleanup;

      // Remove all custom events attached to this View.
      view.unbind();

      // Remove the associated styleTag.
      view.component.styleTag.remove();

      // Automatically unbind events bound to this View.
      view.stopListening();

      // If a custom cleanup method was provided on the view, call it after
      // the initial cleanup is done
      cleanup = view.getAllOptions().cleanup;
      if (_.isFunction(cleanup)) {
        cleanup.call(view);
      }
    });
  },

  // This Class method allows for global configuration of Views.
  configure: function(propertiesObject) {
    _.extend(this.prototype, propertiesObject);
  },

  // Creates a deferred and returns a function to call when finished.
  // This gets passed to all _render methods.  The `root` value here is passed
  // from the `manage(this).render()` line in the `_render` function
  _viewRender: function(view) {
    var url, contents, def, renderedEl;
    var state = view.__state__;

    // This function is responsible for pairing the rendered template into
    // the DOM element.
    function applyTemplate(rendered) {
      // Actually put the rendered contents into the element.
      if (_.isString(rendered)) {
        // If no container is specified, we must replace the content.
        if (state.noel) {
          // Trim off the whitespace, since the contents are passed into `$()`.
          rendered = $.trim(rendered);

          // Hold a reference to created element as replaceWith doesn't return
          // new el.
          renderedEl = $(rendered);

          // Remove extra root elements.
          view.$el.slice(1).remove();

          // Swap out the View on the first top level element to avoid
          // duplication.
          view.$el.replaceWith(renderedEl);

          // Don't delegate events here - we'll do that in resolve()
          view.setElement(renderedEl, false);
        } else {
          view.html(view.$el, rendered);
        }
      }

      // Resolve only after fetch and render have succeeded.
      def.resolveWith(view, [view]);
    }

    // Once the template is successfully fetched, use its contents to proceed.
    // Context argument is first, since it is bound for partial application
    // reasons.
    function done(context, contents) {
      // Store the rendered template someplace so it can be re-assignable.
      var rendered;

      // Trigger this once the render method has completed.
      state.callback = function(rendered) {
        // Clean up asynchronous state properties.
        delete state.isAsync;
        delete state.callback;

        applyTemplate(rendered);
      };

      // Ensure the cache is up-to-date.
      View.cache(url, contents);

      // Render the View into the el property.
      if (contents) {
        rendered = view.renderTemplate.call(view, contents, context);
      }

      // If the function was synchronous, continue execution.
      if (!state.isAsync) {
        applyTemplate(rendered);
      }
    }

    return {
      // This `render` function is what gets called inside of the View render,
      // when `manage(this).render` is called.  Returns a promise that can be
      // used to know when the element has been rendered into its parent.
      render: function() {
        var context = view.scope;
        var template = view.template;

        // Create a deferred specifically for fetching.
        def = view.deferred();

        // If data is a function, immediately call it.
        if (_.isFunction(context)) {
          context = context.call(view);
        }

        // Update the observable.
        //_.extend(view.observable, context);
        view.observable = context;

        // Set the internal callback to trigger once the asynchronous or
        // synchronous behavior has completed.
        state.callback = function(contents) {
          // Clean up asynchronous state properties.
          delete state.isAsync;
          delete state.callback;

          done(context, contents);
        };

        // Set the url to the prefix + the view's template property.
        if (typeof template === "string") {
          url = view.prefix + template;
        }

        // the template with the correct data.
        if (contents = View.cache(url)) {
          done(context, contents, url);

          return def;
        }

        // Fetch layout and template contents.
        if (typeof template === "string") {
          contents = view.fetchTemplate.call(view, view.prefix + template);
        // If the template is already a function, simply call it.
        } else if (typeof template === "function") {
          contents = template;
        // If its not a string and not undefined, pass the value to `fetch`.
        } else if (template != null) {
          contents = view.fetchTemplate.call(view, template);
        }

        // If the function was synchronous, continue execution.
        if (!state.isAsync) {
          done(context, contents);
        }

        return def;
      }
    };
  }
});

// Default options.
View.configure({
  // Default nodeName to use.
  tagName: "div",

  // Prefix template/layout paths.
  prefix: "",

  // By default enable the use of `documentFragment`s to speed up the rendering
  // of nested Views.
  useFragment: true,

  // Can be used to supply a different deferred implementation.
  deferred: function() {
    return $.Deferred();
  },

  // Fetch is passed a path and is expected to return template contents as a
  // function or string.
  fetchTemplate: function(path) {
    return _.template(View.$(path).html());
  },

  // By default, render using underscore's templating.
  renderTemplate: function(template, context) {
    return template(context);
  },

  // This is the most common way you will want to partially apply a view into
  // a layout.
  partial: function($root, $el, rentManager, manager) {
    var $filtered;

    // If selector is specified, attempt to find it.
    if (manager.selector) {
      if (rentManager.noel) {
        $filtered = $root.filter(manager.selector);
        $root = $filtered.length ? $filtered : $root.find(manager.selector);
      } else {
        $root = $root.find(manager.selector);
      }
    }

    // Use the insert method if insert argument is true.
    if (manager.insert) {
      this.insert($root, $el);
    } else {
      this.html($root, $el);
    }
  },

  // Override this with a custom HTML method, passed a root element and content
  // (a jQuery collection or a string) to replace the innerHTML with.
  html: function($root, content) {
    $root.html(content);
  },

  // Very similar to HTML except this one will appendChild by default.
  insert: function($root, $el) {
    $root.append($el);
  },

  // Return a deferred for when all promises resolve/reject.
  when: function(promises) {
    return $.when.apply(null, promises);
  },

  // A method to determine if a View contains another.
  contains: function(parent, child) {
    return $.contains(parent, child);
  }
});

export default View;
