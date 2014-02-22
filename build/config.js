require.config({
  packages: [{
    name: "webapp",
    location: ".",
    main: "index.js"
  }, {
    name: "lodash",
    location: "../bower_components/lodash-amd/modern",
    main: "main.js"
  }, {
    name: "jquery",
    location: "../bower_components/jquery/src",
    main: "jquery.js"
  }],

  paths: {
    sizzle: "../bower_components/sizzle/dist/sizzle",
    scopedcss: "../bower_components/scopedcss/scopedcss",
    ractive: "../bower_components/ractive/build/Ractive",
    layoutmanager: "../bower_components/layoutmanager/backbone.layoutmanager"
  },

  map: {
    "layoutmanager": {
      "backbone": "webapp",
      "underscore": "lodash"
    }
  },

  baseUrl: "../lib",
  include: ["../build/almond", "../build/config", "webapp"],
  exclude: ["jquery", "lodash", "scopedcss", "ractive"]
});
