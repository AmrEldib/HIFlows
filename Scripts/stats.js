/// <reference path="jquery-2.1.1.min.js" />
/// <reference path="bootstrap.min.js" />
/// <reference path="chartist.min.js" />

Number.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

$.getJSON("data.json", function (showData) {

    var labels = [];
    var seriesData = [];
    showData.episodes.forEach(function (episode) {
        labels.push(episode.id);
        seriesData.push(episode.length);
    });

    // As options we currently only set a static size of 300x200 px
    var options = {
        axisX: {
            showLabel: true
        },
        axisY: {
            labelInterpolationFnc: function (value) {
                return value.toHHMMSS();
            }
        }
    };

    new Chartist.Line('.ct-chart', {
        labels: labels,
        series: [
          {
              name: 'Hello Internet',
              data: seriesData
          }
        ]
    }, options);

    var easeOutQuad = function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };

    var $chart = $('.ct-chart');

    var $tooltip = $('<div class="tooltip tooltip-hidden"></div>').appendTo($('.ct-chart'));

    $chart.on('mouseenter', '.ct-point', function () {
        var $point = $(this),
          value = $point.attr('ct:value'),
          seriesName = $point.parent().attr('ct:series-name');

        $point.animate({ 'stroke-width': '50px' }, 300, easeOutQuad);
        $tooltip.text(seriesName + ': ' + value.toHHMMSS());
        $tooltip.removeClass('tooltip-hidden');
    });

    $chart.on('mouseleave', '.ct-point', function () {
        var $point = $(this);

        $point.animate({ 'stroke-width': '15px' }, 300, easeOutQuad);
        $tooltip.addClass('tooltip-hidden');
    });

    $chart.on('mousemove', function (event) {
        $tooltip.css({
            left: (event.offsetX || event.originalEvent.layerX) - $tooltip.width() / 2,
            top: (event.offsetY || event.originalEvent.layerY) - $tooltip.height() - 20
        });
    });
});