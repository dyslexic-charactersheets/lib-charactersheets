/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { log, warn } from '../log';
import { isString, isNull, isEmpty } from '../util';
import { has } from '../util/objects';
import { mergeBottom } from '../util/elements';

// elements
import { unit } from '../elements/unit';

import { action, selectable } from '../elements/action';
import { advancement } from '../elements/advancement';
import { arrow } from '../elements/arrow';
import { article } from '../elements/article';
import { blockquote } from '../elements/blockquote';
import { box } from '../elements/box';
import { calc } from '../elements/calc';
import { class_icon } from '../elements/class-icon';
import { color } from '../elements/color';
import { dl } from '../elements/dl';
import { each } from '../elements/each';
import { embed } from '../elements/embed';
import { flag, flags } from '../elements/flags';
import { g } from '../elements/g';
import { h1, h2, h3, h4, h5, h6, class_name } from '../elements/headings';
import { hr, tail, vr } from '../elements/hr';
import { icon } from '../elements/icon';
import { ifelem, switchelem } from '../elements/if';
import { label } from '../elements/label';
import { large_print } from '../elements/large-print';
import { layout, place, indent } from '../elements/layout';
import { level, level_marker, cost } from '../elements/level';
import { list, join } from '../elements/list';
import { logelem } from '../elements/log';
import { logo } from '../elements/logo';
import { lookup } from '../elements/lookup';
import { nothing } from '../elements/nothing';
import { page, collate_pages } from '../elements/page';
import { p } from '../elements/p';
import { portrait } from '../elements/portrait';
import { proficiency } from '../elements/proficiency';
import { repeat } from '../elements/repeat';
import { row } from '../elements/row';
import { ruby, ruby_round_down, ruby_round_up } from '../elements/ruby';
import { section } from '../elements/section';
import { sort } from '../elements/sort';
import { slots } from '../elements/slots';
import { spacer, unspacer } from '../elements/spacer';
import { span } from '../elements/span';
import { spells_list, spells_bundle, spells_table } from '../elements/spells-list';
import { spells_list2 } from '../elements/spells-list2';
import { table } from '../elements/table';
import { copy, paste, split } from '../elements/template';
import { ul, li } from '../elements/ul';
import { varelem } from '../elements/var'
import { zone } from '../elements/zone';

import { field } from '../elements/field';
import {
  field_frame_above,
  field_frame_none,
  field_frame_left,
  field_frame_right,
  field_frame_h_label,
  field_frame_annotation,
  field_frame_annotation_box,
  field_frame_circle,
} from '../elements/field-frame';
import {
  field_control_input,
  field_control_value,
  field_control_ref,
  field_control_p,
  field_control_speed,
  field_control_enum,
  field_control_alignment,
  field_control_boost,
  field_control_checkbox,
  field_control_radio,
  field_control_checkgrid,
  field_control_compound,
  field_control_progression,
  field_control_ref_switch,
  field_control_money,
  field_control_weight,
  field_control_counter,
  field_control_proficiency,
  field_control_proficiency_icon,
  field_control_5e_proficiency,
  field_control_action_icon,
  field_control_icon,
  field_control_ability,
} from '../elements/field-control';
import { value, value_block } from '../elements/value';

export class Registry {
  constructor() {
    this.registry = {};
    this.stack = [];

    // load all the elements
    [
      unit,
      // document,

      advancement,
      arrow,
      article,
      blockquote,
      box,
      calc,
      class_name,
      class_icon,
      color,
      each,
      embed,
      flag,
      flags,
      g,
      h1, h2, h3, h4, h5, h6,
      hr, tail, vr,
      icon,
      ifelem, switchelem,
      label,
      large_print,
      layout, place, indent,
      level, level_marker, cost,
      list, join,
      logelem,
      logo,
      lookup,
      nothing,
      page, collate_pages,
      p, ul, li, dl,
      portrait,
      proficiency, action, selectable,
      repeat,
      row,
      ruby, ruby_round_up, ruby_round_down,
      section,
      sort,
      slots,
      spacer, unspacer,
      span,
      spells_list,
      spells_bundle,
      spells_table,
      spells_list2,
      table,
      copy, paste, split,
      unit,
      varelem,
      zone,

      field,
      field_frame_none,
      field_frame_above,
      field_frame_left,
      field_frame_right,
      field_frame_h_label,
      field_frame_annotation,
      field_frame_annotation_box,
      field_frame_circle,
      field_control_input,
      field_control_value,
      field_control_ref,
      field_control_p,
      field_control_speed,
      field_control_enum,
      field_control_alignment,
      field_control_boost,
      field_control_checkbox,
      field_control_radio,
      field_control_checkgrid,
      field_control_compound,
      field_control_ability,
      field_control_progression,
      field_control_ref_switch,
      field_control_money,
      field_control_weight,
      field_control_counter,
      field_control_proficiency,
      field_control_proficiency_icon,
      field_control_5e_proficiency,
      field_control_action_icon,
      field_control_icon,
      value,
      value_block,
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
    let expect = Object.keys(params.defaults).concat(params.expect);
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
    if (isNull(items)) {
      warn("Registry", "Nothing to render");
      return "";
    }
    // log("registry", "Render", items);
    const rendered = items.map(item => this.renderItem(item, doc));
    return rendered.join("");
  }

  renderItem(item, doc) {
    if (item === null) return '';
    item = Object.assign({
      id: null,
      exists: true,
    }, item);

    // check if the item actually exists
    if (isString(item.exists)) {
      item.exists = item.exists.replace(/#{.*?}/g, '');
    }
    if (!item.exists || item.exists === "false") {
      return '';
    }

    if ((doc.largePrint || doc.skipOptional) && has(item, "optional") && item.optional) {
      return '';
    }

    if (item.type == "unit") {
      item.type = item["unit-type"];
    }

    // log("Registry", "renderItem", item.type);
    if (has(this.registry, item.type)) {
      let reg = this.registry[item.type];

      // registered defaults
      Object.keys(item).forEach(key => {
        if (item[key] === null)
          delete item[key];
      });
      item = Object.assign({}, reg.defaults, item);
      if (item.type == "slots") {
        log("Registry", item);
      }

      if (item['merge-bottom']) {
        item = mergeBottom(item);
      }

      let row = [item.type];
      ["id", "title", "layout"].forEach(key => {
        if (has(item, key) && isString(item[key]) && !isEmpty(item[key])) {
          row.push(item[key]);
        }
      });
      this.stack.push(row.join(":"));

      const output = reg.render(item, this, doc);
      this.stack.pop();
      return output;
    } else if (item.type == "item") {
      // safe exception
    } else {
      // log("Registry", "Registry elements", Object.keys(this.registry));
      warn("Registry", "Unknown element type:", item.type, "at:", this.stack, item);
      return '';
    }
  }
}
