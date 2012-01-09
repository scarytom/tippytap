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
  var tippyTap = com.scarytom.TippyTap();

  function handleTap() {
    tippyTap.tap();
    var note = $("<span><span/>");
    note.text(tippyTap.lastTime());
    $("#main").append(note);
  }

  $(document).keypress(handleTap);
});
