require.config({
  packages: [{
    name: "webapp",
    location: ".",
    main: "index.js"
  }, {
    name: "lodash",
    location: "../../vendor/lodash-amd",
    main: "lodash.js"
  }, {
    name: "jquery",
    location: "../../vendor/jquery/src",
    main: "jquery.js"
  }],

  globals: {
    q: "Q",
    ractive: "Ractive"
  },

  paths: {
    sizzle: "../../vendor/jquery/bower_components/sizzle/dist/sizzle",
    q: "../../vendor/q/q",
    scopedcss: "../../vendor/scopedcss/dist/scopedcss",
    ractive: "../../vendor/ractive/build/Ractive"
  },

  baseUrl: "../dist/amd",
  include: ["../../build/define", "../../build/config", "webapp"],
  excludeShallow: ["q", "ractive"]
});
