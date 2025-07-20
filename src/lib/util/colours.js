import { isEmpty, isNumber, isNull } from '../util';
import { log, error } from '../log';
import { has } from './objects';

const color = require('color');

// increase a dull colour's saturation
export function vibrantColour(baseColour, saturation = 0.9) {
  let c = color(baseColour);
  let sat = c.saturationl();
  if (sat >= saturation || sat < 0.1)
    return baseColour;
  c = c.saturationl(saturation);
  return c.hex();
}

export function replaceColours(str, documentColour, accentColour = false, intensity = 0, highContrast = false) {
  str = str.replace(/#[0-9a-fA-F]{6}/g, (c) => adjustColour(c, documentColour, intensity, highContrast));
  str = str.replace(/%23[0-9a-fA-F]{6}/g, (c) => {
    c = c.replace('%23', '#');
    c = adjustColour(c, documentColour, intensity, highContrast);
    c = c.replace('#', '%23');
    return c;
  });
  str = str.replace(/rgba\(.*?,.*?,.*?,(.*?)\)/g, (c) => adjustColour(c, documentColour, intensity, highContrast));
  if (accentColour) {
    str = str.replace(/--c-accent/g, accentColour);
  }
  str = str.replaceAll(/--c-str/g, '#997700');
  str = str.replaceAll(/--c-dex/g, '#336699');
  str = str.replaceAll(/--c-con/g, '#aa2200');
  str = str.replaceAll(/--c-int/g, '#992255');
  str = str.replaceAll(/--c-wis/g, '#447711');
  str = str.replaceAll(/--c-cha/g, '#552299');

  str = str.replace(/="#([0-9a-fA-F]{6})"/g, '="%23$1"');
  return str;
}

export function adjustColourRGBA(c, opacity, intensity, highContrast) {
  c = c.trim();
  let col2 = color(this.adjustColour(c, intensity, highContrast));
  col2.fade(opacity);
  return col2.rgba();
}

export function adjustColour(c, documentColour, intensity, highContrast) {
  try {
    c = c.trim();
    if (c == "")
      c = "#808080";
    c = colourFromName(c);
    documentColour = documentColour.trim();
    if (documentColour == "")
      documentColour = "#808080";
    documentColour = colourFromName(documentColour);
    const base = color(c);
    let col = color(documentColour);

    const lmin = 16;
    const lmax = 100;
    let lightness = base.lightness();
    // adjust the lightness based on the selected intensity
    if (lightness < 98) {
      switch (intensity) {
        case 'lightest': intensity = 2; break;
        case 'lighter': intensity = 1; break;
        case 'darker': intensity = -1; break;
        case 'darkest': intensity = -2; break;
      }
      if (!isNumber(intensity)) intensity = 0;
      if (intensity > 2) intensity = 2;
      if (intensity < -2) intensity = -2;
      // log("util", `Adjusting intensity: lightness = ${lightness}, intensity = ${intensity}`);
      lightness += intensity * 7;
    }
      
    // adjust the lightness if the "high contrast" option is selected
    if (highContrast) {
      if (lightness < 50) {
        lightness = lightness * 0.8;
      }
    }
    if (lightness < lmin) lightness = lmin;
    if (lightness > lmax) lightness = lmax;
    col = col.lightness(lightness);

    // reduce the saturation of mid-lightness colours so they don't look too odd
    // enhance the saturation of dark colours so they don't fade away
    const nd = 24;
    const nmid = 50;
    const nlow = nmid - nd;
    const nhigh = nmid + nd;
    const f = 1.3;

    let saturation = col.saturationl();
    saturation = saturation + 10;
    if (lightness > nlow && lightness <= nmid) {
      const diff = lightness - nlow;
      saturation -= diff * f;
    } else if (lightness > nmid && lightness < nhigh) {
      const diff = nhigh - lightness;
      saturation -= diff * f;
    }
    if (saturation < 0) saturation = 0;
    if (saturation > 100) saturation = 100;
    col = col.saturationl(saturation);

    // readjust the opacity
    const alpha = base.alpha();
    col.alpha(alpha);

    if (alpha != 1) {
      const red = Math.round(col.red());
      const green = Math.round(col.green());
      const blue = Math.round(col.blue());
      const result = `rgba(${red},${green},${blue},${alpha})`;
      return result;
    }
    const result = col.hex();
    return result;
  } catch (x) {
    error('util', 'Colour error:', x, x.stack);
    return c;
  }
}

function colourFromName(colour) {
  switch(colour) {
    case 'none':      return '';
    case 'black':     return '#404040';

    case 'red':       return '#BF4C4C';
    case 'orange':    return '#CC843D';
    case 'gold':      return '#CCAF1F';
    case 'lime':      return '#76A632';
    case 'green':     return '#42A642';
    case 'teal':      return '#3AA66E';
    case 'cyan':      return '#32A6A6';
    case 'azure':     return '#3f83b3';
    case 'blue':      return '#485ab3';
    case 'indigo':    return '#663fb3';
    case 'violet':    return '#a03fb3';
    case 'magenta':   return '#B33F7A';

    case 'red2':      return '#BF6969';
    case 'orange2':   return '#BF8A56';
    case 'gold2':     return '#CCB952';
    case 'lime2':     return '#91B362';
    case 'green2':    return '#6BB36B';
    case 'teal2':     return '#62B389';
    case 'cyan2':     return '#74B3B3';
    case 'azure2':    return '#699bbf';
    case 'blue2':     return '#7380bf';
    case 'indigo2':   return '#8669bf';
    case 'violet2':   return '#b169bf';
    case 'magenta2':  return '#BF6994';

    default:          return colour;
  }
}

export function elementColour(args) {
  if (isNull(args)) {
    return false;
  }
  if (has(args, "colour") && args.colour) {
    return args.colour;
  }
  switch (args.id) {
    case "STR": case "DEX": case "CON": case "INT": case "WIS": case "CHA":
      return args.id;
  }
  switch (args.ref) {
    case "STR": case "DEX": case "CON": case "INT": case "WIS": case "CHA":
      return args.ref;
  }
  switch (args.type) {
    case "ruby":
      for (let elem of args.contents) {
        let col = elementColour(elem);
        if (col) {
          return col;
        }
      }
  }
  return false;
}
