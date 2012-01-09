describe("TippyTap", function() {
  var tippyTap;

  beforeEach(function() {
    tippyTap = com.scarytom.TippyTap();
  });

  it("should record the time of a tap", function() {
    tippyTap.tap();

    tippyTap.tap();

    var tapTimes = tippyTap.times();

    expect(tapTimes[1]).toBeGreaterThanOrEqualTo(tapTimes[0]);
  });
});
