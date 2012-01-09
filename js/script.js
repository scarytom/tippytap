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
             }
  };
}

$(document).ready(function() {
  var lastTap = new Date().getTime();

  function handleTap() {
    var tapTime = new Date().getTime(),
        note = $("<span><span/>");

    note.text(tapTime - lastTap);
    $("#main").append(note);
    lastTap = tapTime;
  }

  $(document).keypress(handleTap);
});
