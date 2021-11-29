import { createCanvas } from "./src/modules/canvas.js";
import { Colors } from "./src/modules/classes/Colors.js";
import { Pie } from "./src/modules/classes/Pie.js";
import {
    addChoiceInput,
    deleteChoice,
    deactivateChoicesMinus,
    adjustFontColor,
} from "./src/modules/choices.js";
import { checkForm, showErrors } from "./src/modules/checkForm.js";

//Informations

const ADDCHOICE = document.getElementById("plus");
const ADDINPUTS = document.getElementById("addInputs");
const STARTDRAW = document.getElementById("start");
const NEXTDRAW = document.getElementById("next");
const CANCELDRAW = document.getElementById("cancel");
const RESULTS = document.getElementById("results");
const CHOICES_WRAPPER = document.querySelector("#input-wrapper");
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
try {
    init();
} catch (e) {
    console.error(e);
}
//FUNCTIONS

function play() {
    //1- CREATE THE PIE
    thePie.cutThePie();
    let firstInput = document.querySelector(`[name="choice1"]`);
    let fontColor = adjustFontColor(thePie.colors[0]);
    firstInput.setAttribute(
        `style`,
        `background-color:${thePie.colors[0]};color:${fontColor}`
    );
    document.addEventListener("click", (event) => {
        event.preventDefault();
        //2- ADDING SLICES
        if (event.target === ADDCHOICE) {
            if (thePie.numberOfSlices <= 9) {
                thePie.addSliceOfPie();
                addChoiceInput(
                    CHOICES_WRAPPER,
                    thePie.numberOfSlices,
                    thePie.colors[thePie.colors.length - 1]
                );
                minusSigns.push(
                    document.querySelector(`#minus${thePie.numberOfSlices}`)
                );
                if (thePie.numberOfSlices === 10) {
                    ADDCHOICE.setAttribute("hidden", true);
                    ADDINPUTS.firstElementChild.innerHTML =
                        "Max inputs reached!";
                }
            } else {
                const endMessage = `<p id="alert">Max 10 inputs!</p>`;
                document
                    .querySelector(".listButtons")
                    .insertAdjacentHTML("afterend", endMessage);
            }
            if (document.querySelectorAll("div[id *= 'choice']").length > 1) {
                STARTDRAW.removeAttribute("hidden");
            }
        }
        //3- ERASING SLICES AND CORRESPONDING CHOICE
        else if (testRegex(event.target, "id", "minus")) {
            let colorElementToDelete =
                event.target.previousSibling.previousSibling
                    .getAttribute("style")
                    .trim();
            let arr = /hsla\(([^(]+)\)/.exec(colorElementToDelete);
            let colorToDelete = arr[0];
            let numberChoiceDeleted = event.target.getAttribute("id").slice(5);
            deleteChoice(numberChoiceDeleted);
            thePie.eatSliceOfPie(colorToDelete);
            if (thePie.numberOfSlices <= 9) {
                ADDCHOICE.removeAttribute("hidden");
                ADDINPUTS.firstElementChild.innerHTML = "Add inputs (10 max)";
            }
        }
        //4- VALIDATE CHOICES NAMES AND LAUNCH ANIMATION
        else if (event.target === STARTDRAW || event.target === NEXTDRAW) {
            let inputNames = document.querySelectorAll("input");
            const isFormOk = checkForm(inputNames);
            if (isFormOk) {
                //LAUNCH ANIMATION
                if (document.getElementById("alert")) {
                    document.getElementById("alert").remove();
                }
                deactivateChoicesMinus();
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
        } //5- CANCEL DRAW (RESET)
        else if (event.target === CANCELDRAW) {
            window.location.reload();
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
        if (result !== undefined) {
            showPickedName(result);
        }
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
    ADDINPUTS.remove();
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
    let resultColor = Colors.RGBToHSL(
        pixelData[0],
        pixelData[1],
        pixelData[2],
        pixelData[3] / 255
    );
    const rgba = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${
        pixelData[3] / 255
    })`;
    return resultColor;
}

function arrayOfChoices() {
    let re = /hsla\(([^(]+)\)/;
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
    const value = choices.find((ele) => ele[0] === color);
    if (value !== undefined) {
        return value;
    }
    const nearValue = choices.find((ele) => {
        const result = compareCloseColors(color, ele[0]);
        return result !== undefined;
    });
    if (nearValue !== undefined) {
        return nearValue;
    } else {
        const endMessage = `<p id="alert">Unable to evaluate the winner's color. Try again.</p>`;
        result = undefined;
        document
            .querySelector(".listButtons")
            .insertAdjacentHTML("afterend", endMessage);
        throw console.error("Unable to find the winner");
    }
}

function showPickedName(result) {
    RESULTS.hidden = false;
    let rank = RESULTS.querySelectorAll(".result").length;
    let newResult = `<div class="result"><h3 style="background-color: ${
        result[0]
    }">${rank + 1}</h3><p style="color: ${result[0]}">${
        result[1].value
    }</p></div>`;
    RESULTS.insertAdjacentHTML("beforeend", newResult);
}

function deletePickedChoice(result) {
    let number = parseInt(result[1].getAttribute("name").toString().slice(6));
    thePie.eatSliceOfPie(result[0]);
    deleteChoice(number);
}

function endPlay(choices, result) {
    choices[0][0] === result[0] ? choices.shift() : choices.pop();
    let newResult = choices[0];
    showPickedName(newResult);
    const winner = RESULTS.querySelector(".result>p").innerHTML;
    const endMessage = `<p id="winner">End of game</p>`;
    document
        .querySelector(".listButtons")
        .insertAdjacentHTML("afterend", endMessage);
    console.log("...ended");
}

function colorSplitValues(pickedColor) {
    const pattern = /\d{1,3}/;
    const colorElements = pickedColor.split(",");
    let colorLightValue = parseInt(pattern.exec(colorElements[2])[0]);
    let colorSaturationValue = parseInt(pattern.exec(colorElements[1])[0]);
    let colorHueValue = parseInt(pattern.exec(colorElements[0])[0]);
    return [colorHueValue, colorSaturationValue, colorLightValue];
}

function compareCloseColors(color1, color2) {
    const color1Arr = colorSplitValues(color1);
    const color2Arr = colorSplitValues(color2);
    let comparisonResult = color1Arr.map((ele, index) => {
        return ele == color2Arr[index] ||
            ele == color2Arr[index] + 1 ||
            ele == color2Arr[index] - 1
            ? true
            : false;
    });
    const result = comparisonResult.every((el) => el === true)
        ? color2
        : undefined;
    return result;
}
