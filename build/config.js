require.config({
  packages: [{
    name: "webapp",
    location: ".",
    main: "index.js"
  }, {
    name: "lodash",
    location: "../../bower_components/lodash-amd/modern",
    main: "lodash.js"
  }, {
    name: "jquery",
    location: "../../bower_components/jquery/src",
    main: "jquery.js"
  }],

  globals: {
    q: "Q",
    ractive: "Ractive"
  },

  paths: {
    sizzle: "../../bower_components/jquery/bower_components/sizzle/dist/sizzle",
    scopedcss: "../../bower_components/scopedcss/dist/scopedcss",
    ractive: "../../bower_components/ractive/build/Ractive"
  },

  baseUrl: "../dist/amd",
  include: ["../../build/define", "../../build/config", "webapp"],
  excludeShallow: ["jquery", "scopedcss", "ractive"]
});
