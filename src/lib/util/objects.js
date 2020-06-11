import { isNull, isString, isArray, isObject, isEmpty } from '../util';

export function has(container, property) {
  if (isNull(container)) return false;
  return Object.prototype.hasOwnProperty.call(container, property) && !isNull(container[property]);
}

export function clone(original) {
  if (isNull(original)) {
    return null;
  }
  if (isArray(original)) {
    return [...original];
  }
  if (isObject(original)) {
    return { ...original };
  }
  return original;
}

export function cloneDeep(original) {
  if (isNull(original)) {
    return null;
  }

  if (isArray(original)) {
    let product = [];
    for (let i = 0; i < original.length; ++i) {
      product.push(cloneDeep(original[i]));
    }
    return product;
  }

  if (isObject(original)) {
    let product = {};
    for (const key in original) {
      product[cloneDeep(key)] = cloneDeep(original[key]);
    }
    return product;
  }

  return original;
}

export function interpolate(template, values, document = null) {
  if (isNull(template)) {
    return null;
  }

  if (isString(template)) {
    return template.replace(/#\{(.*?)\}/g, function (tag) {
      const match = tag.match(/#\{(.*?)\}/);
      const index = match[1];
      if (has(values, index)) {
        return values[index];
      } else if (!isNull(document) && document.hasVar(index)) {
        return document.getVar(index);
      }
      return match[0];
    });
  }

  if (isArray(template)) {
    const product = template.map(item => interpolate(item, values, document));
    return product.flatMap(item => isArray(item) ? item : [ item ]);
  }

  if (isObject(template)) {
    // replace all the values
    let keys = Object.keys(template);
    let obj = {};
    keys.forEach(key => {
      obj[key] = interpolate(template[key], values, document);
    });

    // check if the whole object needs replacing
    let first = keys[0];
    if (first == "type")
      first = template[first];
    if (first == 'param') {
      const paramkey = pairs[0][1];
      if (has(values, paramkey)) {
        return values[paramkey];
      } else if (!isNull(document) && document.hasVar(paramkey)) {
        return document.getVar(paramkey);
      }
    } else if (first == 'item' && has(values, 'item') && !isEmpty(values.item)) {
      // log("util", "Interpolate: item", values.item);
      return values.item;
    }

    return obj;
  }

  return template;
};
