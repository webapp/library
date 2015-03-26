module.exports = ->
  @loadNpmTasks "grunt-synchronizer"

  @config "synchronizer",
    options:
      name: "WebApp"

      paths:
        scopedcss: "node_modules/scopedcss/dist/scopedcss"
        underscore: "node_modules/underscore/underscore"
        jquery: "node_modules/jquery/dist/jquery"
        lodash: "node_modules/lodash/index"

    # Bundles all third party libraries necessary for this library to operate
    # at full potential.
    bundled:
      files:
        "dist/webapp.bundled.js": "lib/index.js"

    # A minimal build that only includes the official source code.
    default:
      options:
        name: "WebApp"

        exclude: [
          "scopedcss"
          "jquery"
          "underscore"
          "lodash"
        ]

        deps: [
          "scopedcss": "ScopedCSS"
          "underscore": "_"
          "lodash": "_"
          "jquery": "jQuery"
        ]

      files:
        "dist/webapp.js": "lib/index.js"
