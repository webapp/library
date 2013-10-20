require.config({
  packages: [{
    name: "webapp",
    location: ".",
    main: "index.js"
  }, {
    name: "lodash",
    location: "../../bower_components/lodash-amd/modern",
    main: "main.js"
  }, {
    name: "jquery",
    location: "../../bower_components/jquery/src",
    main: "jquery.js",
    namespace: "jquery"
  }],

  paths: {
    sizzle: "../../bower_components/sizzle/dist/sizzle",
    scopedcss: "../../bower_components/scopedcss/dist/scopedcss",
    ractive: "../../bower_components/ractive/build/Ractive"
  },

  globals: {
    "jquery/core": "jQuery"
  },

  baseUrl: "../dist/amd",
  include: ["../../build/define", "../../build/config", "webapp"],
  exclude: ["jquery", "lodash", "scopedcss", "ractive"]
});
