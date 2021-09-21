export function addChoiceInput(element, counter, color) {
  const text = `<div id="choice${counter}"><label>${counter} </label>
                <input type="text" name="choice${counter}" style="background-color: ${color}"/>
                <span id="minus${counter}">&#8722;</span><div>`;
  element.insertAdjacentHTML("beforebegin", text);
}

function updateCounters(number) {
  let idChoices = document.querySelectorAll(`div[id*="choice"]`);
  let inputChoices = document.querySelectorAll(`input[name*="choice"]`);
  let minusChoices = document.querySelectorAll(`span[id*="minus"]`);
  if (number <= idChoices.length) {
    for (let i = number - 1; i < idChoices.length; i++) {
      idChoices[i].setAttribute("id", `choice${i + 1}`);
      idChoices[i].firstChild.textContent = `${i + 1}`;
      inputChoices[i].setAttribute("name", `choice${i + 1}`);
      minusChoices[i - 1].setAttribute("id", `minus${i + 1}`);
    }
  }
}

export function deleteChoice(number) {
  const CHOICETODELETE = document.getElementById(`choice${number}`);
  CHOICETODELETE.outerHTML = "";
  updateCounters(number);
}
