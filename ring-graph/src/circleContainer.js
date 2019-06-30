import Segment from "./segment";
export default class Circle {
  constructor(radius, semiCircleSelectors) {
    this.semiCircleSelectors = semiCircleSelectors;
    this.semiCircles = [];
    this.radius = radius;
    console.log('something')
    this.init();
  }
  //Creates DOM nodes/linked list nodes
  init() {
    this.calculatePerimeter(this.radius);
    const self = this;
    const svgSelector = document.querySelector("#graph");
    let last = null
        
    //Iterate through rows.
    for (let i = 1; i < this.semiCircleSelectors.length; i++) {
      //Iterate and reduce row collumns state
      const collumnState = Array.from(this.semiCircleSelectors[i].children);
      const config = collumnState.reduce(
        (acc,
        selector)=> {
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
        },
        {}
      );
      //Create LL node's circle svg
      const className = "circle" + i
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", "50%");
      circle.setAttribute("cy", "50%");
      circle.setAttribute("r", "" + self.radius);
      circle.setAttribute("stroke-width", "40");
      circle.setAttribute("stroke-dasharray", "" + self.perimeter);
      circle.setAttribute("stroke-dashoffset", "" + self.perimeter);
      circle.setAttribute("fill", "none");
      circle.setAttribute("class", className);
      //Insert node
      svgSelector.appendChild(circle);
      //Query node
      const segment = new Segment(className, {...config, perimeter: self.perimeter})
      this.semiCircles.push(segment)
      if(last) last.next = segment;
      segment.last = last;
      last = segment;
      // console.log(segment);
    }
    // console.log(this.semiCircles[0])
    this.renderLL();
  }
  renderLL(){
    const head = this.semiCircles[0];
    head.init();
    head.accordion();

  }
  calculatePerimeter(radius) {
    this.perimeter = 2 * radius * Math.PI;
  }
  animateAccordion() {
    this.animationLoop()
  }
  animateRelay() {
  }
  animationLoop() {
    const self = this;
    console.log('first')
    const head = this.semiCircles[0];
    head.updateRotation()
  }
  cancel(){
    cancelAnimationFrame();
  }
  recursivlyFindInput(selector) {
    return selector.hasChildNodes()
      ? this.recursivlyFindInput(selector.children[0])
      : selector;
  }
}
