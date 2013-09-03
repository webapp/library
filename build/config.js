require.config({
  packages: [{
    name: "webapp",
    location: ".",
    main: "index.js"
  }, {
    name: "lodash",
    location: "../../vendor/lodash-amd",
    main: "lodash.js"
  }],

  globals: {
    jquery: "jQuery",
    q: "Q",
    scopedcss: "ScopedCss",
    ractive: "Ractive"
  },

  paths: {
    jquery: "../../vendor/jquery/jquery",
    q: "../../vendor/q/q",
    scopedcss: "../../vendor/scopedcss/dist/scopedcss",
    ractive: "../../vendor/ractive/build/Ractive"
  },

  baseUrl: "../dist/amd",
  include: ["../../build/define", "../../build/config", "webapp"],
  excludeShallow: ["jquery", "q", "ractive"]
});
