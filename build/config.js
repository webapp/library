require.config({
  name: "WebApp",

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
    ractive: "../bower_components/ractive/build/Ractive"
  }
});
