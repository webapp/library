require({
  packages: [{
    name: "lodash",
    location: "../bower_components/lodash-amd/modern",
    main: "main.js"
  }, {
    name: "jquery",
    location: "../bower_components/jquery/src",
    main: "jquery.js"
  }, {
    name: "webapp",
    location: ".",
    main: "index.js"
  }],

  paths: {
    sizzle: "../bower_components/sizzle/dist/sizzle",
    scopedcss: "../bower_components/scopedcss/dist/scopedcss",
    ractive: "../bower_components/ractive/ractive"
  }
});
