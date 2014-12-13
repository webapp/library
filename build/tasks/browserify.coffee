module.exports = ->
  @loadNpmTasks "grunt-browserify"

  @config "browserify",
    options:
      transform: ["deamdify"]

      browserifyOptions:
        standalone: "WebApp"

    modern:
      options:
        "ignore": ["lib/support/**/*.js"]

      files:
        "dist/webapp.js": ["lib/index.js"]

    legacy:
      files:
        "dist/webapp.legacy.js": ["lib/index.js"]
