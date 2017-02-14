(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var analyzerPluginsStyles, appendCustomJsScript, appendCustomStyle, initBadges, waitForAllScriptsToLoad, waitForJQuery;
    initBadges = function() {
      var Badge, Badges, CurrentUserDrawer, DeveloperData, DeveloperElement, PHP_TOOL_URL, Score, ScoreTable, StatsDrawer, attachTooltip, getUserProjects;
      attachTooltip = function(element, content) {
        $(element).tooltipster({
          theme: 'tooltipster-light',
          animation: 'grow',
          position: 'bottom',
          content: content,
          contentAsHTML: true
        });
        return $(element);
      };
      getUserProjects = function(stats) {
        var project, ref, results, total;
        ref = stats.ranking_projects || {};
        results = [];
        for (project in ref) {
          total = ref[project];
          if (total !== 0) {
            results.push(project);
          }
        }
        return results;
      };
      ScoreTable = function(achievements, project, projectTotal) {
        var a, achievement, j, k, l, len, len1, len2, ref, table;
        achievements = $.extend(true, [], achievements);
        if (project) {
          for (j = 0, len = achievements.length; j < len; j++) {
            achievement = achievements[j];
            achievement.times = ((ref = achievement.projects) != null ? ref[project] : void 0) || 0;
          }
        }
        for (k = 0, len1 = achievements.length; k < len1; k++) {
          a = achievements[k];
          a.total = Math.round(a.times * a.weight * 10) / 10;
        }
        achievements = (function() {
          var l, len2, results;
          results = [];
          for (l = 0, len2 = achievements.length; l < len2; l++) {
            a = achievements[l];
            if (a.times > 0) {
              results.push(a);
            }
          }
          return results;
        })();
        achievements.sort(function(a, b) {
          return b.total - a.total;
        });
        table = $("<table>");
        if (projectTotal) {
          table.append('<tr class="project-header"><td colspan="2">' + (project + " (" + projectTotal + ")</td></tr>"));
        }
        for (l = 0, len2 = achievements.length; l < len2; l++) {
          a = achievements[l];
          table.append("<tr><td>" + a.times + " " + a.label + "</td><td class=\"" + (a.total > 0 && 'plus' || 'minus') + "\">" + (a.total > 0 && '+' || '') + a.total + "</td></tr>");
        }
        return table;
      };
      Score = function(data) {
        var _, a, achievement, achievements, j, label, len, project, projects, ref, score, tooltipContent;
        score = $("<span>").addClass('score').text(data.ranking);
        projects = getUserProjects(data);
        if (projects.length > 0 && data.achievements) {
          ref = data.achievements;
          for (label in ref) {
            achievement = ref[label];
            achievement.label = label;
          }
          achievements = (function() {
            var ref1, results;
            ref1 = data.achievements;
            results = [];
            for (_ in ref1) {
              a = ref1[_];
              results.push(a);
            }
            return results;
          })();
          tooltipContent = $("<div>").addClass('score-tooltip');
          for (j = 0, len = projects.length; j < len; j++) {
            project = projects[j];
            tooltipContent.append(ScoreTable(achievements, project, projects.length > 1 && data.ranking_projects[project]));
          }
          attachTooltip(score, tooltipContent);
        }
        return score;
      };
      Badge = function(data, includeProjectNames) {
        var badge, bullets, j, len, li, name, p, projects, times, tooltipContent;
        if (includeProjectNames == null) {
          includeProjectNames = false;
        }
        badge = $("<a>").addClass('badge').attr('href', '#/x/analyzerPlugin/badges/');
        badge.append(data.awesomeFont);
        if (data.times > 1) {
          badge.append($("<sub>").text(data.times));
        }
        badge.attr('title', data.name);
        tooltipContent = $('<span>').addClass('badge-tooltip');
        tooltipContent.append($('<span class="badge-name">').text(data.name));
        tooltipContent.append($('<span class="badge-description">').text(data.description));
        projects = (function() {
          var ref, results;
          ref = data.projects;
          results = [];
          for (name in ref) {
            times = ref[name];
            if (times > 0) {
              results.push({
                name: name,
                times: times
              });
            }
          }
          return results;
        })();
        if (includeProjectNames) {
          projects.sort(function(a, b) {
            return b.times - a.times;
          });
          bullets = $('<ul class="badge-projects">');
          for (j = 0, len = projects.length; j < len; j++) {
            p = projects[j];
            li = $("<li>" + p.name + "</li>");
            if (p.times > 1) {
              li.append("<span> (" + p.times + " times)</span>");
            }
            bullets.append(li);
          }
          tooltipContent.append(bullets);
        }
        return attachTooltip(badge, tooltipContent);
      };
      Badges = function(stats) {
        var badgeData, badgeId, badges, ref, results, userProjects;
        if (Object.keys(stats.badges).length > 0) {
          userProjects = getUserProjects(stats);
          badges = $("<span>").addClass('badges');
          ref = stats.badges;
          results = [];
          for (badgeId in ref) {
            badgeData = ref[badgeId];
            results.push(badges.append(Badge(badgeData, userProjects.length > 1)));
          }
          return results;
        }
      };
      DeveloperElement = function(developer) {
        var avatar;
        if (!developer.stats) {
          return '';
        }
        if (developer.avatar) {
          avatar = $("<img>").addClass('avatar').attr('src', developer.avatar).attr('onerror', "$(this).css('display', 'none')");
        }
        return $("<span>").addClass('developer-stats').append(avatar).append(developer.name).append(Score(developer.stats)).append(Badges(developer.stats));
      };
      PHP_TOOL_URL = 'https://review-analyzer.fslab.agh.edu.pl';
      new (DeveloperData = (function() {
        DeveloperData.CACHE = {};

        function DeveloperData(developer1) {
          this.developer = developer1;
          this.ready = bind(this.ready, this);
        }

        DeveloperData.prototype.ready = function(callback) {
          if (DeveloperData.CACHE[this.developer.id]) {
            return callback(DeveloperData.CACHE[this.developer.id]);
          } else {
            return $.getJSON(PHP_TOOL_URL + "/review/api/badges/user/" + this.developer.email).done((function(_this) {
              return function(data) {
                return callback(DeveloperData.CACHE[_this.developer.id] = data);
              };
            })(this)).fail(function() {
              return callback(null);
            });
          }
        };

        return DeveloperData;

      })());
      setInterval((function() {
        return DeveloperData.CACHE = {};
      }), 60 * 5 * 1000);
      StatsDrawer = new ((function() {
        function _Class() {
          this.appendStatsTo = bind(this.appendStatsTo, this);
          this.addDeveloperToDraw = bind(this.addDeveloperToDraw, this);
          this.drawRankingStats = bind(this.drawRankingStats, this);
          this.drawListStats = bind(this.drawListStats, this);
          this.drawChangeDetailsStats = bind(this.drawChangeDetailsStats, this);
          this.drawStats = bind(this.drawStats, this);
          this.header = $("<div>").attr('id', 'analyzer-header');
          $("#gerrit_header").after(this.header);
          this.requestNumber = 0;
        }

        _Class.prototype.drawStats = function(retryCount) {
          var detectPageAndDraw;
          if (retryCount == null) {
            retryCount = 5;
          }
          this.header.children().remove();
          this.developersToDraw = {};
          detectPageAndDraw = (function(_this) {
            return function(retry) {
              _this.requestNumber++;
              if ($("#change_infoTable").length) {
                return _this.drawChangeDetailsStats();
              } else if ($(".changeTable .cOWNER .accountLinkPanel").length) {
                return _this.drawListStats();
              } else if ($(".ranking-badges").length) {
                return _this.drawRankingStats();
              } else {
                if (retry > 0) {
                  return setTimeout((function() {
                    return detectPageAndDraw(retry - 1);
                  }), 500);
                }
              }
            };
          })(this);
          return detectPageAndDraw(retryCount);
        };

        _Class.prototype.drawChangeDetailsStats = function() {
          var container, owner;
          owner = $(".com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-ownerPanel");
          this.addDeveloperToDraw({
            name: owner.find("a").text(),
            email: owner.find("a").attr('title'),
            avatar: owner.find("img").attr('src')
          });
          $("#change_infoTable .com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-label_user").each((function(_this) {
            return function(i, e) {
              e = $(e).clone();
              e.find("button").remove();
              return _this.addDeveloperToDraw({
                name: e.text(),
                email: e.attr('title').split(' ')[0],
                avatar: e.find('img').attr('src')
              });
            };
          })(this));
          container = $('<span>');
          $(".com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-changeExtension").append('<hr>').append(container);
          return this.appendStatsTo(container);
        };

        _Class.prototype.drawListStats = function() {
          $(".changeTable .cOWNER .accountLinkPanel").each((function(_this) {
            return function(i, e) {
              var element;
              element = $(e).clone();
              return _this.addDeveloperToDraw({
                name: element.find("a").text(),
                email: element.find("a").attr('title').match(/<(.+)>/)[1],
                avatar: element.find("img").attr('src')
              });
            };
          })(this));
          return this.appendStatsTo(this.header);
        };

        _Class.prototype.drawRankingStats = function() {
          return $(".ranking-badges").each((function(_this) {
            return function(i, element) {
              var email;
              email = $(element).attr('rel');
              return new DeveloperData({
                id: email,
                email: email
              }).ready(function(stats) {
                $(element).html('');
                return $(element).append(Score(stats)).append(Badges(stats));
              });
            };
          })(this));
        };

        _Class.prototype.addDeveloperToDraw = function(developer) {
          developer.id = developer.email;
          return this.developersToDraw[developer.id] = developer;
        };

        _Class.prototype.appendStatsTo = function(container) {
          var _, appendRequestNumber, developer, developersToFetch, draw, ref, results;
          appendRequestNumber = this.requestNumber;
          developersToFetch = Object.keys(this.developersToDraw).length;
          draw = (function(_this) {
            return function() {
              var _, developer, developers, j, len, results;
              developers = (function() {
                var ref, results;
                ref = this.developersToDraw;
                results = [];
                for (_ in ref) {
                  developer = ref[_];
                  results.push(developer);
                }
                return results;
              }).call(_this);
              developers.sort(function(a, b) {
                var ref, ref1;
                return ((ref = b.stats) != null ? ref.ranking : void 0) - ((ref1 = a.stats) != null ? ref1.ranking : void 0);
              });
              container.children().remove();
              results = [];
              for (j = 0, len = developers.length; j < len; j++) {
                developer = developers[j];
                results.push(container.append(DeveloperElement(developer)));
              }
              return results;
            };
          })(this);
          ref = this.developersToDraw;
          results = [];
          for (_ in ref) {
            developer = ref[_];
            results.push((function(_this) {
              return function(developer) {
                return new DeveloperData(developer).ready(function(stats) {
                  developer.stats = stats;
                  if (--developersToFetch <= 0 && appendRequestNumber === _this.requestNumber) {
                    return draw();
                  }
                });
              };
            })(this)(developer));
          }
          return results;
        };

        return _Class;

      })());
      CurrentUserDrawer = new ((function() {
        function _Class() {
          this.notifyAboutNewAchievements = bind(this.notifyAboutNewAchievements, this);
          this.prepareStatsToCompare = bind(this.prepareStatsToCompare, this);
          this.draw = bind(this.draw, this);
        }

        _Class.prototype.draw = function() {
          var developer, ref;
          this.email = (ref = Gerrit.getCurrentUser()) != null ? ref.email : void 0;
          if (this.email) {
            developer = {
              id: this.email,
              email: this.email
            };
            return new DeveloperData(developer).ready((function(_this) {
              return function(stats) {
                _this.currentStats = stats;
                _this.getContainer().children().remove();
                _this.getContainer().append(Score(stats));
                _this.getContainer().append(Badges(stats));
                if (!_this.notified) {
                  _this.notifyAboutNewAchievements();
                  return _this.notified = true;
                }
              };
            })(this));
          } else {
            return this.getContainer().children().remove();
          }
        };

        _Class.prototype.getContainer = function() {
          if ($('#currentUserBadges').length === 0) {
            $(".menuBarUserName").after('<span id="currentUserBadges" class="developer-stats">');
          }
          return $('#currentUserBadges');
        };

        _Class.prototype.prepareStatsToCompare = function(stats) {
          var achievement, achievementData, badge, badgeData, ref, ref1, result;
          if (stats == null) {
            stats = this.currentStats;
          }
          result = {
            email: this.email,
            score: stats.ranking,
            badges: {},
            achievements: {}
          };
          ref = stats.badges;
          for (badge in ref) {
            badgeData = ref[badge];
            result.badges[badge] = badgeData.times;
          }
          ref1 = stats.achievements;
          for (achievement in ref1) {
            achievementData = ref1[achievement];
            if (achievementData.weight > 0) {
              result.achievements[achievement] = achievementData.times;
            }
          }
          return result;
        };

        _Class.prototype.notifyAboutNewAchievements = function() {
          var aGain, achievement, achievements, bGain, badge, badges, icon, label, latestStats, message, ref, ref1, scoreGain, stats, times;
          if (this.currentStats) {
            stats = this.prepareStatsToCompare();
            latestStats = Cookies.getJSON('latestStats');
            if (latestStats && latestStats.email === this.email) {
              message = $("<span>");
              scoreGain = stats.score - latestStats.score;
              if (scoreGain > 0) {
                scoreGain = Math.round(scoreGain * 10) / 10;
                message.append($("<span>").addClass('score-gain').text('+' + scoreGain));
              }
              achievements = $("<ul>").addClass('achievements');
              ref = stats.achievements;
              for (achievement in ref) {
                times = ref[achievement];
                aGain = times - (latestStats.achievements[achievement] || 0);
                if (aGain > 0) {
                  achievements.append($("<li>").addClass('achievement').text("+" + aGain + " " + achievement));
                }
              }
              if (achievements.children().length) {
                message.append(achievements);
              }
              badges = $("<ul>").addClass('badges');
              ref1 = stats.badges;
              for (badge in ref1) {
                times = ref1[badge];
                bGain = times - (latestStats.badges[badge] || 0);
                if (bGain > 0) {
                  icon = this.currentStats.badges[badge].awesomeFont;
                  label = this.currentStats.badges[badge].name;
                  badges.append($("<li>").addClass('badge').html(icon + " " + label));
                }
              }
              if (badges.children().length) {
                message.append(badges);
              }
              if (message.children().length) {
                $.tinyNotice(message.html(), 'success', 8000);
              }
            }
            return Cookies.set('latestStats', stats, {
              expires: 2,
              path: '/'
            });
          }
        };

        return _Class;

      })());
      CurrentUserDrawer.draw();
      setInterval(CurrentUserDrawer.draw, 60 * 1000);
      Gerrit.on('history', CurrentUserDrawer.notifyAboutNewAchievements);
      Gerrit.on('history', StatsDrawer.drawStats);
      return StatsDrawer.drawStats(15);
    };
    appendCustomJsScript = function(url) {
      var script;
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      return $("head").append(script);
    };
    appendCustomStyle = function(url) {
      var style;
      style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = url;
      return $("head").append(style);
    };
    waitForAllScriptsToLoad = function() {
      if ($("<a>").tooltipster && $.tinyNotice && window.Cookies) {
        return initBadges();
      } else {
        return setTimeout(waitForAllScriptsToLoad, 100);
      }
    };
    waitForJQuery = function() {
      if (window.jQuery) {
        appendCustomJsScript('https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/js/jquery.tooltipster.min.js');
        appendCustomJsScript('https://gitcdn.xyz/repo/ebrahimiaval/tinyNotice/master/dist/tinyNotice.js');
        appendCustomJsScript('https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js');
        return waitForAllScriptsToLoad();
      } else {
        return setTimeout(waitForJQuery, 100);
      }
    };
    appendCustomJsScript('https://code.jquery.com/jquery-2.2.4.min.js');
    appendCustomStyle('https://gitcdn.xyz/repo/ebrahimiaval/tinyNotice/master/dist/tinyNotice-theme.css');
    appendCustomStyle('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    analyzerPluginsStyles = document.createElement('style');
    analyzerPluginsStyles.setAttribute('type', 'text/css');
    analyzerPluginsStyles.innerText = ".analyzer-panel {\n    border-spacing: 0px 5px;\n}\n\n.analyzer-runButton {\n    margin-top: 22px !important;\n    margin-left: 120px !important;\n}\n\n.analyzer-selectProject {\n    width: 350px !important;\n}\n\n.analyzer-dataRow {\n    border-collapse: separate;\n    border-spacing: 10px 5px;\n}\n\n.ranking-table > tbody > tr:first-child {\n    display: none;\n}\n\n.ranking-table img {\n    max-height: 20px\n}\n\n.ranking-table > tbody > tr:nth-child(2) {\n    background: gold;\n    font-size: 2em;\n}\n\n.ranking-table > tbody > tr:nth-child(2) img {\n    max-height: 40px;\n}\n\n.ranking-table > tbody > tr:nth-child(3) {\n    background: silver;\n    font-size: 1.7em;\n}\n\n.ranking-table > tbody > tr:nth-child(4) {\n    background: burlywood;\n    font-size: 1.3em;\n}\n\n.ranking-table td {\n    font-size: inherit;\n}\n\n.analyzer-popup {\n    width: 500px;\n    height: 500px;\n    left: 550px !important;\n    top: 200px !important;\n}\n\n.analyzer-popupPanel {\n    width: 480px;\n    height: 20px;\n}\n\n.analyzer-commentsList {\n    margin-left: 15px;\n}\n\n.analyzer-nodeGraph {\n    margin-left: 15px;\n}\n\n.developer-stats .score {\n    background: darkgreen;\n    font-weight: bold;\n    color: white;\n    border-radius: 5px;\n    padding: 1px 4px;\n    display: inline-block;\n    margin: 0 3px;\n    line-height: 1.2em;\n    font-size: 0.9em;\n    cursor: default;\n}\n\n.developer-stats .badge {\n    display: inline-block;\n    margin: 0 2px;\n    text-decoration: none;\n    outline: none;\n    color: inherit;\n}\n\n.developer-stats .badge sub {\n    font-weight: bold;\n}\n\n.developer-stats .avatar {\n    max-height: 15px;\n    margin-right: 3px;\n}\n\n#analyzer-header {\n    padding: 5px;\n    text-align: center;\n    font-size: 1.3em;\n}\n\n#analyzer-header .developer-stats {\n    display: inline-block;\n    margin: 5px 10px;\n}\n\n.com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-changeExtension .developer-stats {\n    display: block;\n    margin: 5px 0;\n}\n\n.score-tooltip tr.project-header {\n    font-weight: bold;\n    text-align: center;\n}\n\n.score-tooltip table {\n    margin-top: 5px;\n    padding-top: 5px;\n    width: 100%;\n}\n\n.score-tooltip table:first-child {\n    margin: 0;\n    padding: 0;\n}\n\n.score-tooltip .minus {\n    font-weight: bold;\n    color: darkred;\n}\n\n.score-tooltip .plus {\n    font-weight: bold;\n    color: darkgreen;\n}\n\n.menuBarUserNamePanel {\n    font-size: 15px;\n}\n\n@media screen and (max-width: 1370px) {\n    input.searchTextBox {\n        max-width: 300px;\n    }\n}\n\n.badge-tooltip .badge-name {\n    font-weight: bold;\n}\n\n.badge-tooltip > span {\n    display: block;\n}\n\n.badge-tooltip .badge-projects {\n    padding-left: 25px;\n    margin: 0;\n    margin-top: 5px;\n}\n\n.tinyNotice_status_success .score-gain {\n    display: block;\n    font-size: 2em;\n    font-weight: bold;\n    text-align: center;\n}\n\n.tinyNotice_status_success ul {\n    list-style-type:none;\n    padding: 0\n}\n\n.tinyNotice_status_success ul .fa {\n    color: white !important;\n    width:30px;\n    text-align: center\n}\n\n";
    document.head.append(analyzerPluginsStyles);
    return waitForJQuery();
  })();

}).call(this);
