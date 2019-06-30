export default class SemiCircle {
  constructor(selector, config) {
    const { angle, color, radius, time, perimeter } = config;
    this.config = config;
    this.selector = selector;
    this.shouldUpdate = false;
    this.next = null;
    this.last = null;
  }
  init() {
    this.setTailLength();
    this.setSegment();
  }
  setTailLength() {
    const perimeter = this.config.perimeter;
    let last = 0;
    if (this.last) last = this.last.tailPosition;
    const anglePercent = this.config.angle / 360;
    const angleRadians = anglePercent * perimeter;
    this.angleRadian = angleRadians;
    this.tailPosition = angleRadians + last;
    this.currentTailPosition = 0;
  }
  setSegment() {
    const self = this;
    let last = 0;
    if (this.last) last = this.last.tailPosition;
    const rotationRadians = last / this.config.perimeter;
    const circle = $(`.${self.selector}`);
    console.log(circle, this.next);
    circle.attr("transform-origin", `50% 50%`);
    circle.attr("stroke", `${self.config.color}`);
    if (this.next) this.next.init();
  }
  relay() {
    const self = this;
    console.log(self.config.time);
    const duration = this.config.time * 1;
    $(`.${this.selector}`).animate(
      { strokeDashoffset: self.config.perimeter - self.angleRadian },
      {
        duration,
        specialEasing: { strokeDashoffset: "easeOutBounce" },
        complete: function() {
          self.next.animate();
        }
      }
    );
  }

  accordion() {
    console.log("accordion");
    const self = this;
    //Get percentage rotated
    let currentTail = 0;
    if (this.last) currentTail = this.last.currentTailPosition;
    // const circle = document.getElementById(this.selector);
    // const segment = circle.getAttribute('stroke-dashoffset')
    // const percent = (segment/this.config.perimeter) + currentTail;
    // this.currentTailPosition = percent
    // const rotation = lastTail/this.config.perimeter
    //Durations

    const duration = this.config.time * 1;
    console.log(self.config.perimeter - self.angleRadian);
    //Animation
    $(function() {
      $(`.${self.selector}`).animate(
        { strokeDashoffset: self.config.perimeter - self.angleRadian },
        {
          duration,
          specialEasing: { strokeDashoffset: "easeOutBounce" },
          queue: false,
          step: (now, fx) => {
            let currentTail = 0;
            if (self.last) currentTail = self.last.currentTailPosition;
            const segmentLength =
              (self.config.perimeter - now) / self.config.perimeter;
            const percent = segmentLength + currentTail;
            self.currentTailPosition = percent;
            if (self.next) {
              $(`.${self.next.selector}`).css(
                "transform",
                `rotate(${percent * 360}deg)`
              );
              self.next.updateRotation();
            }
          },
          complete: () => (self.shouldUpdate = true)
        }
      );
    });
    if (this.next) this.next.accordion();
  }

  //Update if previous node updates and not already animating
  updateRotation() {
    const self = this;
    if (this.shouldUpdate) {
      let currentTail = 0;
      if (this.last) currentTail = this.last.currentTailPosition;
      const percent = this.angleRadian / this.config.perimeter + currentTail;
      this.currentTailPosition = percent;
      if (this.next) {
        $(`.${self.next.selector}`).css(
          "transform",
          `rotate(${percent * 360}deg)`
        );
        this.next.updateRotation();
      }
    }
  }
}
