module.exports = ->
  @loadTasks "build/tasks"
  @registerTask "default", ["synchronizer"]
