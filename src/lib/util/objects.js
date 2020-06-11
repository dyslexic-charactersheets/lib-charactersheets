import { isNull, isArray, isObject } from '../util';

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
