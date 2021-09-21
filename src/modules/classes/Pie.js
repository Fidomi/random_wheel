import { Colors } from "./Colors.js";

export class Pie extends Colors {
  constructor(canvas, maxNumber, numberOfSlices) {
    super(maxNumber, numberOfSlices);
    this.canvas = canvas;
    this.radius =
      this.canvas.width < this.canvas.height
        ? this.canvas.width / 2.1
        : this.canvas.height / 2.1;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.setNumberOfSlices(numberOfSlices);
    this.startAngle = (3 * Math.PI) / 2;
    this.endAngle = (3 * Math.PI) / 2 + this.getSliceAngle();
    this.setSliceAngle(numberOfSlices);
    this.angleRotation = 0.35;
  }

  //GETTERS
  getSliceAngle() {
    return this.sliceAngle;
  }
  getNumberOfSlices() {
    return this.numberOfSlices;
  }

  //SETTERS
  setSliceAngle(numberOfSlices) {
    this.sliceAngle = (Math.PI * 2) / numberOfSlices;
  }

  setNumberOfSlices(num) {
    if (typeof num == "number" && num != "") {
      this.numberOfSlices = Math.floor(num);
    } else {
      throw new Error("Number of slices must be an integer above 0.");
    }
  }

  //METHODS
  static drawPointerGuide(canvas) {
    let drawPointery = 45;
    canvas.ctx.fillStyle = "#000000";
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(canvas.width / 2 - 20, 0);
    canvas.ctx.lineTo(canvas.width / 2 + 20, 0);
    canvas.ctx.lineTo(canvas.width / 2, drawPointery);
    canvas.ctx.closePath();
    canvas.ctx.fill();
    return [canvas.width / 2, drawPointery];
  }

  static getColorIndicesForCoord(drawPointerx, drawPointery, width) {
    let red = drawPointery * (width * 4) + drawPointerx * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  drawPieSlice(color) {
    this.canvas.ctx.fillStyle = color;
    this.canvas.ctx.strokeStyle = color;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.centerX, this.centerY);
    this.canvas.ctx.arc(
      this.centerX,
      this.centerY,
      this.radius,
      this.startAngle,
      this.endAngle,
      false
    );
    this.canvas.ctx.closePath();
    this.canvas.ctx.lineTo(this.centerX, this.centerY);
    this.canvas.ctx.fill();
    this.canvas.ctx.stroke();
  }

  cutThePie() {
    this.canvas.ctx.clearRect(0, 0, this.width, this.height);
    this.startAngle = (3 * Math.PI) / 2;
    this.endAngle = this.startAngle + this.getSliceAngle();
    for (let i = 0; i < this.getNumberOfSlices(); i++) {
      this.drawPieSlice(this.colors[i]);
      this.startAngle += this.sliceAngle;
      this.endAngle += this.sliceAngle;
    }
    Pie.drawPointerGuide(this.canvas);
  }

  eatSliceOfPie(colorOfSlice) {
    super.removeAColor(colorOfSlice);
    this.setNumberOfSlices(this.getNumberOfSlices() - 1);
    this.setSliceAngle(this.getNumberOfSlices());
    this.cutThePie();
  }

  addSliceOfPie() {
    super.addAColor();
    this.setNumberOfSlices(this.getNumberOfSlices() + 1);
    this.setSliceAngle(this.getNumberOfSlices());
    this.cutThePie();
  }
}
