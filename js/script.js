com = {};
com.scarytom = {};

com.scarytom.TippyTap = function() {
  var origin = new Date().getTime(),
      times = [];

  return {
    "tap": function() {
             times.push(new Date().getTime() - origin);
           },
    "times": function() {
               return times;
             },
    "lastTime": function() {
                  return times[times.length - 1]
                }
  };
}

com.scarytom.Chart = function(chartElement) {
  var chartCanvas = $("<canvas id='soundChart' width='400' height='100'></canvas>"),
      chart = new SmoothieChart(),
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

  $(chartElement).append(chartCanvas);
  chart.addTimeSeries(wavSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
  chart.addTimeSeries(tapSeries, { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.2)', lineWidth: 4 });
  chart.streamTo(chartCanvas.get(0), 50);
  return {
    "tap": tap,
    "plot": plot
  };
}

$(document).ready(function() {
  "use strict";
  var tippyTap = com.scarytom.TippyTap(),
      chart = com.scarytom.Chart($("#graphsection")),
      waveData = { "sampleRate": 1, "data": [] },
      origin = new Date().getTime();

  function log(message) {
    $("#log").append($("<span></span>").text(message));
    $("#log").append($("<br/>"));
  }

  function handleTap() {
    tippyTap.tap();
    chart.tap();
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
