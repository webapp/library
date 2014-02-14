module.exports = ->
  @loadNpmTasks "grunt-synchronizer"

  @config "synchronizer",
    options:
      name: "WebApp"

    build:
      files:
        "out.js": "lib/index.js"
