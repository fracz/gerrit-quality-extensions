Gerrit.install (plugin) ->
  initBadges = ->
    #=include html-elements.coffee
    #=include DeveloperData.coffee
    #=include StatsDrawer.coffee
    #=include CurrentUserDrawer.coffee

    Gerrit.on('history', StatsDrawer.drawStats)
    StatsDrawer.drawStats(15)

  addScriptThatRequiresJQuery = (url) ->
    script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    $("head").append(script)

  hideProjectMenuOptionsIfNoProject = ->
    if document.cookie.indexOf("analyzer-project-name") < 0
      $("a.menuItem[href*=analyzerPlugin]").each ->
        if $(this).text().trim() not in ['Badges', 'Choose']
          $(this).hide()

  waitForAllScriptsToLoad = ->
    if $("<a>").tooltipster and $.tinyNotice
      hideProjectMenuOptionsIfNoProject()
      initBadges()
    else
      setTimeout(waitForAllScriptsToLoad, 100)

  waitForJQuery = ->
    if window.jQuery
      addScriptThatRequiresJQuery('https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/js/jquery.tooltipster.min.js')
      addScriptThatRequiresJQuery("/plugins/#{plugin.getPluginName()}/static/tinyNotice/tinyNotice.js")
      waitForAllScriptsToLoad()
    else
      setTimeout(waitForJQuery, 100)
  waitForJQuery() # jQuery is loaded after the plugin JS
