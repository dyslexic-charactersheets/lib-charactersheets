const Handlebars = require('handlebars');

import { log, warn, error } from '../log';
import { applyContext } from '../context';
import { clone, replaceColours, has, isArray, isEmpty, isString } from '../util';
import { esc, _e } from '../i18n';

export class Document {
  constructor(baseUnit) {
    this.nextPage = 1;

    const baseDocument = baseUnit.contents[0];
    // log("Document", "Base document", baseDocument);
    this.doc = clone(baseDocument);
    this.language = 'en';
    this.units = [baseUnit];
    this.zones = {};
    this.templates = {};

    this.largePrint = false;
    this.highContrast = false;
    this.printColour = '#808080';
    this.accentColour = '#808080';

    this.faviconURL = false;
    this.logoURL = false;
    this.portraitURL = false;
    this.animalURL = false;
    this.backgroundURL = false;

    this.vars = {};
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

  nextPageNumber() {
    return this.nextPage++;
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

  getVar(varname, typeHint = null) {
    if (!has(this.vars, varname))
      return false;

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
        let directive = Object.keys(include)[0];
        // log("Document", "Incorporating directive:", directive);

        switch (directive) {
          case 'at':
            if (has(include, "add"))
              this.addAtZone(include.at, include.add, false);
            if (has(include, "replace"))
              this.addAtZone(include.at, include.replace, true);
            break;

          case 'set':
            // const isOverride = _.has(include, "override") ? !!include.override : false;
            // const isDefault = _.has(include, "default") ? !!include.default : false;
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
        }
    }
    }
  }

  addAtZone(zoneId, elements, replace) {
    if (zoneId.charAt(0) != '@') {
      error("Document", "Not a zone ID:", zoneId);
      return;
    }
    // log("Document", "Adding to zone:", zoneId);
    if (!has(this.zones, zoneId))
      this.zones[zoneId] = [];
    for (const element of elements) {
      if (replace)
        element.replace = true;
      this.zones[zoneId].push(element);
    }
    // log("compose", "Zone", zoneId, "contents:", zones[zoneId]);
  }

  defineTemplate(templateId, defaults, elements) {
    log("compose", "Defining template:", templateId, defaults);
    this.templates[templateId] = {
      defaults: defaults,
      elements: elements
    };
  }

  getContext() {
    const self = this;
    return { 
      zones: this.zones,
      templates: this.templates,
      largePrint: this.largePrint,
      locale: this.language,
    
      hasVar(varname) {
        return self.hasVar(varname);
      },
      getVar(varname) {
        return self.getVar(varname);
      }
    };
  }

  // the lesser form: only expand a few types, don't do full unit expansion
  completeElement(element, registry) {
    const ctx = this.getContext();

    if (isArray(element))
      return element.flatMap(el => this.completeElement(el, registry));
    if (!has(element, "type"))
      return [element];

    switch (element.type) {
      case 'zone':
      case 'sort':
      case 'slots':
        const reg = registry.get(element.type);

        if (reg && reg.transform) {
          if (has(element, "contents")) {
            element.contents = this.completeElement(element.contents, registry);
          }

          // log("compose", "Applying transformation to", element.type);
          // log("Document", "Large print?", self.largePrint);
          const args = Object.assign({}, reg.defaults, element);
          let newelements = reg.transform(args, ctx);
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
      return element.map(e => this.composeElement(e, registry));
    }
    if (isString(element)) {
      return [element];
    }
    if (!has(element, "type")) {
      // warn("Document", "Untyped element", element);
      return [element];
    }

    // if (element.type == 'table') log("Document", "Compose item", element);

    // first recurse so we have the ingredients
    switch (element.type) {
      case 'advancement':
        element.advances = this.completeElement(element.advances, registry);
        element.fields = this.completeElement(element.fields, registry);
        break;
      case 'table':
        element.rows = this.completeElement(element.rows, registry);
        element.columns = this.completeElement(element.columns, registry);
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
            if (subelement.type == "reduce") {
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
      let newelements = reg.transform(args, ctx);
      if (newelements === false)
        return element;

      // log("compose", "Transformed", element.type, (element.type == "zone" ? element.zone : ''), "into", newelements.length, "elements");
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

    const c = this.composeElement(this.doc, registry);
    this.doc = applyContext(c[0]);
  }

  getFavicon() {
    return '';
  }

  getStylesheet() {
    // find both SASS-compiled and data-URL-embedded parts for each of those
    let cssParts = [];
    this.units.forEach(unit => {
      const css = unit.stylesheet;
      if (css == "")
        return;

      const template = Handlebars.compile(css);
      let rendered = template({});
      if (unit.id != "document")
        rendered = replaceColours(rendered, this.printColour, this.accentColour, this.printIntensity, this.highContrast);
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
      cssParts.push(`.portrait--char_personal .portrait__inner{background-image:url('${this.portraitURL}');}`);
    }

    // animal companion portraits
    if (this.animalURL) {
      cssParts.push(`.portrait--char_animal-companion .portrait__inner{background-image:url('${this.animalURL}');}`);
    }

    // background
    if (this.backgroundURL) {
      cssParts.push(`.page{background-image:url('${this.backgroundURL}'); background-size: 100% 100%;}`);
    } else if (this.backgroundColour) {
      cssParts.push(`.page{background: ${this.backgroundColour};}`);
    }

    return cssParts.join("");
  }

  getJavascript() {
    let jsParts = [];

    this.units.forEach(unit => {
      if (!has(unit, "js") || unit.js == "")
        return;
      jsParts.push(unit.js);
    });

    return jsParts.join("\n");
  }

  renderDocument(registry) {
    const favicon = this.faviconURL ? `<link id="favicon" rel="shortcut icon" type="image/png" href='${this.faviconURL}' />` : ''
    const stylesheet = this.getStylesheet();
    const javascript = this.getJavascript();

    return `<!DOCTYPE html>
<html lang='${this.language}'>
<head>
<meta charset='utf-8'/>
<title>${esc(this.doc.title)}</title>
${favicon}
<style>
${stylesheet}
</style>
</head>

<body>

<main>
${registry.render(this.doc.contents, this)}
</main>

<div class='screen-message' id='screen-message-safari'>
<p>Backgrounds are currently unavailable on Safari and iOS devices.</p>
<p>If printing on Safari, please deselect "Print headers and footers".</p>
</div>
<nav id='screen-buttons'>
<button id='button--print' onclick="window.print();return false;">Print</button>
</nav>
<script type='text/javascript'>
${javascript}
</script>
</body>
</html>`;
  }
}
