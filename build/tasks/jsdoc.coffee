module.exports = ->
  @loadNpmTasks "grunt-jsdoc"

  @config "jsdoc",
    dist:
      src: ["lib/**/*.js"]

      options:
        destination: "doc"
