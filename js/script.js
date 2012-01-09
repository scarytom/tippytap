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
  var tippyTap = com.scarytom.TippyTap(),
      soundChart = new SmoothieChart(),
      randomSeries = new TimeSeries(),
      tapSeries = new TimeSeries();

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

  setInterval(function() {
    randomSeries.append(new Date().getTime(), Math.random() * 10000);
  }, 500);
      
  soundChart.addTimeSeries(randomSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
  soundChart.addTimeSeries(tapSeries, { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.2)', lineWidth: 4 });
  soundChart.streamTo($("#soundChart").get(0), 50);
  $(document).keypress(handleTap);
});
