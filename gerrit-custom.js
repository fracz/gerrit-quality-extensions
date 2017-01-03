document.arrive("td.com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-labelName", {existing: true}, function() {
  if (this.innerText.indexOf("Ocena-Kodu") >= 0) {
    this.parentNode.remove();
  }
});
document.arrive(".com-google-gerrit-client-change-Message_BinderImpl_GenCss_style-summary, [stylename=com-google-gerrit-client-change-Message_BinderImpl_GenCss_style-comment] p", {existing: true}, function() {
  if (this.innerText.indexOf("Ocena-Kodu") >= 0) {
    this.innerText = this.innerText.replace(/-?Ocena-Kodu[+0-9]*/, '');
  }
});
document.arrive("td[title=Ocena-Kodu]", {existing: true}, function() {
  var el = this;
  var index = (function(){ 
    for(var i = 0, max = el.parentNode.childNodes.length; i < max; i++)
    if(el.parentNode.childNodes[i] == el) return i;
  })();
  document.querySelectorAll("table.changeTable td:nth-child(" + (index + 1) + ")").forEach(function(e) { e.remove(); });
});
