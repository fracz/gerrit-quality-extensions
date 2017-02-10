CurrentUserDrawer = new class
  draw: =>
    @email = Gerrit.getCurrentUser()?.email
    if @email
      developer =
        id: @email
        email: @email
      new DeveloperData(developer).ready (stats) =>
        @currentStats = stats
        @getContainer().children().remove()
        @getContainer().append(Score(stats))
        @getContainer().append(Badges(stats))
        if not @notified
          @notifyAboutNewAchievements()
          @notified = yes
    else
      @getContainer().children().remove()

  getContainer: ->
    if $('#currentUserBadges').length is 0
      $(".menuBarUserName").after('<span id="currentUserBadges" class="developer-stats">')
    $('#currentUserBadges')

  prepareStatsToCompare: (stats = @currentStats) =>
    result =
      email: @email
      score: stats.ranking
      badges: {}
      achievements: {}
    for badge, badgeData of stats.badges
      result.badges[badge] = badgeData.times
    for achievement, achievementData of stats.achievements when achievementData.weight > 0
      result.achievements[achievement] = achievementData.times
    result

  notifyAboutNewAchievements: =>
    if @currentStats
      stats = @prepareStatsToCompare()
      latestStats = Cookies.getJSON('latestStats')
      if latestStats and latestStats.email is @email
        message = $("<span>")
        scoreGain = stats.score - latestStats.score
        if scoreGain > 0
          scoreGain = Math.round(scoreGain * 10) / 10
          message.append($("<span>").addClass('score-gain').text('+' + scoreGain))
        achievements = $("<ul>").addClass('achievements')
        for achievement, times of stats.achievements
          aGain = times - (latestStats.achievements[achievement] or 0)
          if aGain > 0
            achievements.append($("<li>").addClass('achievement').text("+#{aGain} #{achievement}"))
        message.append(achievements) if achievements.children().length
        badges = $("<ul>").addClass('badges')
        for badge, times of stats.badges
          bGain = times - (latestStats.badges[badge] or 0)
          if bGain > 0
            icon = @currentStats.badges[badge].awesomeFont
            label = @currentStats.badges[badge].name
            badges.append($("<li>").addClass('badge').html("#{icon} #{label}"))
        message.append(badges) if badges.children().length
        if message.children().length
          $.tinyNotice(message.html(), 'success', 8000)
      Cookies.set('latestStats', stats, {expires: 2, path: '/'})

CurrentUserDrawer.draw()
setInterval(CurrentUserDrawer.draw, 60 * 1000)
Gerrit.on('history', CurrentUserDrawer.notifyAboutNewAchievements)
