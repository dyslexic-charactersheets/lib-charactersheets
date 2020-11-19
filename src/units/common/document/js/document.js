/* function isSafari() {
  var parser = new UAParser();
  var result = parser.getResult();

  var br = result.browser.name;
  var os = result.os.name;
  var eng = result.engine.name;

  return br == "Safari" || br == "Mobile Safari" || ((os == "iOS" || os == "Mac OS") && eng == "WebKit");
} */

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
  document.documentElement.classList.add("html--safari");
}
