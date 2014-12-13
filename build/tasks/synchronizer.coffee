module.exports = ->
  @loadNpmTasks "grunt-synchronizer"

  @config "synchronizer",
    options:
      name: "WebApp"

      paths:
        scopedcss: "../node_modules/scopedcss/dist/scopedcss"
        lodash: "../node_modules/lodash/dist/lodash"
        jquery: "../node_modules/jquery/dst/jquery"
        ractive: "../node_modules/ractive/ractive"

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
