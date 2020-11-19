const fs = require('fs');

const _ = require('lodash');

var entries = {};

const transRegex = /_\{([^{}]*?(\{.*\}[^{}]*?)*?)\}/g;
const commentRegex = /#\. (.*)$/g;

const presets = [
  {
    regex: /control: *speed/,
    strings: [ "ft", "m", "sq" ]
  },
  {
    regex: /control: *money/,
    strings: [ "cp", "sp", "gp", "pp" ]
  },
  {
    regex: /control: *weight/,
    strings: [ "B", "L" ]
  }
];

function pushEntry(system, message, context, reference, comment, meta) {
  // if (message === undefined || message == "") {
  //   return;
  // }
  if (!_.has(entries, system)) {
    entries[system] = {};
  }
  var id = (context == "") ? message : (context+"/"+message);
  if (_.has(meta, "Source")) {
    id = id + "@" + meta["Source"];
  } else {
    warn("i18n", "No source", reference);
  }
  if (_.has(meta, "Unit")) {
    id = id + "!" + meta["Unit"];
  }

  if (!_.has(entries[system], id)) {
    entries[system][id] = [];
  }

  entries[system][id].push({
    message: message,
    context: context,
    reference: reference,
    comment: comment,
    meta: meta
  });
}

function scanString(data, source, system, meta) {
  var prevComment = '';

  var linenum = 0;
  data.split('\n').forEach(line => {
    linenum++;

    var match;
    var context = '';
    while ((match = transRegex.exec(line)) !== null) {
      var message = match[1];
      pushEntry(system, message, context, source+":"+linenum, prevComment, meta);
    }

    presets.forEach(preset => {
      if (preset.regex.exec(line)) {
        preset.strings.forEach(str => {
          pushEntry(system, str, context, source+":"+linenum, prevComment, meta);
        });
      }
    });

    if ((match = commentRegex.exec(line)) !== null) {
      prevComment = match[1];
    } else {
      prevComment = "";
    }
  });
}

const LINE_LENGTH = 80;

function embedPoString(str) {
  if (str.match(/\n/) || str.length >= LINE_LENGTH) {
    // escape actual quotes
    str = str.replace(/"/g, '\\"');
    str = str.replace('\\n', "\n");
    str = str.replace(/\n$/, '');

    // insert an escaped newline at each line (but not the last line)
    
    var lines = str.split(/\n/).map(l => l+"\\n");
    lines[lines.length - 1] = lines[lines.length - 1].replace(/\n$/, '');

    // split long lines
    lines = _.flatMap(lines, str => {
      var parts = [];
      while (str.length >= LINE_LENGTH) {
        var i = str.lastIndexOf(" ", LINE_LENGTH) + 1;
        parts.push(str.substring(0, i));
        str = str.substring(i);
      }
      parts.push(str);
      return parts;
    });

    // output them, with an empty string first
    return '""\n' + lines.map(l => '"'+l+'"').join("\n");
  } else {
    return '"'+str+'"';
  }
}

function writePot(system, systemName) {
  // gather header data
  var packageJson = fs.readFileSync(__dirname+'/../../package.json', 'utf-8');
  packageJson = JSON.parse(packageJson);
  var libVersion = packageJson.version;

  var now = new Date(Date.now());
  var date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}+${("0000" + now.getTimezoneOffset()).slice(-4)}`;

  // delay running so we can be sure the scanners are all complete
  setTimeout(() => {
    if (!_.has(entries, system)) {
      return;
    }

    var systemEntries = entries[system];
    log("i18n", `Translation template: ${systemName} (${_.size(systemEntries)} messages)`);

    var headers = {
      "Content-Type": "text/plain; charset=UTF-8",
      "Content-Transfer-Encoding": "8bit",
      "Project-Id-Version": "dyslexic-charactersheets "+libVersion,
      "POT-Creation-Date": date,
      "PO-Revision-Date": "YEAR-MO-DA HO:MI+ZONE",
      "Last-Translator": "",
      "Language-Team": "",
      "Language": "",
      "MIME-Version": "1.0",
    };
    headers = _.map(headers, (value, key) => key+": "+value).join("\n");

    var headerBlock = `# Dyslexic Character Sheets
#. Game: ${systemName}
#, fuzzy
msgid ""
msgstr ${embedPoString(headers)}

`;

    // turn each entry into a POT block
    var blocks = {};
    _.each(systemEntries, (msgEntries, ident) => {
      var msgEntries = entries[system][ident];
      var message = msgEntries[0].message;
      if (message == "") {
        return;
      }
      var context = msgEntries[0].context;
      var references = msgEntries.map(e => e.reference);
      var comments = msgEntries.map(e => e.comment);

      var block = '';

      // translation comments start with #. in the source
      comments.forEach(comment => {
        if (comment !== undefined && comment !== "") {
          block += "#. "+comment+"\n";
        }
      });

      // consolidate metadata fields
      var metaByKey = {};
      msgEntries.forEach(e => {
        _.each(e.meta, (value, key) => {
          if (value === undefined || value == "") {
            return;
          }
          if (!_.has(metaByKey, key)) {
            metaByKey[key] = {};
          }
          metaByKey[key][value] = true;
        });
      });
      // log("i18n", "Meta", metaByKey);
      _.each(metaByKey, (values, key) => {
        // log("18n", "Meta: values", values);
        var v = _.uniq(_.keys(values)).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base', ignorePunctuation: true, numeric: true, caseFirst: "upper" }));
        block += "#. "+key+": "+v.join(", ")+"\n";
      });

      // references (split over several lines if necessary)
      if (references.length > 0) {
        _.chunk(references, 3).forEach(refs => {
          block += "#: "+refs.join(" ")+"\n";
        });
      }

      block += "#, javascript-format\n";

      if (context !== undefined && context !== "") {
        block += "msgctxt "+embedPoString(context)+"\n";
      }
      block += "msgid "+embedPoString(message)+"\n";
      block += 'msgstr ""\n';
      
      blocks[ident] = block;
    });
    
    var sortedKeys = _.keys(blocks).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base', ignorePunctuation: true, numeric: true, caseFirst: "upper" }));
    blocks = sortedKeys.map(key => blocks[key]);
    // blocks = _.sortBy(blocks, ['message', 'context']).map(b => b.block);

    // pull the list together in order
    var potData = headerBlock+blocks.join("\n");

    var potFile = __dirname+"/../../lib/i18n/"+system+".pot";
    fs.writeFile(potFile, potData, err => {
      if (err) error("make", "Error saving summary", system, err);
    });
  }, 1);
}


module.exports = {
  scan: scanString,
  writePot: writePot
}
