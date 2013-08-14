# Minimum version necessary to run these tasks is Grunt 0.4.
module.exports = ->

  @initConfig

    clean:
      pre: ["dist", "test/reports"]
      post: ["dist/src", "dist/vendor"]

    # Copy over source files so that source maps are built correctly.
    copy:
      default:
        files: [
          { src: "src/**", dest: "dist/" }
          { src: "vendor/**", dest: "dist/" }
        ]

    jshint:
      default: [
        "src/**/*.js"
        "!src/collection.js"
        "!src/history.js"
        "!src/model.js"
        "!src/router.js"
        "!src/sync.js"
      ]

      # Allow ES5 so that `delete` may be used as an identifer.
      options:
        es5: true
        eqnull: true
        boss: true
        proto: true

    requirejs:
      options:
        mainConfigFile: "build/config.js"

        # Do not bundle any internal dependencies by default.
        excludeShallow: [
          "jquery"
          "q"
          "ractive"
          "scopedcss"
          "history"
        ]

        wrap:
          startFile: "build/start.js"
          endFile: "build/end.js"

      uncompressed:
        options:
          optimize: "none"
          out: "dist/webapp.js"

      compressed:
        options:
          optimize: "uglify2"
          out: "dist/webapp.min.js"
          generateSourceMaps: true
          preserveLicenseComments: false

      bundled_uncompressed:
        options:
          optimize: "none"
          out: "dist/webapp.bundled.js"
          excludeShallow: []

      bundled_compressed:
        options:
          optimize: "uglify2"
          out: "dist/webapp.bundled.min.js"
          generateSourceMaps: true
          preserveLicenseComments: false
          excludeShallow: []

    karma:
      options:
        basePath: process.cwd()
        singleRun: true

        frameworks: ["mocha"]
        reporters: ["progress", "coverage"]

        plugins: [
          "karma-coverage"
          "karma-mocha"
          "karma-phantomjs-launcher"
        ]

        files: [
          { pattern: "test/tests/**/*.js", included: false },
          { pattern: "src/**/*.js", included: false },
          { pattern: "vendor/**/*.js", included: false },
          { pattern: "build/**/*.js", included: false },

          "test/vendor/chai.js"
          "test/vendor/require.js"
          "test/test-runner.js"
        ]

        preprocessors:
          "src/**/*.js": "coverage"

        coverageReporter:
          type: "html"
          dir: "test/reports/coverage/"

      default:
        options:
          browsers: ["PhantomJS"]

  # Load external Grunt task plugins.
  @loadNpmTasks "grunt-contrib-clean"
  @loadNpmTasks "grunt-contrib-copy"
  @loadNpmTasks "grunt-contrib-jshint"
  @loadNpmTasks "grunt-contrib-requirejs"
  @loadNpmTasks "grunt-karma"

  # Default task.
  @registerTask "default", [
    "clean:pre", "copy", "jshint", "requirejs:uncompressed", "clean:post", "karma"
  ]
