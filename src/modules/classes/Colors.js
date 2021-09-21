export class Colors {
  constructor(maxNumber, numberOfSlices) {
    this.colorSet = this.generateRGBAColors(maxNumber);
    this.setColors(numberOfSlices);
  }

  setColors(numberOfSlices) {
    this.colors = [];
    for (let i = 0; i < numberOfSlices; i++) {
      this.colors.push(this.colorSet[i]);
    }
    return this.colors;
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

  // getColorCode() {
  //   let makeColorCode = "0123456789ABCDEF";
  //   let code = "#";
  //   for (let count = 0; count < 6; count++) {
  //     code = code + makeColorCode[Math.floor(Math.random() * 16)];
  //   }
  //   return code === "#FF0000" ? getColorCode() : code;
  // }

  generateRGBAColors(numberOfColors) {
    let colors = [];
    let hues = this.makeRandomHueArray(numberOfColors);
    for (let i = 0; i < numberOfColors; i++) {
      let saturation = this.getRandomIntInclusive(55, 65);
      let lightness = this.getRandomIntInclusive(35, 55);
      let newColor = `hsla(${hues[i]},${saturation}%,${lightness}%,1)`;
      colors.push(this.HSLToRGBA(newColor));
    }
    return colors;
  }

  removeAColor(color) {
    color.trim();
    let index = this.colors.findIndex((ele) => ele === color);
    console.log("colorToDelete", color);
    console.log("this.colors", this.colors);
    console.log("index", index);
    this.colors.splice(index, 1);
  }

  addAColor() {
    let newColor = "";
    for (let i = 0; i < this.colorSet.length; i++) {
      if (!this.colors.includes(this.colorSet[i])) {
        newColor = this.colorSet[i];
        break;
      }
    }
    this.colors.push(newColor);
  }

  HSLToRGBA(hslColor) {
    let hsl = hslColor.split(/(\D)/).filter((ele) => !isNaN(parseInt(ele)));
    let h = parseInt(hsl[0]);
    let s = parseInt(hsl[1]);
    let l = parseInt(hsl[2]);
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "rgba(" + r + ", " + g + ", " + b + ", 1)";
  }
}
