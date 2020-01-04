const fs = require('fs');

const _ = require('lodash');

var promises = [];
var entries = {};

const transRegex = /_\{(.*?)\}/g;
const commentRegex = /#\. (.*)$/g;

function pushEntry(system, message, context, reference, comment) {
  var id = context+"/"+message;
  if (!_.has(entries, system)) {
    entries[system] = {};
  }
  if (!_.has(entries[system], id)) {
    entries[system][id] = [];
  }

  entries[system][id].push({
    message: message,
    context: context,
    reference: reference,
    comment: comment
  });
}

function scanString(data, source, system) {
  var prevComment = '';

  var linenum = 0;
  data.split('\n').forEach(line => {
    linenum++;

    var match;
    var context = '';
    if ((match = transRegex.exec(line)) !== null) {
      var message = match[1];
      pushEntry(system, message, context, source+":"+linenum, prevComment);
    }

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
    str = str.replace(/"/g, '\\"');
    var lines = str.split(/\n/).map(l => l+"\\n");
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
    return '""' + lines.map(l => '"'+l+'"').join("\n");
  } else {
    return '"'+str+'"';
  }
}

function writePot(system, systemName) {
  setTimeout(() => {
    Promise.all(promises).then(() => {
      if (!_.has(entries, system)) {
        return;
      }

      var systemEntries = entries[system];
      log("i18n", `Writing translation template: ${systemName} (${_.size(systemEntries)} messages)`);

      var headers = {
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
      };
      headers = _.map(headers, (value, key) => key+": "+value).join("\n");

      var headerBlock = `#. ${systemName}
msgid ""
msgstr ${embedPoString(headers)}

`;

      var blocks = [headerBlock];

      _.each(systemEntries, (msgEntries, ident) => {
        var msgEntries = entries[system][ident];
        var message = msgEntries[0].message;
        var context = msgEntries[0].context;
        var references = msgEntries.map(e => e.reference);
        var comments = msgEntries.map(e => e.comment);

        var block = '';
        comments.forEach(comment => {
          if (comment !== undefined && comment !== "") {
            block += "#. "+comment+"\n";
          }
        });
        if (references.length > 0) {
          block += "#: "+references.join(" ")+"\n";
        }

        block += "#, javascript-format\n";

        if (context !== undefined && context !== "") {
          block += "msgctxt "+embedPoString(context)+"\n";
        }
        block += "msgid "+embedPoString(message)+"\n";
        block += 'msgstr ""\n';
        
        blocks.push(block);
      });

      var potFile = __dirname+"/../../lib/lib-"+system+".pot";
      var potData = blocks.join("\n");
      fs.writeFile(potFile, potData, err => {
        if (err) error("make", "Error saving summary", system, err);
      });
    });

  }, 1);
}


module.exports = {
  scan: scanString,
  // parseSystemUnits: parseSystemUnits,
  writePot: writePot
}
