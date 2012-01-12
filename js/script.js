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

$(document).ready(function() {
  "use strict";
  var tippyTap = com.scarytom.TippyTap(),
      soundChart = new SmoothieChart(),
      wavSeries = new TimeSeries(),
      tapSeries = new TimeSeries(),
      waveData = { "sampleRate": 1, "data": [] },
      origin = new Date().getTime();

  function handleTap() {
    var tapTime = new Date().getTime();
    tippyTap.tap();
    tapSeries.append(tapTime - 10, 0);
    tapSeries.append(tapTime, 10000);
    tapSeries.append(tapTime + 10, 0);
    var note = $("<span><span/>");
    note.text(tippyTap.lastTime());
    $("#main").append(note);
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
    wavSeries.append(new Date().getTime(), sample);
  }

  setInterval(plot, 30);
      
  soundChart.addTimeSeries(wavSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
  soundChart.addTimeSeries(tapSeries, { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.2)', lineWidth: 4 });
  soundChart.streamTo($("#soundChart").get(0), 50);

  $(document).keypress(handleTap);
  $("#files").change(fileSelected);
});
