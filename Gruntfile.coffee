module.exports = ->
  @initConfig

    clean:
      pre: ["dist", "test/reports"]
      post: ["dist/src", "dist/vendor"]

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

    requirejs:
      options:
        mainConfigFile: "build/config.js"

        excludeShallow: [
          "jquery"
          "q"
          "ractive"
          "history"
        ]

        wrap:
          startFile: "build/start.js"
          endFile: "build/end.js"

      raw:
        options:
          optimize: "none"
          out: "dist/webapp.js"

      compressed:
        options:
          optimize: "uglify2"
          out: "dist/webapp.min.js"
          generateSourceMaps: true
          preserveLicenseComments: false

      bundled_raw:
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

  @loadNpmTasks "grunt-contrib-clean"
  @loadNpmTasks "grunt-contrib-copy"
  @loadNpmTasks "grunt-contrib-jshint"
  @loadNpmTasks "grunt-contrib-requirejs"
  @loadNpmTasks "grunt-karma"

  @registerTask "build", ["clean:pre", "copy", "requirejs:raw", "clean:post"]
  @registerTask "default", ["jshint", "build", "karma"]
