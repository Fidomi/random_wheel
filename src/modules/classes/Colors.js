export class Colors {
    constructor(maxNumber, numberOfSlices) {
        this.colorSet = this.generateHSLAColors(maxNumber);
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

    generateHSLAColors(numberOfColors) {
        let colors = [];
        let hues = this.makeRandomHueArray(numberOfColors);
        for (let i = 0; i < numberOfColors; i++) {
            let saturation = this.getRandomIntInclusive(45, 80);
            let lightness = this.getRandomIntInclusive(35, 70);
            let newColor = `hsla(${hues[i]},${saturation}%,${lightness}%,1)`;
            colors.push(newColor);
        }
        return colors;
    }

    removeAColor(color) {
        color.trim();
        let index = this.colors.findIndex((ele) => ele === color);
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

    static RGBToHSL(r, g, b, a) {
        // Make r, g, and b fractions of 1
        r /= 255;
        g /= 255;
        b /= 255;

        // Find greatest and smallest channel values
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;
        // Calculate hue
        // No difference
        if (delta == 0) h = 0;
        // Red is max
        else if (cmax == r) h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax == g) h = (b - r) / delta + 2;
        // Blue is max
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        // Make negative hues positive behind 360°
        if (h < 0) h += 360;
        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        // Multiply l and s by 100
        s = Math.round(+(s * 100));
        l = Math.round(+(l * 100));

        return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
    }
}
