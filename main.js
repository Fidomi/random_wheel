import { createCanvas } from "./src/modules/canvas.js";
import { Pie } from "./src/modules/classes/Pie.js";
import { addChoiceInput, deleteChoice } from "./src/modules/choices.js";
import { checkForm, showErrors } from "./src/modules/checkForm.js";

//Informations

const ADDCHOICE = document.getElementById("plus");
const STARTDRAW = document.getElementById("start");
const CANCELDRAW = document.getElementById("cancel");
let minusSigns = [];
let requestAnim, start, end, speed, rotation;

//Create Canvas and Pie
const PIECANVAS = createCanvas("wheelContainer", "wheelCanvas", 500, 550);
const thePie = new Pie(PIECANVAS, 1);

//Init
const init = () => {
  console.log("started...");
  document.addEventListener("DOMContentLoaded", function () {
    play();
  });
};
init();

//FUNCTIONS

function play() {
  //1- CREATE THE PIE
  thePie.cutThePie();
  let firstInput = document.querySelector(`[name="choice1"]`);
  firstInput.setAttribute(`style`, `background-color:${thePie.colors[0]}`);
  document.addEventListener("click", (event) => {
    event.preventDefault();
    //2- ADDING SLICES
    if (event.target === ADDCHOICE) {
      thePie.addSliceOfPie();
      addChoiceInput(
        ADDCHOICE,
        thePie.numberOfSlices,
        thePie.colors[thePie.colors.length - 1]
      );
      minusSigns.push(document.querySelector(`#minus${thePie.numberOfSlices}`));
    }
    //3- ERASING SLICES AND CORRESPONDING CHOICE
    else if (testRegex(event.target, "id", "minus")) {
      let colorToDelete = event.target.previousSibling.previousSibling
        .getAttribute("style")
        .slice(-7);
      let numberChoiceDeleted = event.target.getAttribute("id").split("").pop();
      deleteChoice(numberChoiceDeleted);
      thePie.eatSliceOfPie(colorToDelete);
    }
    //4- VALIDATE CHOICES NAMES AND LAUNCH ANIMATION
    else if (event.target === STARTDRAW) {
      let inputNames = document.querySelectorAll("input");
      const isFormOk = checkForm(inputNames);
      if (isFormOk) {
        //LAUNCH ANIMATION
        if (requestAnim) {
          cancelAnimationFrame(requestAnim);
        }
        start = new Date().getTime();
        end = start + (Math.random() * (5000 - 4000) + 4000);
        speed = Math.random() * (0.992 - 0.99) + 0.99;
        rotation = thePie.angleRotation;
        STARTDRAW.hidden = true;
        CANCELDRAW.hidden = false;
        requestAnim = requestAnimationFrame(turnThePie);
      } else {
        showErrors(inputNames);
      }
    } //5- CANCEL DRAW
    else if (event.target === CANCELDRAW) {
      CANCELDRAW.hidden = true;
      STARTDRAW.hidden = false;
      cancelAnimationFrame(requestAnim);
      return;
    }
  });
}

function testRegex(element, attribute, pattern) {
  const regex = new RegExp(pattern);
  let toTest = element.getAttribute(attribute);
  return regex.test(toTest);
}

function turnThePie() {
  if (new Date().getTime() < end) {
    thePie.canvas.ctx.clearRect(0, 0, thePie.width, thePie.height);
    for (let i = 0; i < thePie.getNumberOfSlices(); i++) {
      thePie.drawPieSlice(thePie.colors[i]);
      thePie.startAngle += thePie.sliceAngle;
      thePie.endAngle += thePie.sliceAngle;
    }
    Pie.drawPointerGuide(thePie.canvas);
    thePie.startAngle += rotation;
    thePie.endAngle += rotation;
    rotation *= speed;
    requestAnim = requestAnimationFrame(turnThePie);
  } else {
    cancelAnimationFrame(requestAnim);
    console.log(thePie.colors);
    console.log(getColorResult());
  }
}

function getColorResult() {
  let pixelCoord = Pie.drawPointerGuide(thePie.canvas);
  let pixel = thePie.canvas.ctx.getImageData(
    pixelCoord[0],
    pixelCoord[1] + 10,
    1,
    1
  );
  let pixelData = pixel.data;
  const rgba = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${
    pixelData[3] / 255
  })`;
  return rgba;
}
