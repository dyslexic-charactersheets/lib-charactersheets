var promises = [];
var entries = [];

function walkString(str) {
  var n = 0;
  var match = str.match(/_\{(.*?)\}/gs);
  if (match) {
    // console.log("[i18n] Match:", str, match);
    match.forEach(m => {
      var m2 = m.match(/_\{(.*?)\}/);
      // console.log("[i18n] Match part:", m2);
      if (m2) {
        var message = m2[1];
        // log("i18n", "Message:", message);
        entries.push({
          message: message
        });
        n++;
      }
    });
  }
  return n;
}

function walk(obj) {
  if (obj === null || obj === undefined) {
    return 0;
  } else if (typeof obj === "string") {
    return walkString(obj);
  } else if (Array.isArray(obj)) {
    var n = 0;
    obj.forEach(item => {
      n += walk(item)
    });
    return n;
  } else if (typeof obj === 'object') {
    var n = 0;
    Object.keys(obj).forEach(key => {
      n += walk(obj[key]);
    });
    return n;
  } else {
    return 0;
  }
}

function parseSystemUnits(system, units) {
  promises.push(new Promise((resolve, reject) => {
    try {
      var n = walk(units);
      log("i18n", `Template extracted: ${system.name} (${n} entries)`);
      resolve();
    } catch(e) {
      error("i18n", "Error", e);
      reject(e);
    }
  }));
}

function writePot() {
  setTimeout(() => {
    Promise.all(promises).then(() => {
      log("i18n", `Writing pot: ${entries.length} entries`);

      // entries.forEach(e => {}
      // msgid "My name is %s.\n"
      // msgstr ""
    });
  }, 5000);
}


module.exports = {
  parseSystemUnits: parseSystemUnits,
  writePot: writePot
}
