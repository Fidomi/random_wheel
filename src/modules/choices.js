export function adjustFontColor(backGroundColor) {
    const pattern = /\d{1,3}/;
    const colorElements = backGroundColor.split(",");
    let colorLightValue = pattern.exec(colorElements[2])[0];
    let colorSaturationValue = pattern.exec(colorElements[1])[0];
    return colorLightValue > 60 && colorSaturationValue > 60
        ? "black"
        : "white";
}

export function addChoiceInput(wrapperElement, counter, color) {
    const fontColor = adjustFontColor(color);
    if (fontColor && counter <= 10) {
        const newInput = `<div id="choice${counter}">
                <input type="text" name="choice${counter}" style="background-color: ${color};color:${fontColor}"/>
                <span id="minus${counter}">&#x2212;</span><div>`;
        wrapperElement.insertAdjacentHTML("beforeend", newInput);
    } else if (counter > 10) {
        throw console.error("Max 10 inputs.");
    } else {
        throw console.error("Couldn't find the color light value.");
    }
}

function updateCounters(number) {
    let idChoices = document.querySelectorAll(`div[id*="choice"]`);
    let inputChoices = document.querySelectorAll(`input[name*="choice"]`);
    let minusChoices = document.querySelectorAll(`span[id*="minus"]`);
    const startIndex = parseInt(number) - 1;
    if (parseInt(number) === idChoices.length + 1) {
        console.log("Pops the last choice");
    } else {
        for (let i = startIndex; i < idChoices.length; i++) {
            idChoices[i].setAttribute("id", `choice${i + 1}`);
            inputChoices[i].setAttribute("name", `choice${i + 1}`);
            if (i != 0 && minusChoices.length > 0) {
                minusChoices[i - 1].setAttribute("id", `minus${i + 1}`);
            }
        }
    }
}

export function deleteChoice(number) {
    const CHOICETODELETE = document.getElementById(`choice${number}`);
    CHOICETODELETE.remove();
    updateCounters(number);
}

export function deactivateChoicesMinus() {
    let minusChoices = document.querySelectorAll(`span[id*="minus"]`);
    for (let minus of minusChoices) {
        minus.remove();
    }
}
