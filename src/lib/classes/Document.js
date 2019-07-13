import * as _ from 'lodash';

const Handlebars = require('handlebars');

import { applyContext } from '../context';
import { esc, replaceColours } from '../util';

export class Document {
  constructor(baseUnit) {
    var baseDocument = baseUnit.contents[0];
    // log("Document", "Base document", baseDocument);
    this.doc = _.cloneDeep(baseDocument);
    this.units = [baseUnit];
    this.zones = {};
    this.templates = {};

    this.printColour = '#808080';
    this.accentColour = '#808080';

    this.faviconURL = false;
    this.logoURL = false;
    this.portraitURL = false;
    this.animalURL = false;
    this.backgroundURL = false;
  }

  set title(title) {
    this.doc.title = title;
  }

  // TODO more parameters

  addUnit(unit) {
    if (unit == null)
      return;

    log("Document", "Incorporating unit:", unit.id);
    this.units.push(unit);

    if (unit.hasOwnProperty("inc")) {
      unit.inc.forEach(include => {
        // log("Character", "At:", include);
        if (include.hasOwnProperty("at")) {
          if (include.hasOwnProperty("add"))
            this.addAtZone(include.at, include.add, false);
          if (include.hasOwnProperty("replace"))
            this.addAtZone(include.at, include.replace, true);
        }
      });
    }

    // TODO set variables
  }

  addAtZone(zoneId, elements, replace) {
    if (zoneId.charAt(0) != '@') {
      err("Document", "Not a zone ID:", zoneId);
      return;
    }
    log("Document", "Adding to zone:", zoneId);
    if (!this.zones.hasOwnProperty(zoneId))
      this.zones[zoneId] = [];
    elements.forEach(element => {
      if (replace)
        element.replace = true;
      this.zones[zoneId].push(element);
    });
    // log("compose", "Zone", zoneId, "contents:", zones[zoneId]);
  }

  defineTemplate(templateId, defaults, elements) {
    log("compose", "Defining template:", templateId, defaults);
    this.templates[templateId] = {
      defaults: defaults,
      elements: elements
    };
  }

  composeDocument(registry) {
    log("Document", "Compose document");
    log("compose", " - Doc:", this.doc);
    // log("compose", " - Zones:", zones);
    // log("compose", " - Templates:", templates);
    // log("compose", " - Registry", registry);

    var self = this;

    function compose(element) {
      if (element === null) {
        warn("Document", "Null element");
        return [];
      }
      if (!element.hasOwnProperty("type")) {
        warn("Document", "Untyped element", element);
        return [element];
      }

      // if (element.type == 'table') log("Document", "Compose item", element);

      // first recurse so we have the ingredients
      ["contents", "placeholder", "header", "inputs"].forEach(item_key => {
        // log("compose", "Checking for", item_key);
        if (element.hasOwnProperty(item_key)) {
          // log("compose", "Preparing item", item_key, element[item_key]);
          if (Array.isArray(element[item_key]))
            element[item_key] = _.flatMap(element[item_key], compose);
          else
            element[item_key] = compose(element[item_key]);
        }
      });

      // transform the element
      var reg = registry.get(element.type);
      // log("compose", "Registry entry for", element.type, reg);

      if (reg && reg.transform) {
        // log("compose", "Applying transformation to", element.type);
        var newelements = reg.transform(_.defaults(element, reg.defaults), { zones: self.zones, templates: self.templates });
        if (newelements === false)
          return element;

        newelements = _.flatMap(newelements, compose);
        return newelements;
      }

      // if (element.type == "article") log("compose", "Composed element:", element);
      // if (element.hasOwnProperty('merge-bottom') && !!element['merge-bottom']) {
      //     // log("compose", "Merge bottom:", element);
      //     element = mergeBottom(element);
      //     if (element.type == 'article') log("compose", "Result:", element);
      // }

      return [element];
    }

    var c = compose(this.doc);
    this.doc = c[0];
    this.doc = applyContext(this.doc);
  }

  getFavicon() {
    return '';
  }

  getStylesheet() {
    // find both SASS-compiled and data-URL-embedded parts for each of those
    var cssParts = [];
    this.units.forEach(unit => {
      var css = unit.stylesheet;
      if (css == "")
        return;

      var template = Handlebars.compile(css);
      var rendered = template({});
      if (unit.id != "document")
        rendered = replaceColours(rendered, this.printColour, this.accentColour);
      cssParts.push(rendered);
    });

    // put it all together
    log("stylesheet", "Found", cssParts.length, "stylesheet parts");

    // logo
    if (this.logoURL) {
      // var logoURL = getDataURL(characterSheet.game+"/base", characterSheet.logo);
      cssParts.push(`.logo{background-image:url('${this.logoURL}');}`);
    }

    // portrait
    if (this.portraitURL) {
      // var portraitURL = getDataURL(characterSheet.game+"/base", characterSheet.portrait);
      cssParts.push(`.portrait--char_personal .portrait__inner{background-image:url('${this.portraitURL}');}`);
    }

    // animal companion portraits
    if (this.animalURL) {
      cssParts.push(`.portrait--char_animal-companion .portrait__inner{background-image:url('${this.animalURL}');}`);
    }

    // background
    if (this.backgroundURL) {
      // var backgroundURL = getDataURL("core", characterSheet.background);
      cssParts.push(`.page{background-image:url('${this.backgroundURL}'); background-size: 100% 100%;}`);
    }

    return cssParts.join("");
  }

  renderDocument(registry) {
    // TODO load favicon
    // var faviconData = getDataURL("core", "images/"+args.favicon);

    var favicon = this.faviconURL ? `<link id="favicon" rel="shortcut icon" type="image/png" href='${this.faviconURL}' />` : ''
    // TODO load stylesheet
    var stylesheet = this.getStylesheet();

    return `<!DOCTYPE html>
<html lang='en-GB'>
<head>
<meta charset='utf-8'/>
<title>${esc(this.doc.title)}</title>
${favicon}
<style>
${stylesheet}
</style>
</head>

<body>
<nav id='nav-pages'>
<a class="skip-link" href="#page-core">Go to character info</a>
<a class="skip-link" href="#page-combat">Go to combat</a>
</nav>

<main>
${registry.render(this.doc.contents)}
</main>

<nav id='screen-buttons'>
<section id='left-buttons'>
<button id='button--large' class='btn' onclick="document.getElementsByTagName('html')[0].className += ' html--size_large';"><i></i><span>Large font</span></button>
<button id='button--high-contrast' class='btn' onclick="document.getElementsByTagName('html')[0].className += ' html--high_contrast';"><i></i><span>High contrast</span></button>
</section>
<button id='button--print' onclick="window.print();return false;">Print</button>
</nav>
</body>
</html>`;
  }
}
