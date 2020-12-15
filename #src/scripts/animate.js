function animate({duration, draw}) {
  this.isStopAnim = false;
  let that = this;

  let start = performance.now();

  this.stopAnimation = function() {
      that.isStopAnim = true;
  }

  requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      timeFraction = Math.min(1, timeFraction);

      if(that.isStopAnim)
          timeFraction = 1;

      draw(timeFraction);

      if (timeFraction < 1) {
          requestAnimationFrame(animate);
      }
  });
}