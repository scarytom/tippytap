describe("TippyTap", function() {
  var tippyTap;

  beforeEach(function() {
    tippyTap = com.scarytom.TippyTap();
  });

  it("should record the time of all taps to date", function() {
    tippyTap.tap();
    tippyTap.tap();

    var tapTimes = tippyTap.times();
    expect(tapTimes[1]).toBeGreaterThanOrEqualTo(tapTimes[0]);
  });

  it("should record the time of the last tap", function() {
    tippyTap.tap();
    tippyTap.tap();

    expect(tippyTap.lastTime()).toEqual(tippyTap.times()[1]);
  });
});
