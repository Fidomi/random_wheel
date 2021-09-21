export class Colors {
  constructor(numberOfColors) {
    this.colors = this.generateHSlColors(numberOfColors);
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  makeRandomHueArray(number) {
    let colors = [];
    let huedelta = Math.trunc(360 / number);
    for (let i = 0; i < number; i++) {
      let hue = i * huedelta;
      colors.push(hue);
    }
    return this.shuffleArray(colors);
  }

  getColorCode() {
    let makeColorCode = "0123456789ABCDEF";
    let code = "#";
    for (let count = 0; count < 6; count++) {
      code = code + makeColorCode[Math.floor(Math.random() * 16)];
    }
    return code === "#FF0000" ? getColorCode() : code;
  }

  generateHSlColors(numberOfColors) {
    let colors = [];
    let hues = this.makeRandomHueArray(numberOfColors);
    for (let i = 0; i < numberOfColors; i++) {
      let saturation = this.getRandomIntInclusive(55, 65);
      let lightness = this.getRandomIntInclusive(35, 55);
      colors.push(`hsla(${hues[i]},${saturation}%,${lightness}%,100%`);
    }
    return colors;
  }

  removeAColor(color) {
    let index = this.colors.findIndex((ele) => ele === color);
    this.colors.splice(index, 1);
  }

  addAColor() {
    let newColor = this.getColorCode();
    this.colors.push(newColor);
  }
}
