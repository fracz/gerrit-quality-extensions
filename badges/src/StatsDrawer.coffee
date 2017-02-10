StatsDrawer = new class
  constructor: ->
    @header = $("<div>").attr('id', 'analyzer-header')
    $("#gerrit_header").after(@header)
    @requestNumber = 0

  drawStats: (retryCount = 5) =>
    @header.children().remove()
    @developersToDraw = {}
    detectPageAndDraw = (retry) =>
      @requestNumber++
      if $("#change_infoTable").length
        @drawChangeDetailsStats()
      else if $(".changeTable .cOWNER .accountLinkPanel").length
        @drawListStats()
      else if $(".ranking-badges").length
        @drawRankingStats()
      else
        setTimeout((=> detectPageAndDraw(retry - 1)), 500) if retry > 0
    detectPageAndDraw(retryCount)

  drawChangeDetailsStats: =>
    owner = $(".com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-ownerPanel")
    @addDeveloperToDraw
      name: owner.find("a").text()
      email: owner.find("a").attr('title')
      avatar: owner.find("img").attr('src')
    $("#change_infoTable .com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-label_user")
    .each (i, e) =>
      e = $(e).clone()
      e.find("button").remove()
      @addDeveloperToDraw
        name: e.text()
        email: e.attr('title').split(' ')[0]
        avatar: e.find('img').attr('src')
    container = $('<span>')
    $(".com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-changeExtension")
    .append('<hr>')
    .append(container)
    @appendStatsTo(container)

  drawListStats: =>
    $(".changeTable .cOWNER .accountLinkPanel").each (i, e) =>
      element = $(e).clone()
      @addDeveloperToDraw
        name: element.find("a").text()
        email: element.find("a").attr('title').match(/<(.+)>/)[1]
        avatar: element.find("img").attr('src')
    @appendStatsTo(@header)

  drawRankingStats: =>
    $(".ranking-badges").each (i, element) =>
      email = $(element).attr('rel')
      new DeveloperData({id: email, email: email}).ready (stats) =>
        $(element).html('')
        $(element)
        .append(Score(stats))
        .append(Badges(stats))

  addDeveloperToDraw: (developer) =>
    developer.id = developer.email
    @developersToDraw[developer.id] = developer

  appendStatsTo: (container) =>
    appendRequestNumber = @requestNumber
    developersToFetch = Object.keys(@developersToDraw).length
    draw = =>
      developers = (developer for _, developer of @developersToDraw)
      developers.sort (a, b) -> b.stats?.ranking - a.stats?.ranking
      container.children().remove()
      for developer in developers
        container.append DeveloperElement(developer)
    for _, developer of @developersToDraw
      do (developer) =>
        new DeveloperData(developer).ready (stats) =>
          developer.stats = stats
          draw() if --developersToFetch <= 0 and appendRequestNumber is @requestNumber
