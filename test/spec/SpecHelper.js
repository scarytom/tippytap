beforeEach(function() {
  this.addMatchers({
    toBeGreaterThanOrEqualTo: function(expected) {
      return this.actual >= expected;
    }
  });  
});
