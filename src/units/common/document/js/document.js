{{{embed "node_modules/ua-parser-js/dist/ua-parser.min.js"}}}

if ((function isSafari() {
  var parser = new UAParser();
  var result = parser.getResult();

  var br = result.browser.name;
  var os = result.os.name;
  var eng = result.engine.name;

  return br == "Safari" || br == "Mobile Safari" || ((os == "iOS" || os == "Mac OS") && eng == "WebKit");
})()) {
  document.documentElement.classList.add("html--safari");
}
