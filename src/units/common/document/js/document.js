{{! /* function isSafari() {
  var parser = new UAParser();
  var result = parser.getResult();

  var br = result.browser.name;
  var os = result.os.name;
  var eng = result.engine.name;

  return br == "Safari" || br == "Mobile Safari" || ((os == "iOS" || os == "Mac OS") && eng == "WebKit");
} */ }}

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
  document.documentElement.classList.add("html--safari");
}

// click buttons to scroll
for (let btn of document.getElementsByClassName('index-button')) {
  ((btn) => {
    let id = btn.dataset.page;
    btn.addEventListener('click', (evt) => {
      document.getElementById('page-'+id).scrollIntoView({
        behavior: 'smooth'
      });
    });
  })(btn);
}

// on scroll, highlight the current page

// if (document.getElementsByClassName('page').length > 15) {
//   document.getElementById('index-buttons').classList.add('index-buttons--many');
// }

let scrollPages = [];
function findScrollPages() {
  scrollPages = [];
  for (let page of document.getElementsByClassName('page')) {
    let pageid = page.dataset.page;
    let pagey = page.offsetTop + page.offsetHeight / 2;
    scrollPages.push({y: pagey, id: pageid});
  }
  updateScroll();
}
findScrollPages();
addEventListener("resize", findScrollPages);

function updateScroll() {
  let y = window.scrollY + window.innerHeight / 2;
  let closestPage = scrollPages[0];
  let closestDiff = 10000000;
  for (let page of scrollPages) {
    let diff = Math.abs(page.y - y);
    if (diff < closestDiff) {
      closestPage = page;
      closestDiff = diff;
    }
  }

  for (let btn of document.getElementsByClassName('index-button')) {
    let page = btn.dataset.page;
    if (page == closestPage.id) {
      btn.classList.add('index-button--current');
    } else {
      btn.classList.remove('index-button--current');
    }
  }
}

document.addEventListener("scroll", (event) => {
  updateScroll();
});

