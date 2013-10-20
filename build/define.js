// Save a reference to CommonJS `require` implementation.
var nodeRequire = typeof require !== "undefined" && require;

// Register modules first, but do not execute the callbacks until a matching
// `require` has been requested for this module.
var define = function(moduleName, deps, callback) {
  //if (moduleName === "jquery/selector") { debugger; }
  if (!deps && !callback) {
    return;
  }

  // Allow deps to be optional.
  if (!callback && typeof deps === "function") {
    callback = deps;
    deps = undefined;
  }

  // Ensure dependencies is never falsey.
  deps = deps || [];

  // Normalize the dependencies.
  deps = deps.map(function(dep) {
    if (dep.indexOf("./") === -1) {
      return dep;
    }

    // Take off the last path.
    var normalize = moduleName.split("/").slice(0, -1).join("/");

    //console.log(normalize, dep, define.join(normalize, dep));
    return define.join(normalize, dep);
  });

  // Attach to the module map.
  define.map[moduleName] = {
    moduleName: moduleName,
    deps: deps,
    callback: callback
  };
};

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

define.isAbsolute = function(path) {
  return path[0] === "/";
};

define.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return define.normalize(paths.filter(function(p, index) {
    if (typeof p !== "string") {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};

define.normalize = function(path) {
  var isAbsolute = define.isAbsolute(path),
      trailingSlash = path.substr(-1) === '/';

  // Normalize the path
  path = normalizeArray(path.split('/').filter(function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// Yee-haw!
define.amd = {};

// Module lookup table.
define.map = {};

var require = function(moduleName) {
  // The inline mapping of the module.
  var inlined = define.map[moduleName];

  // Represents this given module.
  var module = {
    exports: {}
  };

  // Attempt to find a suitable global from the globals configuration, if none
  // is present, at least attempt to load the moduleName.
  var globalIdentifier = require.conf.globals
    ? require.conf.globals[moduleName]
    : moduleName;

  // Modules that are inlined, but not yet cached must be run and then cached.
  if (inlined && !inlined.value) {
    // This will appropriate the correct behavior for modules.
    var deps = (inlined.deps || []).map(function(dep) {
      // Break the directory names into parts.
      var dirParts = moduleName.split("/").reverse();
      // Dirty
      var isDirty = false;

      if (!dep) {
        return;
      }

      if (dep === "require") {
        return require;
      }

      if (dep === "exports") {
        return module.exports;
      }

      if (dep === "module") {
        return module;
      }

      // Remove directory traversals.
      dep = dep.replace(/\.\.\//g, function() {
        dirParts.shift();
        dirParts.shift();
        isDirty = true;
        return "";
      });

      // Nothing needs to change here.
      dep = dep.replace(/\.\//g, function() {
        isDirty = true;
        dirParts.shift();
        return "";
      });

      // Trim off relative lookups.
      if (isDirty) {
        // Reassemble.
        dep = dirParts.reverse().join("/") + "/" + dep;
      }

      return require(dep);
    });

    // Invoke and cache the module.
    inlined.value = typeof inlined.callback === "function"
      ? inlined.callback.apply(window, deps) || module.exports
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
    
  // Last place to check is the global object, extract the correct global
  // identifier from the configuration.
  return window[globalIdentifier];
};

// In the case of a library you should realistically only be calling `config`
// once.
require.config = function(object) {
  require.conf = object;
};

// This is a placeholder object, in the case that a `require.config` is not
// bundled.
require.conf = {};
