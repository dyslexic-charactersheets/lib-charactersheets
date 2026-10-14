/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isEmpty, isArray, isString } from '../util';
import { elementClass } from '../util/elements';
import { log, error } from '../log';
import { __, _e } from '../i18n';

function ordinal(n) {
  const suffixes = { 1: 'st', 2: 'nd', 3: 'rd' };
  const mod100 = n % 100;
  return n + (suffixes[n % 10] && mod100 < 11 || mod100 > 13 ? suffixes[n % 10] || 'th' : 'th');
}

function heightenedTerm(entry) {
  if (!isEmpty(entry.plus)) return `_{Heightened (+${entry.plus})}`;
  if (!isEmpty(entry.level)) return `_{Heightened (${ordinal(entry.level)})}`;
  return "_{Heightened}";
}

function heightenedEntries(termdef, min, doc) {
  const entries = isArray(termdef) ? termdef : [termdef];
  return entries.map(entry => {
    const term = min ? "" : (isString(entry) ? "_{Heightened}" : heightenedTerm(entry));
    const content = isString(entry) ? entry : entry.content;
    return `<div><dt>${_e(term, doc)}</dt><dd>${_e(content, doc)}</dd></div> `;
  }).join('');
}

export let dl = {
  name: 'dl',
  key: 'defs',
  defaults: {
    div: false,
    min: false,
    defs: {},
    blk: true,
  },
  render(args, reg, doc) {
    let defs = Object.keys(args.defs).map(term => {
      let termdef = args.defs[term];
      let icon = '';
      if (isEmpty(termdef))
        return '';

      if (term === 'heightened') {
        return heightenedEntries(termdef, args.min, doc);
      }

      switch (term) {
        case 'cast': term = "_{Cast}"; break;
        case 'trigger': term = "_{Trigger}"; break;
        case 'frequency': term = "_{Frequency}"; break;
        case 'duration': term = "_{Duration}"; break;
        case 'range': term = "_{Range}"; break;
        case 'target': term = "_{Target}"; break;
        case 'area': term = "_{Area}"; break;
        case 'save': term = "_{Saving Throw}"; break;
        case 'critical_success': icon = 'save-crit-succeed'; term = "_{Critical Success}"; break;
        case 'success': icon = 'save-succeed'; term = "_{Success}"; break;
        case 'failure': icon = 'save-fail'; term = "_{Failure}"; break;
        case 'critical_failure': icon = 'save-crit-fail'; term = "_{Critical Failure}"; break;
        case 'sustain': term = "_{Sustain}"; break;
        case 'requirement': case 'requirements': term = "_{Requirements}"; break;
        case 'cooldown': term = "_{Cooldown}"; break;
        case 'proficiency': term = "_{Proficiency}"; break;
      }

      if (args.min)
        term = "";

      if (icon !== "") icon = `<i class='icon icon_${icon} size_small'></i>`;
      // log("p", "dl", term, termdef);
      return `<div><dt>${icon}${_e(term, doc)}</dt><dd>${_e(termdef, doc)}</dd></div> `;
    });

    const dlCls = elementClass('dl', null, args, ['div', 'blk']);
    return `<dl${dlCls}>${defs.join("")}</dl>`;
  }
}
