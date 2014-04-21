module.exports = ->
  @loadNpmTasks "grunt-synchronizer"

  @config "synchronizer",
    options:
      name: "WebApp"

      paths:
        scopedcss: "../bower_components/scopedcss/dist/scopedcss"
        lodash: "../bower_components/lodash/dist/lodash"
        jquery: "../bower_components/jquery/jquery"
        ractive: "../bower_components/ractive/Ractive"

    # Bundles all third party libraries necessary for this library to operate
    # at full potential.
    bundled:
      files:
        "dist/webapp.bundled.js": "lib/index.js"

    # A minimal build that only includes the official source code.
    default:
      options:
        exclude: [
          "scopedcss"
          "lodash"
          "jquery"
          "ractive"
        ]

        deps: [
          "scopedcss": "ScopedCSS"
          "lodash": "_"
          "jquery": "jQuery"
          "ractive": "Ractive"
        ]

      files:
        "dist/webapp.js": "lib/index.js"
