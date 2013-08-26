module.exports = ->
  modules = require "webapp-modules"

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
        unused: true
        undef: true
        proto: true

        globals:
          window: true
          document: true
          navigator: true
          define: true
          require: true

    modules:
      options:
        sourceFormat: "es6"
        mainConfigFile: "build/config.js"

        wrap:
          startFile: "build/start.js"
          endFile: "build/end.js"

      default:
        options:
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
        keepalive: true

        middleware: (connect) -> [
          modules "src", sourceFormat: "es6",
          modules "test/tests", sourceFormat: "es6",
          connect.static __dirname
        ]

      default: {}

    karma:
      options:
        basePath: process.cwd()
        singleRun: true

        frameworks: ["mocha"]
        reporters: ["progress", "webapp-coverage"]

        plugins: [
          "karma-webapp-coverage"
          "karma-mocha"
          "karma-phantomjs-launcher"
        ]

        proxies:
          "/base": "http://localhost:8000"

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
          "src/*.js": "webapp-coverage"

        coverageReporter:
          type: "html"
          dir: "test/reports/coverage/"

      default:
        options:
          browsers: ["PhantomJS"]

  # Plugins.
  @loadNpmTasks "grunt-contrib-clean"
  @loadNpmTasks "grunt-contrib-connect"
  @loadNpmTasks "grunt-contrib-copy"
  @loadNpmTasks "grunt-contrib-jshint"
  @loadNpmTasks "grunt-webapp-modules"
  @loadNpmTasks "grunt-karma"

  @registerTask "test", ["connect"]

  # Task.
  @registerTask "default", ["jshint", "clean", "modules"]
