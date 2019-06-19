'use strict';

global._ = require('lodash');

global.CharacterSheets = function(options) {
    return CharacterSheets.create(options);
}

// LIB
require('./log.js');

// load files first
require('./load.js');
require('./data.js');
// require('./preload.js');

// parts
require('./registry.js');
require('./util.js');

// ELEMENTS
// furniture
require('../elements.d/unit.js');
require('../elements.d/each.js');
require('../elements.d/slots.js');
require('../elements.d/zone.js');
require('../elements.d/template.js');

require('../elements.d/document.js');
require('../elements.d/page.js');
require('../elements.d/layout.js');
require('../elements.d/section.js');
require('../elements.d/article.js');
require('../elements.d/spells-list.js');
require('../elements.d/g.js');
require('../elements.d/row.js');
require('../elements.d/spacer.js');
require('../elements.d/repeat.js');
require('../elements.d/list.js');

// elements
require('../elements.d/headings.js');
require('../elements.d/portrait.js');
require('../elements.d/blockquote.js');
require('../elements.d/level.js');
require('../elements.d/proficiency.js');
require('../elements.d/class-icon.js');
require('../elements.d/p.js');
require('../elements.d/table.js');
require('../elements.d/hr.js');
require('../elements.d/calc.js');
// require('../elements.d/field-frame.js');
// require('../elements.d/field-control.js');
// require('../elements.d/field.js');

require('../elements.d/field2.js');
require('../elements.d/field2-frame.js');
require('../elements.d/field2-control.js');

require('../elements.d/span.js');
require('../elements.d/label.js');
require('../elements.d/icon.js');

// specific parts
require('../elements.d/logo.js');

// UNITS
require('./compose.js');
require('./unit-expander.js');
require('./context.js');
// require('./stylesheet.js');
// require('./units.js');
require('../../make/units2.js');

// RUNTIME
require('./create.js');

return CharacterSheets;