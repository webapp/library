(function(window) {

  // Attempt to resolve the module.
  function resolve(module) {
    var moduleName = module[0];
    var globalName = module[1];
    var isRequired = module[2];

    // Attempt to resolve modules from Node or Browser globals.
    define(moduleName, function() {
      var module = window[globalName];

      try {
        module = nodeRequire(moduleName);
      } catch (ex) {}

      if (!module && isRequired) {
        throw new Error("Missing required dependency: " + moduleName);
      }

      return module;
    });
  }

  [
    ["jquery", "jQuery"],
    ["lodash", "_"],
    ["ractive", "Ractive"],
    ["scopedcss", "ScopedCss"],
    ["history", "History"]
  ].forEach(resolve);

})(this);
