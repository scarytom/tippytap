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
