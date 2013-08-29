module.exports = ->
  modules = require "webapp-modules"

  # Configuration.
  @initConfig

    clean: ["dist", "test/reports"]

    jshint:
      default: [
        "src/**/*.js"
        "!src/collection.js"
        "!src/history.js"
        "!src/model.js"
        "!src/router.js"
        "!src/sync.js"
      ]

      options:
        esnext: true
        eqnull: true
        boss: true
        undef: true
        proto: true

        globals:
          window: true
          document: true
          navigator: true
          define: true
          require: true
          __exports__: true

    modules:
      options:
        sourceFormat: "es6"
        mainConfigFile: "build/config.js"

        wrap:
          startFile: "build/start.js"
          endFile: "build/end.js"

      amd:
        options:
          targetFolder: "dist/"
          optimize: "none"
          out: "dist/webapp.js"

      bundled:
        options:
          optimize: "none"
          out: "dist/webapp.bundled.js"
          excludeShallow: []

    connect:
      options:
        base: "."

        middleware: (connect) -> [
          modules "src", sourceFormat: "es6",
          modules "test/tests", sourceFormat: "es6",
          connect.static __dirname
        ]

      default:
        options:
          keepalive: true

      test:
        options:
          keepalive: false

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
          { pattern: "dist/amd/**/*.js", included: false }
          { pattern: "vendor/**/*.js", included: false }
          { pattern: "build/**/*.js", included: false }

          "test/vendor/chai.js"
          "test/vendor/require.js"
          "test/test-runner.js"
        ]

        preprocessors:
          "dist/amd/*.js": "coverage"

        coverageReporter:
          type: "html"
          dir: "test/reports/coverage/"

      default:
        options:
          browsers: ["PhantomJS"]

  # Plugins.
  @loadNpmTasks "grunt-contrib-clean"
  @loadNpmTasks "grunt-contrib-connect"
  @loadNpmTasks "grunt-contrib-jshint"
  @loadNpmTasks "grunt-webapp-modules"
  @loadNpmTasks "grunt-karma"

  # Tasks.
  @registerTask "test", ["connect:test", "karma"]
  @registerTask "default", ["jshint", "clean", "modules", "test"]
