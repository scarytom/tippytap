com = {};
com.scarytom = {};

com.scarytom.TippyTap = function() {
  "use strict";
  var origin = 0,
      times = [ 0 ],
      intervals = [],
      intervalTotal = 0,
      firsttap = true;

  function calibrate() {
    origin = new Date().getTime();
    times.length = 1;
    intervals.length = 0;
    intervalTotal = 0;
  }

  function bpm(durationMillis) {
    if (durationMillis === 0) {
      return 0;
    }
    return (60000 / durationMillis).toFixed(3);
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

    var tapTime = new Date().getTime() - origin,
        interval = tapTime - lastTapTime();
    times.push(tapTime);
    intervals.push(interval);
    intervalTotal += interval;
  }

  function lastInterval() {
    return (intervals.length === 0) ? 0 : intervals[intervals.length - 1];
  }

  function averageInterval() {
    if (intervals.length === 0) {
      return 0;
    }
    return (intervalTotal / intervals.length).toFixed(3);
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
    "averageBpm": function() { return bpm(averageInterval()); },
    "reset": function() { firsttap = true; }
  };
}

com.scarytom.Chart = function(chartCanvasElement) {
  "use strict";
  var enabled = false,
      chart = new SmoothieChart({ "labels": { "disabled": true } }),
      tapSeries = new TimeSeries(),
      wavSeries = new TimeSeries();

  function tap() {
    var tapTime = new Date().getTime();
    tapSeries.append(tapTime - 10, 0);
    tapSeries.append(tapTime, 10000);
    tapSeries.append(tapTime + 10, 0);
  }

  function plot(time, value) {
    if (enabled) {
      wavSeries.append(time, value);
    }
  }

  function setEnableState(state) {
    enabled = state;
    $(chartCanvasElement).toggle(enabled);
    if (enabled) {
      chart.streamTo(chartCanvasElement, 50);
    }
  }

  chart.addTimeSeries(wavSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
  chart.addTimeSeries(tapSeries, { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.2)', lineWidth: 4 });
  return {
    "tap": tap,
    "plot": plot,
    "enable": setEnableState
  };
}

$(document).ready(function() {
  "use strict";
  var tippyTap = com.scarytom.TippyTap(),
      chart = com.scarytom.Chart($("#sound-chart-canvas").get(0)),
      waveData = { "sampleRate": 1, "data": [] },
      origin = new Date().getTime();

  function log(message) {
    $("#log").prepend($("<br/>"));
    $("#log").prepend($("<span></span>").text(message));
  }

  function handleKeypress(e) {
    if ((e && e.which === 32) || (window.event && window.event.keyCode === 32)) {
      handleTap();
    }
  }

  function handleTap() {
    tippyTap.tap();
    chart.tap();
    $("#interTap").val(tippyTap.lastBpm());
    $("#aveInterTap").val(tippyTap.averageBpm());

    var row = $("<tr></tr>");
    row.append($("<td></td>").text(tippyTap.tapCount()));
    row.append($("<td></td>").text(tippyTap.lastTime()));
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

  function clear() {
    $("#interTap").val(0);
    $("#aveInterTap").val(0);
    $("#analysis-data").empty();
    $("#log").empty();
    tippyTap.reset();
    $("#interTap").focus();
  }

  chart.enable(false);
  clear();
  //setInterval(plot, 30);
  $(document).keypress(handleKeypress);
  $("#files").change(fileSelected);
  $("#restart-button").click(clear);
  $("#graph-enabled").change(function() {
    chart.enable($("#graph-enabled").prop("checked"));
    $("#interTap").focus();
  });
});
