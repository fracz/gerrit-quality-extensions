document.arrive(".com-google-gerrit-client-change-ReplyBox_BinderImpl_GenCss_style-label_name", {existing: true}, function () {
    var colors = {
        '-5': '#f1a0a0',
        '-4': '#f1b8b8',
        '-3': '#fbd0d0',
        '-2': '#f9e0e0',
        '-1': '#fee',
        '0': 'transparent',
        '+1': '#cfc'
    };

    var columns = this.parentNode.childNodes;
    var labelValues = this.parentNode.parentNode.childNodes[0].childNodes;
    var labelColumn = columns[columns.length - 1];
    var radios = [];
    for (var col = 1; col < columns.length - 1; col++) {
        var radio = columns[col].querySelector('input');
        if (radio) {
            radio.dispatchEvent(new MouseEvent('mouseover'));
            var radioLabel = labelColumn.innerHTML;
            var value = labelValues[col].innerHTML;
            radios.push({radio: radio, label: radioLabel, value: value.trim()});
        }
    }
    for (var col = 2; col < columns.length; col++) {
        columns[col].setAttribute('style', 'display: none');
    }
    columns[1].innerHTML = '';
    for (var index = 0; index < radios.length; index++) {
        var row = document.createElement('div');
        row.appendChild(radios[index].radio);
        var label = document.createElement('label');
        label.setAttribute('for', radios[index].radio.getAttribute('id'));
        label.innerHTML = radios[index].label + ' (' + radios[index].value  + ')';
        row.appendChild(label);
        row.setAttribute('style', 'background: ' + colors[radios[index].value]);
        columns[1].appendChild(row);
    }
});
