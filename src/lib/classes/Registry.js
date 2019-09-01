import * as _ from 'lodash';

import { log, warn } from '../log';
import { has, isArray } from '../util';

// elements
import { unit } from '../elements/unit';

import { advancement } from '../elements/advancement';
import { article } from '../elements/article';
import { blockquote } from '../elements/blockquote';
import { calc } from '../elements/calc';
import { class_icon } from '../elements/class-icon';
import { ifelem } from '../elements/control';
// import { document } from '../elements/document';
import { each } from '../elements/each';
import { g } from '../elements/g';
import { h1, h2, h3, h4, h5, h6, class_name } from '../elements/headings';
import { hr, tail, vr } from '../elements/hr';
import { icon } from '../elements/icon';
import { label } from '../elements/label';
import { layout } from '../elements/layout';
import { level, level_marker } from '../elements/level';
import { list, join } from '../elements/list';
import { logelem } from '../elements/log';
import { logo } from '../elements/logo';
import { nothing } from '../elements/nothing';
import { page } from '../elements/page';
import { p, ul, li } from '../elements/p';
import { portrait } from '../elements/portrait';
import { proficiency, action, selectable } from '../elements/proficiency';
import { repeat } from '../elements/repeat';
import { row } from '../elements/row';
import { section } from '../elements/section';
import { slots } from '../elements/slots';
import { spacer } from '../elements/spacer';
import { span } from '../elements/span';
import { spells_list, spells_table } from '../elements/spells-list';
import { spells_list2 } from '../elements/spells-list2';
import { table } from '../elements/table';
import { define, paste } from '../elements/template';
import { zone } from '../elements/zone';

import { field } from '../elements/field';
import {
  field_frame_above,
  field_frame_none,
  field_frame_left,
  field_frame_right,
  field_frame_h_label,
  field_frame_annotation,
  field_frame_circle,
} from '../elements/field-frame';
import {
  field_control_input,
  field_control_speed,
  field_control_alignment,
  field_control_boost,
  field_control_checkbox,
  field_control_radio,
  field_control_checkgrid,
  field_control_compound,
  field_control_progression,
  field_control_money,
  field_control_weight,
  field_control_proficiency,
  field_control_proficiency_icon,
  field_control_icon,
} from '../elements/field-control';
import { isString } from 'util';


export class Registry {
  constructor() {
    this.registry = {};
    this.stack = [];

    // load all the elements
    [
      unit,
      // document,

      advancement,
      article,
      blockquote,
      calc,
      class_name,
      class_icon,
      each,
      g,
      h1, h2, h3, h4, h5, h6,
      hr, tail, vr,
      icon,
      label,
      layout,
      level, level_marker,
      list, join,
      logelem,
      logo,
      nothing,
      page,
      p, ul, li,
      portrait,
      proficiency, action, selectable,
      repeat,
      row,
      section,
      slots,
      spacer,
      span,
      spells_list,
      spells_table,
      spells_list2,
      table,
      define, paste,
      unit,
      zone,

      field,
      field_frame_none,
      field_frame_above,
      field_frame_left,
      field_frame_right,
      field_frame_h_label,
      field_frame_annotation,
      field_frame_circle,
      field_control_input,
      field_control_speed,
      field_control_alignment,
      field_control_boost,
      field_control_checkbox,
      field_control_radio,
      field_control_checkgrid,
      field_control_compound,
      field_control_progression,
      field_control_money,
      field_control_weight,
      field_control_proficiency,
      field_control_proficiency_icon,
      field_control_icon,
    ].forEach(elem => this.register(elem));

    // log("Registry", "Loaded registry elements", Object.keys(this.registry));
  }

  register(params) {
    params = Object.assign({
      key: '',
      defaults: {},
      expect: [],
      render: args => '',
      transform: false,
    }, params);

    // find expected keys
    var expect = Object.keys(params.defaults).concat(params.expect);
    expect = [...new Set(expect)]; // uniq
    expect.unshift("level");
    params.expect = expect;

    this.registry[params.name] = params;
  }

  get(type) {
    if (has(this.registry, type))
      return this.registry[type];
    return false;
  }

  render(items, doc) {
    // log("registry", "Render", items);
    var rendered = items.map(item => this.renderItem(item, doc));
    return rendered.join("");
  }

  renderItem(item, doc) {
    if (item === null) return '';
    item = Object.assign({
      id: null,
      exists: true,
    }, item);

    // check if the item actually exists
    if (isString(item.exists))
      item.exists = item.exists.replace(/#{.*?}/g, '');
    if (!item.exists || item.exists === "false")
      return '';

    if (item.type == "unit")
      item.type = item["unit-type"];

    // log("Registry", "renderItem", item.type);
    if (has(this.registry, item.type)) {
      var reg = this.registry[item.type];

      // registered defaults
      Object.keys(item).forEach(key => {
        if (item[key] === null)
          delete item[key];
      });
      item = Object.assign({}, reg.defaults, item);
      if (item.type == "slots")
        log("Registry", item);

      if (item['merge-bottom'])
        item = mergeBottom(item);

      this.stack.push(item.type + ((item.id == null) ? '' : ":" + item.id) + ((item.title == null) ? '' : ':' + item.title));
      var output = reg.render(item, this, doc);
      this.stack.pop();
      return output;
    } else {
      // log("Registry", "Registry elements", Object.keys(this.registry));
      warn("Registry", "Unknown element type:", item.type, "at:", this.stack, item);
      return '';
    }
  }
}

export function mergeBottom(element) {
  if (isArray(element)) {
    element[element.length - 1] = mergeBottom(element[element.length - 1]);
  }

  else if (typeof element == 'object') {
    switch (element.type) {
      // horizontal elements don't
      case 'calc':
      case 'row':
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
