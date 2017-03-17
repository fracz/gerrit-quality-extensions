attachTooltip = (element, content) ->
  $(element).tooltipster?(
    theme: 'tooltipster-light'
    animation: 'grow'
    position: 'bottom'
    content: content
    contentAsHTML: yes
  )
  $(element)

getUserProjects = (stats) ->
  project for project, total of stats.ranking_projects or {} when total isnt 0

ScoreTable = (achievements, project, projectTotal) ->
  achievements = $.extend(yes, [], achievements) # deep copy
  if project
    achievement.times = achievement.projects?[project] or 0 for achievement in achievements
  a.total = Math.round(a.times * a.weight * 10) / 10 for a in achievements
  achievements = (a for a in achievements when a.times > 0)
  achievements.sort((a, b) -> b.total - a.total)
  table = $("<table>")
  if projectTotal
    table.append('<tr class="project-header"><td colspan="2">' + "#{project} (#{projectTotal})</td></tr>")
  for a in achievements
    table.append("<tr><td>#{a.times} #{a.label}</td><td class=\"#{a.total > 0 and 'plus' or 'minus'}\">#{a.total > 0 and '+' or ''}#{a.total}</td></tr>")
  table

Score = (data) ->
  score = $("<span>").addClass('score').text(data.ranking)
  projects = getUserProjects(data)
  if projects.length > 0 and data.achievements
    achievement.label = label for label, achievement of data.achievements
    achievements = (a for _, a of data.achievements)
    tooltipContent = $("<div>").addClass('score-tooltip')
    tooltipContent.append(ScoreTable(achievements, project, projects.length > 1 and data.ranking_projects[project])) for project in projects
    attachTooltip(score, tooltipContent)
  score

Badge = (data, includeProjectNames = false) ->
  badge = $("<span>").addClass('badge')
  #.attr('href', '#/x/analyzerPlugin/badges/')
  badge.append(data.awesomeFont)
  badge.append($("<sub>").text(data.times)) if data.times > 1
  badge.attr('title', data.name)
  tooltipContent = $('<span>').addClass('badge-tooltip')
  tooltipContent.append($('<span class="badge-name">').text(data.name))
  tooltipContent.append($('<span class="badge-description">').text(data.description))
  projects = ({name: name, times: times} for name, times of data.projects when times > 0)
  if includeProjectNames
    projects.sort((a, b) -> b.times - a.times)
    bullets = $('<ul class="badge-projects">')
    for p in projects
      li = $("<li>#{p.name}</li>")
      li.append("<span> (#{p.times} times)</span>") if p.times > 1
      bullets.append(li)
    tooltipContent.append(bullets)
  attachTooltip(badge, tooltipContent)

Badges = (stats) ->
  if Object.keys(stats.badges).length > 0
    userProjects = getUserProjects(stats)
    badges = $("<span>").addClass('badges')
    badges.append(Badge(badgeData, userProjects.length > 1)) for badgeId, badgeData of stats.badges

DeveloperElement = (developer) ->
  return '' if not developer.stats
  if developer.avatar
    avatar = $("<img>").addClass('avatar').attr('src', developer.avatar).attr('onerror', "$(this).css('display', 'none')")
  $("<span>").addClass('developer-stats')
  .append avatar
  .append developer.name
  .append Score(developer.stats)
  .append Badges(developer.stats)
