const Handlebars = require('handlebars');

import { log, warn, error, trace } from '../log';
import { applyContext } from '../context';
import { isArray, isEmpty, isString, isNull, isObject } from '../util';
import { replaceColours } from '../util/colours';
import { has, cloneDeep, interpolate } from '../util/objects';
import { esc, _e, __, translate } from '../i18n';
import { table } from '../elements/table';

// Set up the template engine for JS and CSS
Handlebars.registerHelper('embedJson', function (data, options) {
  return JSON.stringify(data);
});

const controlMenus = '';

export class Document {
  constructor(baseUnit, id) {
    this.nextPage = 1;
    this.primary = {};

    const baseDocument = baseUnit.contents[0];
    // log("Document", "Base document", baseDocument);
    this.doc = cloneDeep(baseDocument);
    this.id = id;
    this.language = 'en';
    this.measurementUnits = '';
    this.units = [baseUnit];
    this.zones = {};
    this.templates = {};
    this.delayedBlocks = [];
    this.cssParts = [];
    this.jsParts = [];

    this.browserTarget = false;
    this.largePrint = false;
    this.skipOptional = false;
    this.highContrast = false;
    this.printColour = '#808080';
    this.accentColour = '#808080';

    this.faviconURL = false;
    this.logoURL = false;
    this.portraitURL = false;
    this.animalURL = false;
    this.backgroundURL = false;

    this.vars = {};

    this.pageNumbers = {};
  }

  set title(title) {
    this.doc.title = title;
  }

  get title() {
    return this.doc.title;
  }

  get watermark() {
    return this.doc.watermark;
  }

  set watermark(watermark) {
    this.doc.watermark = watermark;
  }

  get largePrint() {
    return this.doc.largePrint;
  }

  set largePrint(large) {
    this.doc.largePrint = large;
  }

  hasUnit(id) {
    return this.units.map((unit) => unit.id).includes(id)
  }

  setMeasurementUnits(units) {
    if (isEmpty(units)) {
      switch (this.language) {
        case 'en':
        case 'jp':
          units = "imperial";
          break;
        
        case 'fr':
        case 'it':
        case 'pl':
        case 'pt':
        case 'de':
        case 'es':
        case 'ru':
        case 'nl':
        case 'no':
          units = "metric";
          break;

        case 'zh':
          units = "chinese";
          break;
      }
    }
    log("Document", "Measurement units", this.language, units);
    this.measurementUnits = units;
  }

  nextPageNumber(id) {
    let number = this.nextPage++;
    this.pageNumbers[id] = number;
    return number;
  }

  // TODO more parameters

  hasVar(varname) {
    return has(this.vars, varname);
  }

  setVar(varname, value, priority = "medium") {
    if (!has(this.vars, varname)) {
      this.vars[varname] = [];
    }

    this.vars[varname].push({
      set: varname,
      priority: priority,
      value: value,
    });
  }

  getVar(varname, format = null) {
    if (!has(this.vars, varname)) {
      if (!isNull(format)) {
        switch (format) {
          case 'string': return '';
          case 'number': return 0;
          case 'boolean': return false;
        }
      }
      return false;
    }

    // separate the stored vars by priority
    const high = [], medium = [], low = [];
    for (const include of this.vars[varname]) {
      let priority = has(include, "priority") ? include.priority : 'medium';
      switch (priority) {
        case 'high': high.push(include.value); break;
        case 'medium': medium.push(include.value); break;
        case 'low': default: low.push(include.value); break;
      }
    }
    const incs = isEmpty(high) ? (isEmpty(medium) ? low : medium) : high;
    // log("Document", `get var '${varname}': ${JSON.stringify(incs)}`);
    if (isEmpty(incs)) return false;

    // TODO type hints

    // TODO combine multiple values somehow
    let is_array = false;
    for (const include of incs) {
      if (isArray(include.value))
        is_array = true;
    }

    if (is_array) {
      let values = [];
      for (const include of incs) {
        if (isArray(include.value)) {
          values = values.concat(include.value);
        } else {
          values.push(include.value);
        }
      }
      return values;
    }

    return incs[0];
  }

  addUnit(unit) {
    if (unit == null)
      return;

    // log("Document", "Incorporating unit:", unit.id);
    this.units.push(unit);

    if (has(unit, "inc")) {
      for (const include of unit.inc) {
        // log("Document", "Incorporating directive:", directive);
        this.addDirective(include);
      }
    }
  }

  addDirective(include) {
    let directive = Object.keys(include)[0];
    switch (directive) {
      case 'at':
        if (has(include, "add"))
          this.addAtZone(include.at, include.add, false);
        if (has(include, "replace"))
          this.addAtZone(include.at, include.replace, true);
        break;

      case 'set':
        if (!has(this.vars, include.set))
          this.vars[include.set] = [];
        this.vars[include.set].push(include);
        break;

      case 'copy':
        // log("Document", "Copy template:", include.copy);
        this.templates[include.copy] = {
          params: include.params,
          contents: include.contents,
        };
        break;

      case 'paste':
        // log("Document", "Add delayed block", include);
        this.delayedBlocks.push({
          template: include.paste,
          params: include.params
        });
        break;
    }
  }

  addAtZone(zoneId, elements, replace) {
    if (zoneId.charAt(0) != '@') {
      error("Document", "Not a zone ID:", zoneId);
      return;
    }
    // log("Document", "Adding to zone:", zoneId);
    if (!has(this.zones, zoneId)) {
      this.zones[zoneId] = [];
    }
    if (isNull(elements) || isEmpty(elements)) {
      return;
    }
    for (const element of elements) {
      if (isNull(element))
        continue;
      if (replace && isObject(element))
        element.replace = true;
      this.zones[zoneId].push(element);
    }
    // log("compose", "Zone", zoneId, "contents:", zones[zoneId]);
  }

  defineTemplate(templateId, defaults, elements) {
    // log("compose", "Defining template:", templateId, defaults);
    this.templates[templateId] = {
      defaults: defaults,
      elements: elements
    };
  }

  getContext() {
    const self = this;
    return {
      isLoggedIn: this.isLoggedIn,
      isCalc: this.isLoggedIn && !this.noCalc,
      zones: this.zones,
      templates: this.templates,
      largePrint: this.largePrint,
      skipOptional: this.skipOptional,
      locale: this.language,
      measurementUnits: this.measurementUnits,

      hasVar(varname) {
        return self.hasVar(varname);
      },
      getVar(varname, format = null) {
        return self.getVar(varname, format);
      }
    };
  }

  // the lesser form: only expand a few types, don't do full unit expansion
  completeElement(element, registry) {
    const ctx = this.getContext();

    if (isArray(element)) {
      return element.flatMap(el => this.completeElement(el, registry));
    }
    if (!has(element, "type")) {
      return [element];
    }

    switch (element.type) {
      case 'zone':
      case 'sort':
      case 'slots':
      case 'if':
      case 'large-print':
        const reg = registry.get(element.type);

        if (reg && reg.transform) {
          if (has(element, "contents")) {
            element.contents = this.completeElement(element.contents, registry);
          }

          // log("compose", "Applying transformation to", element.type, (element.type == "zone" ? element.zone : (has(element, "id") ? element.id : '')));
          // log("Document", "Large print?", self.largePrint);
          const args = Object.assign({}, reg.defaults, element);
          let newelements = reg.transform(args, ctx, reg);
          if (newelements === false)
            return element;

          newelements = newelements.flatMap(el => this.completeElement(el, registry));
          return newelements;
        }
        break;
    }
    return [element];
  }

  // the greater form: give all elements a chance to transform themselves
  composeElement(element, registry) {
    const ctx = this.getContext();

    if (element === null) {
      warn("Document", "Null element");
      return [];
    }
    if (isArray(element)) {
      // log("compose", "Composing array of", element.length, "items");
      return element.flatMap((e) => this.composeElement(e, registry));
    }
    if (isString(element)) {
      return [element];
    }
    if (!has(element, "type")) {
      if (has(element, "cells")) {
        // log("compose", (element._direct ? "Direct table" : "Table"), "row:", element.cells);
        element.cells = element.cells.flatMap((e) => this.completeElement(e, registry));
        // log("compose", "Table row transformed:", element.cells);
      } else {
        // warn("Document", "Untyped element", element);
        return [element];
      }
    }

    // if (element.type == 'table') log("Document", "Compose item", element);

    // first recurse so we have the ingredients
    switch (element.type) {
      case 'data':
        element.data = this.completeElement(element.data, registry);
        break;
      case 'advancement':
        element.advances = this.completeElement(element.advances, registry);
        element.fields = this.completeElement(element.fields, registry);
        break;
      case 'table':
        // log("compose", "Adjusting", (element._direct ? "direct table" : "table"), (has(element, "id") ? element.id : ''), "cells", has(element, "id") ? element.id : '');
        if (has(element, "rows") && !isEmpty(element.rows)) {
          
          if (has(element, "_direct") && element._direct && !has(element, "template")) {
            element.rows = this.composeElement(element.rows, registry);
            element.rows = element.rows.map(row => {
              if (has(row, "cells")) {
                row.cells = row.cells.flatMap((e) => this.composeElement(e, registry));
              }
              return row;
            });
          } else {
            element.rows = this.completeElement(element.rows, registry);
          }
        }
        if (has(element, "columns") && !isEmpty(element.columns)) {
          element.columns = this.completeElement(element.columns, registry);
        }
        // log("compose", `Adjusted ${(element._direct ? "direct table" : "table")} ${has(element, "id") ? element.id : ''}: ${has(element, "rows") ? element.rows.length : 'no'} rows, ${has(element, "columns") ? element.columns.length : 'no'} columns`);
        break;
      case 'lookup':
        element.lookup = this.completeElement(element.lookup, registry);
        break;
      case 'if':
        // log("compose", "if", element.condition)
        element.then = this.completeElement(element.then, registry);
        element.else = this.completeElement(element.else, registry);
        break;
      case 'large-print':
        element.contents = this.completeElement(element.contents, registry);
        element.else = this.completeElement(element.else, registry);
        break;
      case 'spells-list':
        if (has(element, 'special-value')) {
          element['special-value'] = this.completeElement(element['special-value'], registry);
        }
        break;
    }

    for (const item_key of ["contents", "placeholder", "header", "inputs", "parts"]) {
      // log("compose", "Checking for", item_key);
      if (has(element, item_key)) {
        // log("compose", "Preparing item", item_key, element[item_key]);
        if (isArray(element[item_key]))
          element[item_key] = element[item_key].flatMap(el => this.composeElement(el, registry));
        else
          element[item_key] = this.composeElement(element[item_key], registry);
      }
    }

    switch (element.type) {
      case 'slots':
        if (has(element, "contents")) {
          element.contents = element.contents.flatMap(subelement => {
            if (has(subelement, "type") && subelement.type == "reduce") {
              let reduce = has(subelement, "reduce") ? subelement.reduce : 1;
              if (isEmpty(reduce)) reduce = 1;
              // log("Document", "Reducing slots", subelement.reduce, `min = ${element.min}, max = ${element.max}`);
              element.min -= reduce;
              // log("Document", `min = ${element.min}, max = ${element.max}`);
              return [];
            }
            return [subelement];
          });
        }
        break;
    }

    // transform the element
    const reg = registry.get(element.type);
    // log("compose", "Registry entry for", element.type, reg);

    if (reg && reg.transform) {
      // log("compose", "Applying transformation to", element.type);
      const args = Object.assign({}, reg.defaults, element);
      let newelements = reg.transform(args, ctx, reg);
      if (newelements === false)
        return element;

      // log("compose", "Transformed", element.type, (element.type == "zone" ? element.zone : (has(element, "id") ? element.id : ((has(element, "template") && isString(element.template)) ? element.template : ''))), "into", newelements.length, "elements");
      newelements = newelements.flatMap(el => this.composeElement(el, registry));
      return newelements;
    }

    return [element];
  }

  composeDocument(registry) {
    // log("Document", "Compose document");
    // log("compose", " - Doc:", this.doc);
    // log("compose", " - Zones:", zones);
    // log("compose", " - Templates:", templates);
    // log("compose", " - Registry", registry);

    // Expand unit-level paste blocks
    const self = this;
    while (this.delayedBlocks.length > 0) {
      let blocks = this.delayedBlocks;
      this.delayedBlocks = [];
      blocks.forEach((block) => {
        // log("Document", "Delayed block", block);
        if (!has(self.templates, block.template)) {
          warn("Document", "Cannot find delayed block template", block.template);
          return;
        }

        let template = self.templates[block.template];
        if (isEmpty(template)) {
          warn("Document", "Empty delayed block template", block.template);
          return;
        }

        // log("Document", "Delayed block template", template);
        let contents = cloneDeep(template.contents);
        if (has(block, "params") || has(template, "params")) {
          let params = { ...template.params, ...block.params };
          // log("Document", "Interpolating parameters", params);
          contents = interpolate(contents, params, this);
        }
        // log("Document", "Block content", contents);
        contents.forEach(directive => {
          self.addDirective(directive);
        });
      });
    }

    // Fill in the element tree
    const c = this.composeElement(this.doc, registry);
    this.doc = applyContext(c[0]);

    // log("Document", " - Pages", this.doc.contents.map(page => `${page.id}: ${page.name}`));
  }

  getCalculations(registry) {
    let fields = [];
    let calcFields = {};
    let dependencies = {};
    let formats = {};

    let doc = this;

    function pushDependency(ref, id) {
      if (!has(dependencies, ref)) {
        dependencies[ref] = [];
      }
      dependencies[ref].push(id);
    }

    function pushCalculation(id, eq, forgiving = false) {
      if (has(calcFields, id)) {
        if (!forgiving && calcFields[id] != eq) {
          error("Document", `Duplicate calculation ${id}:\n   `, calcFields[id], '\n   ', eq);
        }
      } else {
        calcFields[id] = eq;
        fields.push({
          id: id,
          eq: eq
        });
      }
    }

    function findCalculationFields(element) {
      function transformCalculation(id, eq) {
        let requiredFields = new Set();
        eq = eq.replace(/#\{(.*?)\}/g, (match, field) => {
          warn("Document", "Transform calculation: Unknown interpolation", field, element);
          return 0;
        });
        eq = eq.replace(/_\{(.*?)\}/g, (match, string) => {
          return `"${string}"`;
        });
        // log("Document", "Transform calculation", eq);
        eq = eq.replace('default(', 'defaultValue(');
        eq = eq.replace(/%\{(.*?)\}/g, (match, field) => {
          pushDependency(field, id);
          // var found = field.match(/(.*)\|(.*)/);
          // if (found !== null) {
          //   var fieldPart = found[1];
          //   var defaultPart = found[2];
          //   return `v('${fieldPart}', ${defaultPart})`;
          // }
          var found = field.match(/^[0-9]+$/);
          if (found !== null) {
            return found[0];
          }
          if (!field.match(/-misc$/)) {
            requiredFields.add(`'${field}'`);
          }
          return `v('${field}')`;
        });
        return `(v) => req([${[...requiredFields].join(',')}],${eq})`;
      }

      // fields
      if (has(element, "type") && element.type == "field") {
        // log("Document", `Field: id = ${element.id}, ref = ${element.ref}`);
        if (!has(element, "id") && !has(element, "ref") && element.control != "value") {
          trace(registry, "Document", "Field with no ID or reference", element);
        }

        if (has(element, "eq")) {
          if (!isString(element.eq)) {
            trace(registry, "Document", "eq value not a string:", element);
          } else if (element.eq == "") {
            trace(registry, "Document", "eq value empty", element);
          } else {
            // og("Document", `Field ${element.id} = ${element.eq}`);
            switch (element.control) {
              case 'speed':
                let subid = doc.measurementUnits == 'metric' ? element.id+'--m' : element.id+'--ft';
                let affix = doc.measurementUnits == 'metric' ? '--m' : '--ft';
                // log("Document", "Speed eq", element.eq);
                let eq = element.eq.replace(/%\{(.*speed)\}/g, "%{$1"+affix+"}");
                pushCalculation(subid, transformCalculation(subid, eq));
                break;

              default:
                pushCalculation(element.id, transformCalculation(element.id, element.eq));
                break;
            }
          }
        }

        if (has(element, "format")) {
          formats[element.id] = element.format;
        }
        if (has(element, "parts")) {
          element.parts.forEach(part => {
            if (has(part, "eq") && has(part, "subid")) {
              let partid = (part.subid == "") ? element.id : element.id+'-'+part.subid;
              // log("Document", "Sub-field calculation", partid, part.eq);
              pushCalculation(partid, transformCalculation(partid, part.eq));
              if (has(part, "format")) {
                formats[partid] = part.format;
              }
            }
          });
        }
        switch (element.control) {
          case 'speed':
            if (doc.measurementUnits == "metric") {
              pushCalculation(`${element.id}--sq`,
                transformCalculation(element.id+'--sq', `floor(%{${element.id}--m}/1.5)`), true);
              formats[element.id+'--m'] = 'decimal';
            } else {
              pushCalculation(`${element.id}--sq`,
                transformCalculation(element.id+'--sq', `floor(%{${element.id}--ft}/5)`), true);
            }
            break;
        }
      }

      // calculations
      if (has(element, "type") && element.type == "calc") {
        if (has(element, "output")) {
          findCalculationFields(element.output);
        }
        if (has(element, "inputs")) {
          element.inputs.forEach(elem => findCalculationFields(elem));
        }
      }

      // tables
      if (has(element, "type") && element.type == "table") {
        // log("Document", "Calculation fields: table");
        element.rows.forEach((row) => {
          if (has(row, "cells")) {
            row.cells.forEach((elem) => {
              // log("Document", "Calculation fields: blank element");
              if (isNull(elem)) {
                return;
              }
              // log("Document", `Calculation fields: table cell: ${elem.type} ${elem.id}`);
              findCalculationFields(elem);
            });
          }
        });
      }

      // if
      if (has(element, "type") && element.type == "if") {
        // log("Document", `Calculation fields: if ${element.condition}`);
        if (has(element, "then")) {
          element.then.forEach((elem) => findCalculationFields(elem));
        }
        if (has(element, "else")) {
          element.else.forEach((elem) => findCalculationFields(elem));
        }
      }

      // other
      if (has(element, "contents")) {
        element.contents.forEach(elem => findCalculationFields(elem));
      }
    }

    findCalculationFields(this.doc);
    // log("Document", "Calculation fields", fields);

    let calculations = '{'+fields.map(field => `'${field.id}': ${field.eq}`).join(",\n")+'}';

    Object.keys(dependencies).forEach((key) => {
      dependencies[key] = [...new Set(dependencies[key])];
    });
    delete dependencies[0];
    
    return {calculations, formats, dependencies};
  }

  getFavicon() {
    return '';
  }

  getStylesheet() {
    // find both SASS-compiled and data-URL-embedded parts for each of those
    let cssParts = [];
    log("Document", "Colours", this.printColour, this.accentColour);
    this.units.forEach(unit => {
      const css = unit.stylesheet;
      if (css == "")
        return;

      log("Document", "CSS part for unit:", unit.id);
      const template = Handlebars.compile(css);
      let rendered = template({});
      if (unit.id != "document") {
        log("Document", "Replacing unit colours", unit.id, this.printColour, this.accentColour);
        rendered = replaceColours(rendered, this.printColour, this.accentColour, this.printIntensity, this.highContrast);
      }
      cssParts.push(rendered);
    });

    // put it all together
    // log("Document", "Found", cssParts.length, "stylesheet parts");

    // logo
    if (this.logoURL) {
      cssParts.push(`.logo{background-image:url('${this.logoURL}');}`);
    }

    // portrait
    if (this.portraitURL) {
      cssParts.push(`.portrait--char_personal .portrait__inner,.index-button[data-page='cover'] .index-button__icon{background-image:url('${this.portraitURL}');}`);
    }

    // animal companion portraits
    if (this.animalURL) {
      cssParts.push(`.portrait--char_animal-companion .portrait__inner{background-image:url('${this.animalURL}');}`);
    }

    // background
    if (this.backgroundURL) {
      cssParts.push(`.page__background{background-image:url('${this.backgroundURL}'); background-size: 100% 100%;}`);
    } else if (this.backgroundColour) {
      cssParts.push(`.page__background{background: ${this.backgroundColour} !important;}`);
    }

    // custom extras
    this.cssParts.forEach(css => {
      this.cssParts.push(css);
    });

    return cssParts.join("");
  }

  getJavascript(registry) {
    let doc = this;
    let jsParts = [];

    let {calculations, formats, dependencies} = this.getCalculations(registry);

    if (isEmpty(this.request)) {
      warn("Document", "Request is unset", this.doc.title);
      this.request = {};
    }
    let templateData = {
      title: this.doc.title,
      summary: this.summary,
      fieldValues: {
        level: 2,
        foo: "bar",
      },
      request: JSON.stringify(this.request),
      calculations: calculations,
      dependencies: JSON.stringify(dependencies),
      formats: JSON.stringify(formats)
    };

    function processJS(js) {
      const template = Handlebars.compile(js);
      js = template(templateData);
      return __(js, doc);


      // return js; // .replace(/\/\*.*?\*\//g, '');
    }

    this.units.forEach(unit => {
      if (!has(unit, "js") || unit.js == "")
        return;
      jsParts.push(processJS(unit.js));
    });

    // custom extras
    this.jsParts.forEach(js => {
      jsParts.push(processJS(js));
    });

    return jsParts.join("\n");
  }

  // getAsset(unitid, file) {
  //   this.units.forEach(unit => {
  //     if (unit.id == unitid) {
  //     }
  //   });
  // }

  // getAssetParts(file) {
  //   let parts = [];
  //   this.units.forEach((unit) => {
  //   });
  //   return parts;
  // }

  renderDocument(registry) {
    // log("Document", "Pages", this.doc.contents.map(page => `${page.id}: ${page.name}`));

    const documentId = this.id;
    const favicon = this.faviconURL ? `<link id="favicon" rel="shortcut icon" type="image/png" href='${this.faviconURL}' />` : ''
    const stylesheet = this.getStylesheet();
    const javascript = this.getJavascript(registry);

    let htmlClasses = [];
    if (this.browserTarget) {
      htmlClasses.push("html--"+this.browserTarget);
    }

    let isLoggedIn = this.isLoggedIn;

    // the actual content
    let mainContent = registry.render(this.doc.contents, this);

    // get pages for index
    let pages = this.doc.contents.filter((elem) => elem.type == 'page');
    // log('Document', 'Pages', pages);
    // log('Document', 'Page numbers', this.pageNumbers);
    let pageIcons = {
      permission: "d20"
    };
    let indexButtons = `<nav id='index-buttons'>
  ${pages.map((page) => `<button class='index-button${page.landscape ? ' index-button--landscape' : ''}' data-page='${page.id}'>
    <span class='index-button__page'>
      <i class='index-button__icon${has(pageIcons, page.id) ? ` icon icon_${pageIcons[page.id]}` : ''}'></i>
      ${(has(this.pageNumbers, page.id)) ? `<span class='index-button__number'>${this.pageNumbers[page.id]}</span>` : ''}
    </span>
    <span class='index-button__label'>${__(page.name, this.doc)}</span>
  </button>`).join("")}
</nav>`;

    // edit
    let controlMenus = '';
    if (this.hasUnit('data/edit')) {
      controlMenus = `
<nav id='proficiency-menu' class='control-menu'><div>
<label for='proficiency-menu-untrained'><input type='radio' name='proficiency-menu' value='untrained' id='proficiency-menu-untrained'> <i class="icon icon_proficiency-untrained"></i> ${__('Untrained')}</label>
<label for='proficiency-menu-trained'><input type='radio' name='proficiency-menu' value='trained' id='proficiency-menu-trained'> <i class="icon icon_proficiency-trained"></i> ${__('Trained')}</label>
<label for='proficiency-menu-expert'><input type='radio' name='proficiency-menu' value='expert' id='proficiency-menu-expert'> <i class="icon icon_proficiency-expert"></i> ${__('Expert')}</label>
<label for='proficiency-menu-master'><input type='radio' name='proficiency-menu' value='master' id='proficiency-menu-master'> <i class="icon icon_proficiency-master"></i> ${__('Master')}</label>
<label for='proficiency-menu-legendary'><input type='radio' name='proficiency-menu' value='legendary' id='proficiency-menu-legendary'> <i class="icon icon_proficiency-legendary"></i> ${__('Legendary')}</label>
<hr/>
<div id='proficiency-menu__level-hint' class='row valign_center'><div class='row__inner'>
<span>=</span><span id='proficiency-menu__ref-level'></span><label>Level</label> <span>+</span> <span id='proficiency-menu__plus'></span><span class='spacer'></span>
</div></div>
</div></nav>

<nav id='action-menu' class='control-menu'><div>
<label for='action-menu-template'><input type='radio' name='action-menu' value='template' id='action-menu-template'> <i class="icon icon_action-template"></i> ${__('')}</label>
<label for='action-menu-1'><input type='radio' name='action-menu' value='1' id='action-menu-1'> <i class="icon icon_action"></i> ${__('One action')}</label>
<label for='action-menu-2'><input type='radio' name='action-menu' value='2' id='action-menu-2'> <i class="icon icon_action2"></i> ${__('Two actions')}</label>
<label for='action-menu-3'><input type='radio' name='action-menu' value='3' id='action-menu-3'> <i class="icon icon_action3"></i> ${__('Three actions')}</label>
<label for='action-menu-reaction'><input type='radio' name='action-menu' value='reaction' id='action-menu-reaction'> <i class="icon icon_reaction"></i> ${__('Reaction')}</label>
<label for='action-menu-free'><input type='radio' name='action-menu' value='free' id='action-menu-free'> <i class="icon icon_free-action"></i> ${__('Free action')}</label>
</div></nav>

<nav id='counter-menu' class='control-menu'><div>
<label for='counter-menu-0'><input type='radio' name='counter-menu' value='0' id='counter-menu-0'> <i class="icon icon_counter-0"></i> ${__('None')}</label>
<label for='counter-menu-1'><input type='radio' name='counter-menu' value='1' id='counter-menu-1'> <i class="icon icon_counter-1"></i> ${__('1')}</label>
<label for='counter-menu-2'><input type='radio' name='counter-menu' value='2' id='counter-menu-2'> <i class="icon icon_counter-2"></i> ${__('2')}</label>
<label for='counter-menu-3'><input type='radio' name='counter-menu' value='3' id='counter-menu-3'> <i class="icon icon_counter-3"></i> ${__('3')}</label>
</div></nav>

<!--
<nav id='ref-switch-menu' class='control-menu'><div>
<table><tr>

<td><label for='ref-switch-STR'><input type='radio' name='ref-switch' value='STR' id='ref-switch-STR'></label></td>
<td>
<div id="field-ref-switch-STR" class="field field--ref field--frame_above field--width_medium"><div class="field__frame"><label for='ref-switch-STR' class="label align_centre">${__('STR')}</label><div class="field__box"><div class="field__control field__control--width_medium"><input ref="STR" readonly></div></div></div></div>
</td>

<td><label for='ref-switch-DEX'><input type='radio' name='ref-switch' value='DEX' id='ref-switch-DEX'></label></td>
<td>
<div id="field-ref-switch-DEX" class="field field--ref field--frame_above field--width_medium"><div class="field__frame"><label for='ref-switch-DEX' class="label align_centre">${__('DEX')}</label><div class="field__box"><div class="field__control field__control--width_medium"><input ref="DEX" readonly></div></div></div></div>
</td>

</tr></table>
</div></nav>
-->

<nav id='alignment-menu' class='control-menu'><div>
<table>
<tr><td></td>
  <th colspan='3' class='control-menu__col-head'><i class="icon icon_lawful"></i></th></tr>

<tr><th rowspan='3' class='control-menu__row-head'><i class="icon icon_good"></i></th>
  <td><label for='alignment-menu-lg'><input type='radio' name='alignment-menu' value='lg' id='alignment-menu-lg'> ${__('Lawful Good')}</label></td>
  <td><label for='alignment-menu-ln'><input type='radio' name='alignment-menu' value='ln' id='alignment-menu-ln'> ${__('Lawful Neutral')}</label></td>
  <td><label for='alignment-menu-le'><input type='radio' name='alignment-menu' value='le' id='alignment-menu-le'> ${__('Lawful Evil')}</label></td>
  <th rowspan='3' class='control-menu__row-head'><i class="icon icon_evil"></i></th></tr>
  
<tr>
  <td><label for='alignment-menu-ng'><input type='radio' name='alignment-menu' value='ng' id='alignment-menu-ng'> ${__('Neutral Good')}</label></td>
  <td><label for='alignment-menu-nn'><input type='radio' name='alignment-menu' value='nn' id='alignment-menu-nn'> ${__('True Neutral')}</label></td>
  <td><label for='alignment-menu-ne'><input type='radio' name='alignment-menu' value='ne' id='alignment-menu-ne'> ${__('Neutral Evil')}</label></td>
  </tr>

<tr>
  <td><label for='alignment-menu-cg'><input type='radio' name='alignment-menu' value='cg' id='alignment-menu-cg'> ${__('Chaotic Good')}</label></td>
  <td><label for='alignment-menu-cn'><input type='radio' name='alignment-menu' value='cn' id='alignment-menu-cn'> ${__('Chaotic Neutral')}</label></td>
  <td><label for='alignment-menu-ce'><input type='radio' name='alignment-menu' value='ce' id='alignment-menu-ce'> ${__('Chaotic Evil')}</label></td>
  </tr>

<tr><td></td>
  <th colspan='3' class='control-menu__col-head'><i class="icon icon_chaotic"></i></th></tr>

<tr><td></td>
  <td><label for='alignment-menu-none'><input type='radio' name='alignment-menu' value='' id='alignment-menu-none'> ${__('None')}</label></td></tr>

</table>
</div></nav>

<nav id='enum-menu' class='control-menu'><div id='enum-menu__holder'></div></nav>`;
    }

    return `<!DOCTYPE html>
<html lang='${this.language}' class='${htmlClasses.join(" ")}'>
<head>
<meta charset='utf-8'/>
<title>${esc(this.doc.title)}</title>
${favicon}
<style>
${stylesheet}
</style>
</head>

<body id='${documentId}'>

${indexButtons}

<main>
${mainContent}
</main>

<div class='screen-message' id='screen-message-safari'>
<p>Backgrounds are currently unavailable on Safari and iOS devices.</p>
<p>If printing on Safari, please deselect "Print headers and footers".</p>
</div>
<nav id='screen-buttons'>
<button id='button--print' onclick="window.print();return false;"><i></i> ${__('Print')}</button>
${isLoggedIn ? `<button id='button--save' class="btn button--disabled"><i></i> ${__('Save')}</button>` : ''}

</nav>

${controlMenus}

<script type='text/javascript'>
${javascript}
</script>
</body>
</html>`;
  }
}
