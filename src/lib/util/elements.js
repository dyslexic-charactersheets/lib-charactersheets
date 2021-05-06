import { isNull, isString, isArray, isObject, isEmpty } from '../util';
import { has, clone } from './objects';

export function embed(contents) {
  if (isArray(contents)) {
    if (contents.length == 1) {
      return contents[0];
    } else {
      return { type: 'g', contents };
    }
  }
  if (isObject(contents) && has(contents, "type")) {
    return contents;
  }
  warn("util", "Embed: unknown element!", contents);
  return contents;
}

function pickMods(args, keys) {
  let mods = [];
  Object.keys(args).forEach(k => {
    let v = args[k];
    if (isString(v)) {
      v = v.replace(/#\{.*?\}/g, '');
    }
    if (v && keys.includes(k) && !isEmpty(v) && v != 'false') {
      mods.push(k);
    }
  });
  return mods;
}

function pickAttribs(args, keys) {
  let picked = {};
  keys.forEach(key => {
    if (has(args, key)) {
      picked[key] = clone(args[key]);
    }
  });
  return picked;
};

export function elementID(element, id = null) {
  if (id === null || id == '' || id == 'null') {
    return '';
  }

  return ` id='${element}-${id}'`;
}

export function elementClass(block, element = null, args = {}, modKeys = [], attribDefs = {}) {
  let cls = [];

  const prefix = isNull(element) ? block : `${block}__${element}`;

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
    case 'tr':
    case 'td':
    case 'p':
    case 'span':
    case 'b':
    case 'i':
    case 'ul':
    case 'li':
      break;
    default:
      cls.push(prefix);
  }

  // mods are single-word adjectives, eg
  const mods = pickMods(args, modKeys);
  mods.forEach((mod) => {
    switch (mod) {
      // global mods that don't need a prefix
      case 'shade':
      case 'lp':
      case 'optional':
      case 'blk':
      case 'unblk':
      case 'pad':
        cls.push(mod);
        break;
      default:
        cls.push(`${prefix}--${mod}`);
    }
  });

  // attribs are key-values, eg align=left
  let attribKeys;
  if (isArray(attribDefs)) {
    attribKeys = attribDefs;
    attribDefs = {};
  } else {
    attribKeys = Object.keys(attribDefs);
  }
  const attribs = pickAttribs(args, attribKeys);

  Object.entries(attribs).forEach(pair => {
    const key = pair[0];
    const value = pair[1];

    if (isEmpty(value)) {
      return;
    }
    if (has(attribDefs, key) && value == attribDefs[key]) {
      return;
    }

    const values = ("" +value).split(/ +/);
    values.forEach(value => {
      if (isEmpty(value)) {
        return;
      }
      
      switch (key) {
        // global attributes that don't need a prefix
        case 'align':
        case 'valign':
        case 'lp':
        case 'rb':
        case 'icon':
        case 'size':
        case 'flex':
          cls.push(`${key}_${value}`);
          break;
        default:
          cls.push(`${prefix}--${key}_${value}`);
          break;
      }
    });
  });

  // the class attr, if needed
  if (isEmpty(cls)) {
    return '';
  }
  return ` class='${cls.join(' ')}'`;
}


export function mergeBottom(element, allItems = false) {
  if (isArray(element)) {
    if (allItems) {
      element.forEach(e => {
        e['merge-bottom'] = true;
      });
    } else {
      element[element.length - 1] = mergeBottom(element[element.length - 1]);
    }
  }

  else if (typeof element == 'object') {
    switch (element.type) {
      // horizontal elements don't
      case 'calc':
        element.inputs.forEach(e => {
          e['merge-bottom'] = true;
        });
        break;

      case 'table':
        element.rows = mergeBottom(element.rows);
        break;

      case 'row':
      case 'td':
        element.contents.forEach(e => {
          e['merge-bottom'] = true;
        });
        break;

      case 'tr':
        element.cells.forEach(e => {
          e['merge-bottom'] = true;
        });
        break;
        
      case 'field':
        element['merge-bottom'] = true;
        break;

      case 'list':
      default:
        element.contents = mergeBottom(element.contents);
    }
  }

  return element;
};


export function getLabelHeight(args) {
  if (isNull(args)) {
    return 1;
  }

  if (has(args, 'labelHeight')) {
    return args.labelHeight;
  }
  if (has(args, 'context') && args.context !== null && has(args.context, 'labelHeight')) {
    return args.context.labelHeight;
  }

  switch (args.type) {
    case 'field': {
      switch (args.frame) {
        case 'none':
        case 'left':
        case 'right':
        case 'h-label':
        case 'circle':
          return 0;

        default: {
          const labelHeight = args.label ? args.label.split(/\n/).length : 0;
          const legendHeight = args.legend ? args.legend.split(/\n/).length : 0;
          return Math.max(labelHeight, legendHeight, 0);
        }
      }
    }

    case 'calc': {
      let height = getLabelHeight(args.output);
      args.inputs.forEach((field) => {
        const h = getLabelHeight(field);
        if (h > height) {
          height = h;
        }
      });
      return height;
    }

    case 'row': {
      let height = 0;
      args.contents.forEach((field) => {
        const h = getLabelHeight(field);
        if (h > height) {
          height = h;
        }
      });
      return height;
    }

    case 'g': {
      const height = getLabelHeight(args.contents[0]);
      return height;
    }
  }
  return 0;
};

export function getRubyHeight(args) {
  if (isNull(args)) {
    return 0;
  }

  switch (args.type) {
    case 'ruby': {
      const rubyHeight = args.ruby.split(/\n/).length;
      return rubyHeight;
    }

    case 'field': {
      let ruby = 0;
      if (args.border == "multi") {
        args.parts.forEach(part => {
          if (part.ruby) {
            const rubyHeight = part.ruby.split(/\n/).length;
            if (rubyHeight > ruby) ruby = rubyHeight;
          }
        });
      }

      if (args.ruby) {
        const rubyHeight = args.ruby.split(/\n/).length;
        if (rubyHeight > ruby) ruby = rubyHeight;
      }
      return ruby;
    }

    case 'calc': {
      let height = getRubyHeight(args.output);
      args.inputs.forEach((field) => {
        const h = getRubyHeight(field);
        if (h > height) {
          height = h;
        }
      });
      return height;
    }

    case 'row': {
      let height = 0;
      args.contents.forEach((field) => {
        const h = getRubyHeight(field);
        if (h > height) {
          height = h;
        }
      });
      return height;
    }

    case 'g': {
      const height = getRubyHeight(args.contents[0]);
      return height;
    }
  }
  return 0;
}
