define(function(require, exports, module) {
  "use strict";

  var Class = require("./class");

  // Utilities.
  var _ = require("lodash");

  // jQuery methods.
  var $ = require("jquery");

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // Cache these methods for performance.
  var aConcat = Array.prototype.concat;
  var aSplice = Array.prototype.splice;

  var View = Class.extend({
    _render: function(manage) {
      // Keep the view consistent between callbacks and deferreds.
      var view = this;
      // Shorthand the manager.
      var manager = view.__state__;
      // Cache these properties.
      var beforeRender = view.beforeRender;
      // Create a deferred instead of going off
      var def = view.deferred();

      // Ensure all nested Views are properly scrubbed if re-rendering.
      if (view.hasRendered) {
        view._removeViews();
      }

      // This continues the render flow after `beforeRender` has completed.
      manager.callback = function() {
        // Clean up asynchronous manager properties.
        delete manager.isAsync;
        delete manager.callback;

        // Always emit a beforeRender event.
        view.trigger("beforeRender", view);

        // Render!
        view._viewRender(manager).render().then(function() {
          // Complete this deferred once resolved.
          def.resolveWith(view, [view]);
        });
      };

      // If a beforeRender function is defined, call it.
      if (beforeRender) {
        beforeRender.call(view, view);
      }

      if (!manager.isAsync) {
        manager.callback();
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

      // Backbone compatibility <= 1.0.0.
      if (!this.options) {
        this.options = propertiesObject;
      }

      this.options = _.result(this, "options");

      // Attach the element.
      this.setElement(_.result(this, "el"));

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
      var noel;

      // Ensure options is always an object.
      var options = propertiesObject || {};

      // Remove the container element provided by Backbone.
      if ("el" in options ? options.el === false : this.el === false) {
        noel = true;
      }

      // Set up this View.
      View.setupView(this, options);

      // Assign the `noel` property once we're sure the View we're working with is
      // managed by LayoutManager.
      if (this.__state__) {
        this.__state__.noel = noel;
        this.__state__.suppressWarnings = options.suppressWarnings;
      }

      // Backbone compatibility.
      this.cid = _.uniqueId("view");

      this.configure(propertiesObject || {});

      // Backbone compatibility.
      _.result(this, "initialize");

      var events = _.result(propertiesObject, "events") || _.result(this, "events");

      this.delegateEvents(events);
    },

    // Returns the View that matches the `getViews` filter function.
    getView: function(fn) {
      return this.getViews(fn).first().value();
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
        return _.chain([].concat(views));
      }

      // Generate an array of all top level (no deeply nested) Views flattened.
      views = _.chain(this.views).map(function(view) {
        return Array.isArray(view) ? view : [view];
      }, this).flatten();

      // If the argument passed is an Object, then pass it to `_where`.
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

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      var id = this.modelId(this._isModel(obj) ? obj.attributes : obj);
      return this._byId[obj] || this._byId[id] || this._byId[obj.cid];
    },

    // Ensure the cleanup function is called whenever remove is called.
    remove: function(models, options) {
      // Force remove itself from its parent.
      return View._removeView(this, true);
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
      var root = this;
      var manager = root.__state__;
      var parent = manager.parent;
      var rentManager = parent && parent.__state__;
      var def = root.deferred();

      // Triggered once the render has succeeded.
      function resolve() {

        // Insert all subViews into the parent at once.
        _.each(root.views, function(views, selector) {
          // Fragments aren't used on arrays of subviews.
          if (_.isArray(views)) {
            root.htmlBatch(root, views, selector);
          }
        });

        // If there is a parent and we weren't attached to it via the previous
        // method (single view), attach.
        if (parent && !manager.insertedViaFragment) {
          if (!root.contains(parent.el, root.el)) {
            // Apply the partial using parent's html() method.
            parent.partial(parent.$el, root.$el, rentManager, manager);
          }
        }

        // Ensure events are always correctly bound after rendering.
        root.delegateEvents();

        // Set this View as successfully rendered.
        root.hasRendered = true;
        manager.renderInProgress = false;

        // Clear triggeredByRAF flag.
        delete manager.triggeredByRAF;

        // Only process the queue if it exists.
        if (manager.queue && manager.queue.length) {
          // Ensure that the next render is only called after all other
          // `done` handlers have completed.  This will prevent `render`
          // callbacks from firing out of order.
          (manager.queue.shift())();
        } else {
          // Once the queue is depleted, remove it, the render process has
          // completed.
          delete manager.queue;
        }

        // Reusable function for triggering the afterRender callback and event.
        function completeRender() {
          var console = window.console;
          var afterRender = root.afterRender;

          if (afterRender) {
            afterRender.call(root, root);
          }

          // Always emit an afterRender event.
          root.trigger("afterRender", root);

          // If there are multiple top level elements and `el: false` is used,
          // display a warning message and a stack trace.
          if (manager.noel && root.$el.length > 1) {
            // Do not display a warning while testing or if warning suppression
            // is enabled.
            if (_.isFunction(console.warn) && !root.suppressWarnings) {
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
        if (rentManager && (rentManager.renderInProgress || rentManager.queue)) {
          // Wait until the parent View has finished rendering, which could be
          // asynchronous, and trigger afterRender on this View once it has
          // completed.
          parent.once("afterRender", completeRender);
        } else {
          // This View and its parent have both rendered.
          completeRender();
        }

        return def.resolveWith(root, [root]);
      }

      // Actually facilitate a render.
      function actuallyRender() {

        // The `_viewRender` method is broken out to abstract away from having
        // too much code in `actuallyRender`.
        root._render().done(function() {
          // If there are no children to worry about, complete the render
          // instantly.
          if (!_.keys(root.views).length) {
            return resolve();
          }

          // Create a list of promises to wait on until rendering is done.
          // Since this method will run on all children as well, its sufficient
          // for a full hierarchical.
          var promises = _.map(root.views, function(view) {
            var insert = _.isArray(view);

            // If items are being inserted, they will be in a non-zero length
            // Array.
            if (insert && view.length) {
              // Mark each subview's manager so they don't attempt to attach by
              // themselves.  Return a single promise representing the entire
              // render.
              return root.when(_.map(view, function(subView) {
                subView.__state__.insertedViaFragment = true;
                return subView.render().__state__.renderDeferred;
              }));
            }

            // Only return the fetch deferred, resolve the main deferred after
            // the element has been attached to it's parent.
            return !insert ? view.render().__state__.renderDeferred : view;
          });

          // Once all nested Views have been rendered, resolve this View's
          // deferred.
          root.when(promises).done(resolve);
        });
      }

      // Mark this render as in progress. This will prevent
      // afterRender from being fired until the entire chain has rendered.
      manager.renderInProgress = true;

      // Start the render.
      // Register this request & cancel any that conflict.
      root._registerWithRAF(actuallyRender, def);

      // Put the deferred inside of the `__state__` object, since we don't want
      // end users accessing this directly anymore in favor of the `afterRender`
      // event.  So instead of doing `render().then(...` do
      // `render().once("afterRender", ...`.
      // FIXME: I think we need to move back to promises so that we don't
      // miss events, regardless of sync/async (useRAF setting)
      manager.renderDeferred = def;

      // Return the actual View for chainability purposes.
      return root;
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
      if (this.$el) {
        this.undelegateEvents();
      }

      if (element) {
        // If an element was immediately provided, give that highest
        // precedence.
        this.$el = element instanceof View.$ ? element : View.$(element);

        // Backbone compatibility.
        this.el = this.$el.get()[0];

        // Bind new events.
        this.delegateEvents();

        return this;
      }

      // Assemble a master list of attributes.
      var attrs = _.extend({}, {
        // Attach an id if it exists.
        id: _.result(this, "id"),

        // Attach classes if they were added.
        class: _.result(this, "className")
      }, _.result(this, "attributes"));

      // If neither an element was provided nor derived from the `el` property,
      // then craft an element from the `tagName` property.  Defaults to `div`.
      this.$el = View.$("<" + _.result(this, "tagName") + ">");

      // Configure the element.
      this.$el.attr(attrs);

      // Backbone compatibility.
      this.el = this.$el.get()[0];

      // Bind new events.
      this.delegateEvents();

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

      state.parent = this;

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

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], _.bind(method, this));
      }
      return this;
    },

    // Add a single event listener to the view's element (or a child element
    // using `selector`). This only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
    },

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
    },

    // Register a view render with RAF.
    _registerWithRAF: function(callback, deferred) {
      var root = this;
      var manager = root.__state__;
      var rentManager = manager.parent && manager.parent.__state__;

      // Allow RAF processing to be shut off using `useRAF`:false.
      if (this.useRAF === false) {
        if (manager.queue) {
          aPush.call(manager.queue, callback);
        } else {
          manager.queue = [];
          callback();
        }
        return;
      }

      // Keep track of all deferreds so we can resolve them.
      manager.deferreds = manager.deferreds || [];
      manager.deferreds.push(deferred);

      // Schedule resolving all deferreds that are waiting.
      deferred.done(resolveDeferreds);

      // Cancel any other renders on this view that are queued to execute.
      this._cancelQueuedRAFRender();

      // Trigger immediately if the parent was triggered by RAF.
      // The flag propagates downward so this view's children are also
      // rendered immediately.
      if (rentManager && rentManager.triggeredByRAF) {
        return finish();
      }

      // Register this request with requestAnimationFrame.
      manager.rafID = root.requestAnimationFrame(finish);

      function finish() {
        // Remove this ID as it is no longer valid.
        manager.rafID = null;

        // Set flag (will propagate to children) so they render
        // without waiting for RAF.
        manager.triggeredByRAF = true;

        // Call original cb.
        callback();
      }

      // Resolve all deferreds that were cancelled previously, if any.
      // This allows the user to bind callbacks to any render callback,
      // even if it was cancelled above.
      function resolveDeferreds() {
        for (var i = 0; i < manager.deferreds.length; i++){
          manager.deferreds[i].resolveWith(root, [root]);
        }
        manager.deferreds = [];
      }
    },

    // Cancel any queued render requests.
    _cancelQueuedRAFRender: function() {
      var root = this;
      var manager = root.__state__;
      if (manager.rafID != null) {
        root.cancelAnimationFrame(manager.rafID);
      }
    },

    // This function is responsible for pairing the rendered template into the
    // DOM element.
    _applyTemplate: function(rendered, manager, def) {
      // Actually put the rendered contents into the element.
      if (_.isString(rendered)) {
        // If no container is specified, we must replace the content.
        if (manager.noel) {
          rendered = $.parseHTML(rendered, true);

          // Remove extra root elements.
          this.$el.slice(1).remove();

          // Swap out the View on the first top level element to avoid
          // duplication.
          this.$el.replaceWith(rendered);

          // Don't delegate events here - we'll do that in resolve()
          this.setElement(rendered, false);
        } else {
          this.html(this.$el, rendered);
        }
      }

      // Resolve only after fetch and render have succeeded.
      def.resolveWith(this, [this]);
    },

    // Creates a deferred and returns a function to call when finished.
    // This gets passed to all _render methods.  The `root` value here is passed
    // from the `manage(this).render()` line in the `_render` function
    _viewRender: function(manager) {
      var url, contents, def;
      var root = this;

      // Once the template is successfully fetched, use its contents to proceed.
      // Context argument is first, since it is bound for partial application
      // reasons.
      function done(context, template) {
        // Store the rendered template someplace so it can be re-assignable.
        var rendered;

        // Trigger this once the render method has completed.
        manager.callback = function(rendered) {
          // Clean up asynchronous manager properties.
          delete manager.isAsync;
          delete manager.callback;

          root._applyTemplate(rendered, manager, def);
        };

        // Ensure the cache is up-to-date.
        View.cache(url, template);

        // Render the View into the el property.
        if (template) {
          rendered = root.renderTemplate.call(root, template, context);
        }

        // If the function was synchronous, continue execution.
        if (!manager.isAsync) {
          root._applyTemplate(rendered, manager, def);
        }
      }

      return {
        // This `render` function is what gets called inside of the View render,
        // when `manage(this).render` is called.  Returns a promise that can be
        // used to know when the element has been rendered into its parent.
        render: function() {
          var context = root.scope;
          var template = root.template;

          // Create a deferred specifically for fetching.
          def = root.deferred();

          // If data is a function, immediately call it.
          if (_.isFunction(context)) {
            context = context.call(root);
          }

          // Set the internal callback to trigger once the asynchronous or
          // synchronous behavior has completed.
          manager.callback = function(contents) {
            // Clean up asynchronous manager properties.
            delete manager.isAsync;
            delete manager.callback;

            done(context, contents);
          };

          // Set the url to the prefix + the view's template property.
          if (typeof template === "string") {
            url = root.prefix + template;
          }

          // Check if contents are already cached and if they are, simply process
          // the template with the correct data.
          if (contents = View.cache(url)) {
            done(context, contents, url);

            return def;
          }

          // Fetch layout and template contents.
          if (typeof template === "string") {
            contents = root.fetchTemplate.call(root, root.prefix +
              template);
          // If the template is already a function, simply call it.
          } else if (typeof template === "function") {
            contents = template;
          // If its not a string and not undefined, pass the value to `fetch`.
          } else if (template != null) {
            contents = root.fetchTemplate.call(root, template);
          }

          // If the function was synchronous, continue execution.
          if (!manager.isAsync) {
            done(context, contents);
          }

          return def;
        }
      };
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
          View._removeView(view, force);
        }
      });
    },


    // Remove a single nested View.
    _removeView: function(view, force) {
      var parentViews;
      // Shorthand the managers for easier access.
      var state = view.__state__;
      var rentManager = state.parent && state.parent.__state__;
      // Test for keep.
      var keep = typeof view.keep === "boolean" ? view.keep : view.options.keep;

      // In insert mode, remove views that do not have `keep` attribute set,
      // unless the force flag is set.
      if ((!keep && rentManager && rentManager.insert === true) || force) {
        // Clean out the events.
        View.cleanViews(view);

        // Since we are removing this view, force subviews to remove
        view._removeViews(true);

        // Remove the View completely.
        view.$el.remove();

        // Cancel any pending renders, if present.
        view._cancelQueuedRAFRender();

        // Bail out early if no parent exists.
        if (!state.parent) { return; }

        // Assign (if they exist) the sibling Views to a property.
        parentViews = state.parent.views[state.selector];

        // If this is an array of items remove items that are not marked to
        // keep.
        if (_.isArray(parentViews)) {
          // Remove duplicate Views.
          _.each(_.clone(parentViews), function(view, i) {
            // If the managers match, splice off this View.
            if (view && view.__state__ === state) {
              aSplice.call(parentViews, i, 1);
            }
          });
          if (_.isEmpty(parentViews)) {
            state.parent.trigger("empty", state.selector);
          }
          return;
        }

        // Otherwise delete the parent selector.
        delete state.parent.views[state.selector];
        state.parent.trigger("empty", state.selector);
      }
    },

    // Accept either a single view or an array of views to clean of all DOM
    // events internal model and collection references and all Events.
    cleanViews: function(views) {
      // Clear out all existing views.
      _.each(aConcat.call([], views), function(view) {
        // fire cleanup event to the attached handlers
        //FIXME
        //view.trigger("cleanup", view);

        // Remove all custom events attached to this View.
        view.unbind();

        // Automatically unbind `model`.
        if (view.model instanceof Backbone.Model) {
          view.model.off(null, null, view);
        }

        // Automatically unbind `collection`.
        if (view.collection instanceof Backbone.Collection) {
          view.collection.off(null, null, view);
        }

        // Automatically unbind events bound to this View.
        view.stopListening();

        // If a custom cleanup method was provided on the view, call it after
        // the initial cleanup is done
        if (_.isFunction(view.cleanup)) {
          view.cleanup();
        }
      });
    },

    // This static method allows for global configuration of Views.
    configure: function(options) {
      _.extend(View.prototype, options);
    },

    // Configure a View to work with the Views.
    setupView: function(views, options) {
      // Ensure that options is always an object, and clone it so that
      // changes to the original object don't screw up this view.
      options = _.extend({}, options);

      // Set up all Views passed.
      _.each(aConcat.call([], views), function(view) {
        // If the View has already been setup, no need to do it again.
        if (view.__state__) {
          return;
        }

        var views, declaredViews;
        var proto = View.prototype;

        // Ensure necessary properties are set.
        _.defaults(view, {
          // Ensure a view always has a views object.
          views: {},

          // Ensure a view always has a sections object.
          sections: {},

          // Internal state object used to store whether or not a View has been
          // taken over by layout manager and if it has been rendered into the
          // DOM.
          __state__: {},

          // Add the ability to remove all Views.
          _removeViews: View._removeViews,

          // Add the ability to remove itself.
          _removeView: View._removeView

        // Mix in all View prototype properties as well.
        }, View.prototype);

        // Assign passed options.
        view.options = options;

        // Merge the View options into the View.
        _.extend(view, options);

        // By default the original Remove function is the Backbone.View one.
        view._remove = View.prototype.remove;

        // Ensure the render is always set correctly.
        view.render = View.prototype.render;

        // If the user provided their own remove override, use that instead of
        // the default.
        if (view.remove !== proto.remove) {
          view._remove = view.remove;
          view.remove = proto.remove;
        }

        // Normalize views to exist on either instance or options, default to
        // options.
        views = options.views || view.views;

        // Set the internal views, only if selectors have been provided.
        if (_.keys(views).length) {
          // Keep original object declared containing Views.
          declaredViews = views;

          // Reset the property to avoid duplication or overwritting.
          view.views = {};

          // If any declared view is wrapped in a function, invoke it.
          _.each(declaredViews, function(declaredView, key) {
            if (typeof declaredView === "function") {
              declaredViews[key] = declaredView.call(view, view);
            }
          });

          // Set the declared Views.
          view.setViews(declaredViews);
        }
      });
    },

  });

  // Default options.
  View.configure({
    // Default nodeName to use.
    tagName: "div",

    // Prefix template/layout paths.
    prefix: "",

    // By default enable the use of `documentFragment`s to speed up the rendering
    // of nested Views.
    useRAF: true,

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
    },

    // Based on:
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and
    // Tino Zijdel.
    requestAnimationFrame: (function() {
      var lastTime = 0;
      var vendors = ["ms", "moz", "webkit", "o"];
      var requestAnimationFrame = window.requestAnimationFrame;

      for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
      }

      if (!requestAnimationFrame){
        requestAnimationFrame = function(callback) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      return _.bind(requestAnimationFrame, window);
    })(),

    cancelAnimationFrame: (function() {
      var vendors = ["ms", "moz", "webkit", "o"];
      var cancelAnimationFrame = window.cancelAnimationFrame;

      for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        cancelAnimationFrame =
          window[vendors[i] + "CancelAnimationFrame"] ||
          window[vendors[i] + "CancelRequestAnimationFrame"];
      }

      if (!cancelAnimationFrame) {
        cancelAnimationFrame = function(id) {
          clearTimeout(id);
        };
      }

      return _.bind(cancelAnimationFrame, window);
    })()
  });

  module.exports = View;
});
