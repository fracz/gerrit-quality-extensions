PHP_TOOL_URL = 'https://review-analyzer.fslab.agh.edu.pl'

new class DeveloperData
  @CACHE = {}

  constructor: (@developer) ->

  ready: (callback) =>
    if DeveloperData.CACHE[@developer.id]
      callback(DeveloperData.CACHE[@developer.id])
    else
      $.getJSON("#{PHP_TOOL_URL}/review/api/badges/user/#{@developer.email}")
      .done (data) =>
        callback(DeveloperData.CACHE[@developer.id] = data)
      .fail -> callback(null)

setInterval((-> DeveloperData.CACHE = {}), 60 * 5 * 1000)
