require.config({
  packages: [{
    name: "webapp",
    location: ".",
    main: "index.js"
  }],

  paths: {
    sizzle: "../../bower_components/sizzle/dist/sizzle",
    scopedcss: "../../bower_components/scopedcss/dist/scopedcss",
    ractive: "../../bower_components/ractive/build/Ractive",
    jquery: "../../bower_components/jquery/jquery",
    lodash: "../../bower_components/lodash/dist/lodash"
  },

  globals: {
    "jquery": "jQuery"
  },

  baseUrl: "../dist/amd",
  include: ["../../build/define", "../../build/config", "webapp"],
  exclude: ["jquery", "lodash", "scopedcss", "ractive"]
});
