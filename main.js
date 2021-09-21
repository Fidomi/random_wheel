import { createCanvas } from "./src/modules/canvas.js";
import { Pie } from "./src/modules/classes/Pie.js";
import { addChoiceInput, deleteChoice } from "./src/modules/choices.js";
import { checkForm, showErrors } from "./src/modules/checkForm.js";

//Informations

const ADDCHOICE = document.getElementById("plus");
const STARTDRAW = document.getElementById("start");
const NEXTDRAW = document.getElementById("next");
const CANCELDRAW = document.getElementById("cancel");
const RESULTS = document.getElementById("results");
let minusSigns = [];
let requestAnim, start, end, speed, rotation, result;
let theEnd = false;

//Create Canvas and Pie
const PIECANVAS = createCanvas("wheelContainer", "wheelCanvas", 500, 550);
const thePie = new Pie(PIECANVAS, 20, 1);

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
      let colorElementToDelete = event.target.previousSibling.previousSibling
        .getAttribute("style")
        .trim();
      let arr = /rgba\(([^(]+)\)/.exec(colorElementToDelete);
      let colorToDelete = arr[0];
      let numberChoiceDeleted = event.target.getAttribute("id").split("").pop();
      deleteChoice(numberChoiceDeleted);
      thePie.eatSliceOfPie(colorToDelete);
    }
    //4- VALIDATE CHOICES NAMES AND LAUNCH ANIMATION
    else if (event.target === STARTDRAW || event.target === NEXTDRAW) {
      let inputNames = document.querySelectorAll("input");
      const isFormOk = checkForm(inputNames);
      if (isFormOk) {
        //LAUNCH ANIMATION
        if (requestAnim) {
          cancelAnimationFrame(requestAnim);
        }
        if (typeof result !== "undefined") {
          deletePickedChoice(result);
        }
        animate();
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
    let resultColor = getColorResult();
    let choices = arrayOfChoices();
    result = findPickedResult(resultColor, choices);
    showPickedName(result);
    if (choices.length === 2) {
      theEnd = true;
      NEXTDRAW.hidden = true;
      endPlay(choices, result);
    } else {
      NEXTDRAW.hidden = false;
    }
  }
}

function animate() {
  ADDCHOICE.hidden = true;
  start = new Date().getTime();
  end = start + (Math.random() * (5000 - 4000) + 4000);
  speed = Math.random() * (0.992 - 0.99) + 0.99;
  rotation = thePie.angleRotation;
  STARTDRAW.hidden = true;
  CANCELDRAW.hidden = false;
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

function arrayOfChoices() {
  let re = /rgba\(([^(]+)\)/;
  let choices = Array.from(document.querySelectorAll(`[name*="choice"]`)).map(
    (element) => {
      let colorElement = element.getAttribute("style").toString().trim();
      let arr = re.exec(colorElement);
      return [arr[0], element];
    }
  );
  return choices;
}

function findPickedResult(color, choices) {
  return choices.find((ele) => ele[0] === color);
}

function showPickedName(result) {
  RESULTS.hidden = false;
  let rank = RESULTS.querySelectorAll("h3").length;
  let newResult = `<h3>${rank} . ${result[1].value}</h3>`;
  RESULTS.insertAdjacentHTML("beforeend", newResult);
}

function deletePickedChoice(result) {
  let number = parseInt(result[1].getAttribute("name").toString().slice(-1));
  thePie.eatSliceOfPie(result[0]);
  deleteChoice(number);
}

function endPlay(choices, result) {
  choices[0][0] === result[0] ? choices.shift() : choices.pop();
  let newResult = choices[0];
  showPickedName(newResult);
  console.log("THE END");
}
