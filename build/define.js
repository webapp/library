// Save a reference to CommonJS `require` implementation.
var nodeRequire = typeof require !== "undefined" && require;

var define = function(moduleName, deps, callback) {
  // Allow deps to be optional.
  if (!callback) {
    callback = deps;
    deps = undefined;
  }

  // Attach to the module map.
  define.map[moduleName] = {
    moduleName: moduleName,
    deps: deps,
    callback: callback
  };
};

// Yee-haw!
define.amd = {};

// Module lookup table.
define.map = {};

var require = function(moduleName) {
  // If there are any packages defined, ensure that modules are correctly
  // mapped.
  require.conf.packages && require.conf.packages.forEach(function(package) {
    if (moduleName.indexOf(package.location) === 0) {
      moduleName = package.name + moduleName.slice(moduleName.indexOf("/"))
      return;
    }
  });

  // The inline mapping of the module.
  var inlined = define.map[moduleName];

  // Represents this given module.
  var module = {
    exports: {}
  };

  // Modules that are inlined, but not yet cached must be run and then cached.
  if (inlined && !inlined.value) {
    // This will appropriate the correct behavior for modules.
    inlined.deps = inlined.deps.map(function(dep) {
      if (dep === "require") {
        return require;
      }

      if (dep === "exports") {
        return module.exports;
      }

      if (dep === "module") {
        return module;
      }

      return require(dep);
    });

    // Invoke and cache the module.
    inlined.value = typeof inlined.callback === "function"
      ? inlined.callback.apply(window, inlined.deps) || module.exports
      : inlined.callback;
  }

  // Modules that are inlined into the source take precedence.
  if (inlined) {
    return inlined.value;
  }

  // Give Node/Browserify a shot.
  try {
    return nodeRequire(moduleName);
  } catch (ex) {}
    
  // Last place to check is the global object, extract the correct
  // global identifier from the configuration.
  return window[require.conf.globals[moduleName]];
};

require.config = function(object) {
  require.conf = object;
};

require.conf = {};
