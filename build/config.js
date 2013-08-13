require.config({
  packages: [{
    name: "webapp",
    location: ".",
    main: "index.js",
    catchError: {
      define: true
    }
  }],

  paths: {
    "jquery": "../vendor/lib/jquery/jquery",
    "lodash": "../vendor/lib/lodash/dist/lodash",
    "history": "../vendor/lib/history.js/scripts/uncompressed/history",
    "q": "../vendor/lib/q/q",
    "scopedcss": "../vendor/lib/scopedcss/dist/scopedcss",
    "ractive": "../vendor/lib/ractive/build/Ractive"
  },

  baseUrl: "../src",
  include: ["../build/almond", "webapp", "../build/shim"]
});
