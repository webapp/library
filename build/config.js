require.config({
  packages: [{
    name: "webapp",
    location: ".",
    main: "index.js"
  }],

  globals: {
    lodash: "_",
    jquery: "jQuery",
    q: "Q",
    "history.js": "History",
    scopedcss: "ScopedCss",
    ractive: "Ractive"
  },

  paths: {
    jquery: "../vendor/jquery/jquery",
    lodash: "../vendor/lodash/dist/lodash",
    q: "../vendor/q/q",
    scopedcss: "../vendor/scopedcss/dist/scopedcss",
    ractive: "../vendor/ractive/build/Ractive"
  },

  baseUrl: "../src",
  include: ["../build/define", "../build/config", "webapp"],
  excludeShallow: ["jquery", "q", "ractive"]
});
