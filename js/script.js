com = {};
com.scarytom = {};

com.scarytom.TippyTap = function() {
  var origin,
      times,
      intervals,
      firsttap = true;

  function calibrate() {
    origin = new Date().getTime();
    times = [ 0 ];
    intervals = [];
  }

  function bpm(durationMillis) {
    if (durationMillis === 0) {
      return 0;
    }
    return 60000 / durationMillis;
  }

  function lastTapTime() {
    return times[times.length - 1];
  }

  function tap() {
    if (firsttap) {
      firsttap = false;
      calibrate();
      return;
    }

    var tapTime = new Date().getTime() - origin;
    intervals.push(tapTime - lastTapTime());
    times.push(tapTime);
  }

  function lastInterval() {
    return (intervals.length === 0) ? 0 : intervals[intervals.length - 1];
  }

  function averageInterval() {
    if (intervals.length === 0) {
      return 0;
    }

    var total = 0;
    $.each(intervals, function(index, interval) {
      total += interval;
    });

    return total / intervals.length;
  }

  calibrate();
  return {
    "tap": tap,
    "times": function() { return times; },
    "tapCount": function() { return times.length; },
    "averageInterval": averageInterval,
    "lastInterval": lastInterval,
    "lastTime": lastTapTime,
    "lastBpm": function() { return bpm(lastInterval()); },
    "averageBpm": function() { return bpm(averageInterval()); }
  };
}

com.scarytom.Chart = function(chartCanvasElement) {
  var chart = new SmoothieChart({ "labels": { "disabled": true } }),
      tapSeries = new TimeSeries(),
      wavSeries = new TimeSeries();

  function tap() {
    var tapTime = new Date().getTime();
    tapSeries.append(tapTime - 10, 0);
    tapSeries.append(tapTime, 10000);
    tapSeries.append(tapTime + 10, 0);
  }

  function plot(time, value) {
    wavSeries.append(time, value);
  }

  chart.addTimeSeries(wavSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
  chart.addTimeSeries(tapSeries, { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.2)', lineWidth: 4 });
  chart.streamTo(chartCanvasElement.get(0), 50);
  return {
    "tap": tap,
    "plot": plot
  };
}

$(document).ready(function() {
  "use strict";
  var tippyTap = com.scarytom.TippyTap(),
      chart = com.scarytom.Chart($("#sound-chart-canvas")),
      waveData = { "sampleRate": 1, "data": [] },
      origin = new Date().getTime();

  function log(message) {
    $("#log").prepend($("<br/>"));
    $("#log").prepend($("<span></span>").text(message));
  }

  function handleTap() {
    tippyTap.tap();
    chart.tap();
    $("#interTap").val(tippyTap.lastBpm());
    $("#aveInterTap").val(tippyTap.averageBpm());

    var row = $("<tr></tr>");
    row.append($("<td></td>").text(tippyTap.tapCount()));
    row.append($("<td></td>").text(tippyTap.lastInterval()));
    row.append($("<td></td>").text(tippyTap.lastBpm()));
    row.append($("<td></td>").text(tippyTap.averageBpm()));

    $("#analysis-data").prepend(row);
    log(tippyTap.lastTime());
  }

  function fileSelected(evt) {
    var reader = new FileReader();
    reader.onload = function(f) {
      var wavefile = f.target.result;

      alert("loaded");
      origin = new Date().getTime();
      //waveData = PCMData.decode(wavefile);
    };
    reader.readAsBinaryString(evt.target.files[0]);
  }

  function plot() {
    var time = new Date().getTime(),
        offset = time - origin,
        sampleNo = Math.ceil(waveData.sampleRate * offset / 1000),
        sample = waveData.data[sampleNo];
    sample = sample ? sample : 0;
    chart.plot(new Date().getTime(), sample);
  }

  setInterval(plot, 30);
  $(document).keypress(handleTap);
  $("#files").change(fileSelected);
});
