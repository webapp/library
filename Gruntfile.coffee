# Minimum version necessary to run these tasks is Grunt 0.4.
module.exports = ->

  # Initialize the configuration.
  @initConfig

    # Ensure the dist/ directory stays fresh.
    clean:
      default: ["dist", "test/reports"]

    # Lint source, node, and test code with some sane options.
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

    # Build out the library.
    requirejs:
      options:
        mainConfigFile: "build/config.js"
        name: "../build/almond"

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

    karma:
      options:
        basePath: process.cwd()
        singleRun: true

        frameworks: ["mocha"]
        reporters: ["progress", "coverage"]

        plugins: [
          "karma-coverage",
          "karma-mocha",
          "karma-phantomjs-launcher"
        ]

        files: [
          { pattern: "test/tests/**/*.js", included: false },
          { pattern: "src/**/*.js", included: false },
          { pattern: "vendor/**/*.js", included: false },
          { pattern: "build/**/*.js", included: false },

          "test/vendor/chai.js",
          "test/vendor/require.js",
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
  @loadNpmTasks "grunt-contrib-jshint"
  @loadNpmTasks "grunt-contrib-requirejs"
  @loadNpmTasks "grunt-karma"

  # Default task.
  @registerTask "default", ["clean", "jshint", "requirejs", "karma"]
