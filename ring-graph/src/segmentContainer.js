import Segment from "./segment";

/**
 * Container for linked list. Organizes state.
 * 
 * @param {Node} segmentSelectors Table body holding graph values
 */

//Implemented as a doubley linked list
export default class Circle {
  constructor(segmentSelectors) {
    this.segmentSelectors = segmentSelectors.children;
    this.segments = [];
    this.headNode = null;
    this.accordionLength = 0;
    this.relayLength = 0;
    this.init();
  }

//Initialize linked list
  init() {
    //Hold context
    const self = this;

    //Add event listeners and calls using class context
    $("#launch").click(() => this.launch.call(self));
    $("#stop").click(() => this.stop.call(self));

    //Container selector
    const svgSelector = document.querySelector("#graph");

    //Previous node
    let last = null;

    //Make segments more usable
    this.segmentSelectors = Array.from(this.segmentSelectors);
    this.segmentSelectors.shift();

    //Instantiate node/svg
    for (let i = 0; i < this.segmentSelectors.length; i++) {

      //Create node's svg
      const className = "circle" + i;
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", "50%");
      circle.setAttribute("cy", "50%");
      circle.setAttribute("stroke-width", "40");
      circle.setAttribute("fill", "none");
      circle.setAttribute("class", className);

      //Insert svg element
      svgSelector.appendChild(circle);

      //Create node and add to linked list
      const segment = new Segment(className, {});
      this.segments.push(segment);
      if (last) last.next = segment;
      segment.last = last;
      last = segment;
    }
    //Initialize all nodes state
    this.headNode = this.segments[0];
    this.headNode.init();
  }


//Button functions
  launch() {
    const stop = $("#stop");
    const launch = $("#launch");    

    //Reset any unorganized state
    this.resetState();
    //Disable launch button enable stop button
    launch.attr("disabled", true);
    stop.attr("disabled", false);
    //Animate accordion or relay
    const isAccordion = $("#accordion").is(":checked");
    if (isAccordion) {
      this.animateAccordion();

      this.timeOut = setTimeout(() => {
        this.originalButtonState();
      }, this.accordionLength);
    } else {
      this.animateRelay();

      this.timeOut = setTimeout(() => {
        this.originalButtonState();
      }, this.relayLength);
    }
  }
  stop() {
    clearTimeout(this.timeOut);
    this.originalButtonState();
    this.headNode.stop();
  }

//Animation functions
  animateAccordion() {
    this.headNode.accordion();
  }
  animateRelay() {
    this.headNode.relay();
  }


//Utility functions
  getRowInputs(array) {
    const self = this;
    return array.reduce((acc, selector) => {
      const regex = /^data-*/;

      //Find each input
      const input = self.recursivlyFindInput(selector);

      //Find name of input
      const attributeNames = input.getAttributeNames();
      const dataType = attributeNames.find(ele => regex.test(ele));
      const typeExtract = dataType.replace("data-", "");

      //Map input
      acc[typeExtract] = input.value;
      return acc;
    }, {});
  };
  resetState(){
    const self = this;

    //Clear any timeout still active
    clearTimeout(this.timeOut);

    //reset animation lengths
    this.accordionLength = 0;
    this.relayLength = 0;

    //Get new  LL node configurations
    this.segmentSelectors.forEach((segment, index) => {
      const config = self.getRowInputs(Array.from(segment.children));
      config.perimeter = self.calculatePerimeter(config.radius);
      const time = Number(config.time);
      config.time = time;
      self.segments[index].config = config;
     
      //Set animation length
      if (config.time > self.accordionLength)self.accordionLength = time;
      self.relayLength += time;
    });

    //Reset all nodes svg segment
    this.headNode.reset();
  }
  recursivlyFindInput(selector) {
    return selector.hasChildNodes()
      ? this.recursivlyFindInput(selector.children[0])
      : selector;
  };
  calculatePerimeter(radius) {
    return 2 * radius * Math.PI;
  };
  originalButtonState(){
    $("#launch").attr("disabled", false);
    $("#stop").attr("disabled", true);
  }
}
