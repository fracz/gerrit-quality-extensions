$('.topmenuMenuLeft tr:first-child td.gwt-TabBarRest-wrapper').before("""
<td align="left" class="gwt-TabBarItem-wrapper" style="vertical-align: bottom;">
  <div tabindex="0" class="gwt-TabBarItem" role="tab">
    <div id="hall-of-fshame-link" class="gwt-Label" style="white-space: nowrap;">Hall Of FSHame</div>
  </div>
</td>
""")

hallElement = document.createElement('div')
hallElement.id = 'hall-of-fshame'
hallElement.innerHTML = """
    #=include HallOfFshame.html
    """
document.body.append(hallElement)
$('#hall-of-fshame').hide()

$("#hall-of-fshame-link").click ->
  $('#hall-of-fshame, #hall-of-fshame-loading').show()
  $('#hall-of-fshame-list').children().remove()

  $.getJSON("#{PHP_TOOL_URL}/review/api/badges/user")
  .done (data) =>
    $('#hall-of-fshame-loading').hide()
    data = data.filter((d) -> d.ranking != 0).sort (a, b) -> b.ranking - a.ranking
    for stats in data
      row = $('<div class="hall-of-fshame-item"></div>')
      row.append('<h4>' + stats.name + '</h4>')
      .append(Score(stats))
      .append(Badges(stats))
      $('#hall-of-fshame-list').append(row);

  .fail -> callback(null)

$("#hall-of-fshame-close").click(-> $('#hall-of-fshame').hide())
