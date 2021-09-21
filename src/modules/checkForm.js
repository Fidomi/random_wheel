function stockWrongValues(inputList) {
  const arr = Array.from(inputList);
  return arr.filter((ele) => {
    let value = ele.value;
    value = value.trim().toString().replace(/</g, "").replace(/>/g, "");
    return value.length > 0 && value.length <= 15 ? false : true;
  });
}

function eraseErrorMessages() {
  let errorMessages = document.querySelectorAll(`[message="error"]`);
  Array.from(errorMessages).forEach((ele) => ele.remove());
}

export function checkForm(inputList) {
  eraseErrorMessages();
  const arr = Array.from(inputList);
  if (stockWrongValues(arr).length > 0) {
    return false;
  } else {
    console.log("Form is OK.");
    return true;
  }
}

export function showErrors(inputList) {
  let errorMessage = "Wrong value";
  let wrongValues = stockWrongValues(inputList);
  wrongValues.forEach((ele) => {
    if (ele.value.length === 0) {
      errorMessage = "Not a valid name";
    } else if (ele.value.length > 15) {
      errorMessage = "Name is too long (15 characters max)";
    }
    let message = document.createElement("p");
    message.setAttribute("message", "error");
    message.innerText = errorMessage;
    if (ele.name === "choice1") {
      ele.insertAdjacentElement("afterend", message);
    } else {
      let goodId = `minus${ele.name.split("").pop()}`;
      let minus = document.getElementById(goodId);
      minus.insertAdjacentElement("afterend", message);
    }
  });
}
