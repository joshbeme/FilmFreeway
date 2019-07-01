export default class SemiCircle {
  constructor(className, config) {
    this.config = config;
    this.className = className;
    this.selector = $(`.${className}`);
    this.init();

    this.next = null;
    this.last = null;
  }
  init() {
    this.shouldUpdate = false;
    this.angleRadian = null;
    this.arcLength = null;
    this.currentArcLength = null
    this.currentArcLength = 0;

  }


//Reset node's svg element
  reset(){
    this.setSegment();
    if(this.next)this.next.reset();
  };
  setSegment() {
    this.setLengths();
   
    const circle = this.selector
    const {color, radius, perimeter} = this.config;

    //Reset svg element
    circle.css("transform-origin", `50% 50%`);
    circle.css("stroke", `${color}`);
    circle.css("r", "" + radius);
    circle.css("stroke-dasharray", "" + perimeter);
    circle.css("stroke-dashoffset", "" + perimeter);
    circle.css("transform", "rotate(0deg)");
  };
  setLengths() {
    const perimeter = this.config.perimeter;
    let last = 0;
    if (this.last) last = this.last.arcLength;
    const anglePercent = this.config.angle / 360;
    const angleRadians = anglePercent * perimeter;
    this.angleRadian = angleRadians;

    //Percentage of current segment plus all previous segments
    this.arcLength = anglePercent + last;
  };


//Svg animations
  relay() {
    const self = this;

    //Length of arc to this segment
    let tail = 0 ;
    if(this.last)tail = this.last.arcLength;

    const duration = this.config.time;
    const selector = this.selector;
    const endState = self.config.perimeter - self.angleRadian;
    selector.animate(
      { strokeDashoffset: endState },
      {
        duration,
        specialEasing: { strokeDashoffset: "easeOutBounce" },
        start: function(){
          selector.css('transform', `rotate(${tail * 360}deg)`)
        },
        complete: function() {
          if(self.next)self.next.relay();
        }
      }
    );
  };
  accordion() {
    const self = this;

    const duration = this.config.time;
    const endState = this.config.perimeter - this.angleRadian
    $(function(){
      self.selector.animate(
        { strokeDashoffset: endState },
        {
          duration,
          specialEasing: { strokeDashoffset: "easeOutBounce" },
          queue: false,
          step: (now, fx) => {

            //Get length of all previous nodes plus self and set new current length
            let currentTail = 0;
            if (self.last) currentTail = self.last.currentArcLength;
            const segmentLength = (self.config.perimeter - now) / self.config.perimeter;
            const percent = segmentLength + currentTail;
            self.currentArcLength = percent;

            //Update next nodes rotation position due to self changing
            if (self.next) {
              self.next.selector.css(
                "transform",
                `rotate(${percent * 360}deg)`
              );
              self.next.updateRotation();
            }
          },
          //If not animating use update rotation to update rotation
          complete: () => self.shouldUpdate = true
        }
      );
    });
    if (this.next) this.next.accordion();
  };
  stop(){
    this.selector.stop();
    if(this.next)this.next.stop();
  };


//Update if previous node updates and not already animating
  updateRotation() {
    const self = this;
    if (this.shouldUpdate) {
      
      let currentTail = 0;
      if (this.last) currentTail = this.last.currentArcLength;
      const percent = this.angleRadian / this.config.perimeter + currentTail;
      this.currentArcLength = percent;
      //Set next nodes rotation amount
      if (this.next) {
        self.next.selector.css(
          "transform",
          `rotate(${percent * 360}deg)`
        );
        this.next.updateRotation();
      }
    }
  };
}
