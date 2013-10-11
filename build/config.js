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
    sizzle: "../../bower_components/jquery/bower_components/sizzle/dist/sizzle",
    scopedcss: "../../bower_components/scopedcss/dist/scopedcss"
  },

  baseUrl: "../dist/amd",
  include: ["../../bower_components/almond/almond", "../../build/config", "webapp"],
  excludeShallow: ["jquery", "scopedcss", "ractive"]
});
