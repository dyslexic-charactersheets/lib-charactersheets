// detect the Safari browser by feature checks
if ( /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification) ) {
  document.documentElement.classList.add("html--safari");
}

// detect the Safari engine, including other browsers on iOS
if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
  document.documentElement.classList.add("html--safari");
}
