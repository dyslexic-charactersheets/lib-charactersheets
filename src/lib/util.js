const color = require('color');

import * as _ from 'lodash';

// polyfill for Array.flat and Array.flatMap, which aren't well supported even with Babel
// cf https://github.com/jonathantneal/array-flat-polyfill

if (!Array.prototype.flat) {
	Object.defineProperty(Array.prototype, 'flat', {
		configurable: true,
		value: function flat () {
			var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);

			return depth ? Array.prototype.reduce.call(this, function (acc, cur) {
				if (Array.isArray(cur)) {
					acc.push.apply(acc, flat.call(cur, depth - 1));
				} else {
					acc.push(cur);
				}

				return acc;
			}, []) : Array.prototype.slice.call(this);
		},
		writable: true
	});
}


if (!Array.prototype.flatMap) {
	Object.defineProperty(Array.prototype, 'flatMap', {
		configurable: true,
		value: function flatMap (callback) {
            // return Array.prototype.map.apply(this, arguments).flat();
            var parts = Array.prototype.map.apply(this, arguments);
            // console.log(parts);
            return parts.flat();
		},
		writable: true
    });
}

export function esc(content, newlines = false) {
    content = _.escape(content);
    content = content.replace(/’/g, '&rsquo;').replace(/‘/g, '&lsquo;');
    content = content.replace(/—/g, '&mdash;');
    content = content.replace(/&amp;(.+);/, '&$1;');

    if (newlines) {
        content = content.replace(/[\n\r]+/g, '<br>');
    }
    return content;
}

export function elementID(element, id = null) {
    if (id === null || id == '' || id == 'null') {
        return '';
    }

    return ` id='${element}-${id}'`;
}

function pickMods(args, keys) {
    return _.flatMap(args, (v, k) => {
        return (v && keys.includes(k)) ? [ k ] : [];
    });
}

function pickAttribs(args, keys) {
    return _.pick(args, keys);
};

export function elementClass(block, element = null, args = {}, modKeys = [], attribDefs = {}) {
    var cls = [];

    var prefix = block;
    if (element !== null) {
        prefix = `${block}__${element}`;
    }
    // console.log("["+block+" class] Prefix:", prefix);

    // built-in elements don't need to repeat that in their class
    switch (prefix) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'hr':
        case 'section':
        case 'aside':
        case 'article':
        case 'header':
        case 'footer':
        case 'img':
        case 'table':
        case 'p':
        case 'span':
        case 'b':
        case 'i':
            break;
        default:
            cls.push(prefix);
    }

    // mods are single-word adjectives, eg
    var mods = pickMods(args, modKeys);
    // console.log("["+block+" class] Mods:", mods);
    _.each(mods, function (mod) {
        switch (mod) {
            // global mods that don't need a prefix
            // case 'align':
            //     cls.push(``)
            //     break;
            case 'shade':
            case 'lp':
                cls.push(mod);
                break;
            default:
                cls.push(`${prefix}--${mod}`);
        }
    });

    // attribs are key-values, eg align=left
    var attribKeys;
    if (Array.isArray(attribDefs)) {
        attribKeys = attribDefs;
        attribDefs = {};
    } else {
        attribKeys = _.keys(attribDefs);
    }
    var attribs = pickAttribs(args, attribKeys);
    // console.log("["+block+" class] Attribs:", attribs);

    Object.entries(attribs).forEach(pair => {
        var key = pair[0];
        var value = pair[1];

        if (value === null)
            return;
        // console.log("  -", key, " = ", value);
        // some default values can be skipped
        // switch (key) {
        //     case 'frame': if (value == 'normal') return;
        //     case 'control': if (value == 'input') return;
        // }
        if (attribDefs.hasOwnProperty(key) && value == attribDefs[key])
            return;

        switch (key) {
            // global attributes that don't need a prefix
            case 'align':
            case 'valign':
            case 'lp':
            case 'icon':
            case 'flex':
                cls.push(`${key}_${value}`);
                break;
            default:
                cls.push(`${prefix}--${key}_${value}`);
                break;
        }
    });

    // the class attr, if needed
    if (_.isEmpty(cls)) {
        return '';
    }
    return ` class='${cls.join(" ")}'`;
}

export function interpolate(template, values) {
    // console.log("Interpolate:", template);
    // console.log(" - Values:", values);

    if (template === null)
        return null;

    if (_.isString(template)) {
        return template.replace(/#\{(.*?)\}/g, function (tag) {
            var match = tag.match(/#\{(.*?)\}/);
            var index = match[1];
            // console.log("Match index:", index);
            if (values.hasOwnProperty(index)) {
                // console.log(` - Replacing #{${index}} -> ${values[index]}`);
                return values[index];
            }
            return match;
        });
    }

    if (Array.isArray(template)) {
        return template.map(item => interpolate(item, values));
    }

    if (_.isPlainObject(template)) {
        var pairs = _.toPairs(template);
        // console.log(" - value pairs", pairs);
        pairs = pairs.map(pair => [pair[0], interpolate(pair[1], values)]);
        // console.log(" - processed pairs", pairs);

        // check if the whole object needs replacing
        var first = pairs[0][0];
        if (first == 'param') {
            var paramkey = pairs[0][1];
            if (values.hasOwnProperty(paramkey))
                return values[paramkey];
        } else if (first == 'item' && values.hasOwnProperty('item')) {
            return values['item'];
        }

        var obj = _.fromPairs(pairs);
        return obj;
    }

    return template;
};


export function replaceColours(str, documentColour, accentColour) {
    // var accentColour = '#a6085e'; // CharacterSheets._current.accentColour

    str = str.replace(/#[0-9a-fA-F]{6}/g, c => adjustColour(c, documentColour));
    str = str.replace(/%23[0-9a-fA-F]{6}/g, c => {
        c = c.replace('%23', '#');
        c = adjustColour(c, documentColour);
        c = c.replace('#', '%23');
        return c;
    });
    str = str.replace(/rgba\(.*?,.*?,.*?,(.*?)\)/g, c => adjustColour(c, documentColour)); // (c, opacity) => adjustColourRGBA(c, opacity));
    str = str.replace(/--c-accent/g, accentColour);
    str = str.replace(/="#([0-9a-fA-F]{6})"/g, '="%23$1"');
    return str;
}

export function adjustColourRGBA(c, opacity) {
    // var col1 = color(c);
    var col2 = color(this.adjustColour(c));

    col2.fade(opacity);
    return col2.rgba();
}

export function adjustColour(c, documentColour) {
    // var documentColour = '#102820'; // CharacterSheets._current.documentColour
    try {
        var base = color(c);
        var col = color(documentColour);

        const lmin = 16;
        var lightness = base.lightness();
        if (lightness < lmin) lightness = lmin;
        col = col.lightness(lightness);
        
        // console.log("Color:", col.hex());
        // console.log(" - lightness:", lightness);

        // reduce the saturation of mid-lightness colours so they don't look too odd
        // enhance the saturation of dark colours so they don't fade away
        const nd = 24;
        const nmid = 50;
        const nlow = nmid - nd;
        const nhigh = nmid + nd;
        const f = 1.3;

        var saturation = col.saturationl();
        // console.log(" - saturation:", saturation);
        saturation = saturation + 10;
        if (lightness > nlow && lightness <= nmid) {
            var diff = lightness - nlow;
            saturation -= diff * f;
        } else if (lightness > nmid && lightness < nhigh) {
            var diff = nhigh - lightness;
            saturation -= diff * f;
        }
        if (saturation < 0) saturation = 0;
        if (saturation > 100) saturation = 100;
        // console.log(" - adjust:", saturation);
        col = col.saturationl(saturation);

        // readjust the opacity
        var alpha = base.alpha();
        col.alpha(alpha);

        if (alpha != 1) {
            // console.log("Alpha:", alpha);
            var red = Math.round(col.red());
            var green = Math.round(col.green());
            var blue = Math.round(col.blue());
            var result = `rgba(${red},${green},${blue},${alpha})`;
            // console.log(" Alpha colour:", result);
            return result;
        }
        var result = col.hex();
        // console.log(" - adjusted:", result);
        return result;
    } catch (x) {
        error("util", "Colour error:", x, x.stack);
        return c;
    }
}

export function getLabelHeight(args) {
    if (args === null)
        return 1;

    if (args.hasOwnProperty("labelHeight"))
        return args.labelHeight;
    if (args.hasOwnProperty("context") && args.context !== null && args.context.hasOwnProperty("labelHeight"))
        return args.context.labelHeight;

    switch(args.type) {
        case 'field':
            switch(args.frame) {
                case 'none':
                case 'left':
                case 'right':
                case 'h-label':
                case 'circle':
                    return 0;

                default:
                    var labelHeight = args.label ? args.label.split(/\n/).length : 0;
                    var legendHeight = args.legend ? args.legend.split(/\n/).length : 0;
                    return Math.max(labelHeight, legendHeight, 0);
            }

        case 'calc':
            var height = getLabelHeight(args.output);
            args.inputs.forEach(field => {
                var h = getLabelHeight(field);
                if (h > height) 
                    height = h;
            });
            return height;

        case 'row':
            var height = 0;
            args.contents.forEach(field => {
                var h = getLabelHeight(field);
                if (h > height) 
                    height = h;
            });
            return height;

        case 'g':
            var height = getLabelHeight(args.contents[0]);
            return height;
    }
    return 0;
};
