do ->
  initBadges = ->
    #=include html-elements.coffee
    #=include DeveloperData.coffee
    #=include StatsDrawer.coffee
    #=include CurrentUserDrawer.coffee

    Gerrit.on('history', StatsDrawer.drawStats)
    StatsDrawer.drawStats(15)

  appendCustomJsScript = (url) ->
    script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    $("head").append(script)

  appendCustomStyle = (url) ->
    style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = url
    $("head").append(style)

  waitForAllScriptsToLoad = ->
    if $("<a>").tooltipster and $.tinyNotice and window.Cookies
      initBadges()
    else
      setTimeout(waitForAllScriptsToLoad, 100)

  waitForJQuery = ->
    if window.jQuery
      appendCustomJsScript('https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/js/jquery.tooltipster.min.js')
      appendCustomJsScript('https://gitcdn.xyz/repo/ebrahimiaval/tinyNotice/master/dist/tinyNotice.js')
      appendCustomJsScript('https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js')
      waitForAllScriptsToLoad()
    else
      setTimeout(waitForJQuery, 100)

  appendCustomJsScript('https://code.jquery.com/jquery-2.2.4.min.js')
  appendCustomStyle('https://gitcdn.xyz/repo/ebrahimiaval/tinyNotice/master/dist/tinyNotice-theme.css')
  appendCustomStyle('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css')
  appendCustomStyle('https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/css/themes/tooltipster-shadow.min.css')

  analyzerPluginsStyles = document.createElement('style')
  analyzerPluginsStyles.setAttribute('type', 'text/css')
  analyzerPluginsStyles.innerText = """
    #=include analyzerPlugin.css
    """
  document.head.append(analyzerPluginsStyles)

  waitForJQuery()
