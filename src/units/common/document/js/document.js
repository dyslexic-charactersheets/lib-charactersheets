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


// Arrows
for (let arrowElem of document.getElementsByClassName('arrow')) {
  let from = document.getElementById(arrowElem.dataset.from);
  let to = document.getElementById(arrowElem.dataset.to);
  if (from !== null && to !== null) {
    let pageContainer = arrowElem.closest('.page__contents');
    let pageContainerBox = pageContainer.getBoundingClientRect();

    let direction = arrowElem.dataset.direction;
    let isVertical = direction == 'up' || direction == 'down';
    arrowElem.classList.add(isVertical ? 'arrow--align_vertical' : 'arrow--align_horizontal');

    // find the positions of the start and end points
    let fromContainerBox = (from.offsetParent == null ? pageContainerBox : from.offsetParent.getBoundingClientRect());
    let toContainerBox = (to.offsetParent == null ? pageContainerBox : to.offsetParent.getBoundingClientRect());
    let fromPoint = { x: from.offsetLeft + (fromContainerBox.left - pageContainerBox.left), y: from.offsetTop + (fromContainerBox.top - pageContainerBox.top) };
    let toPoint = { x: to.offsetLeft + (toContainerBox.left - pageContainerBox.left), y: to.offsetTop + (toContainerBox.top - pageContainerBox.top) };

    switch (direction) {
      case 'up':
        fromPoint = { x: fromPoint.x + from.offsetWidth / 2, y: fromPoint.y };
        toPoint = { x: toPoint.x + to.offsetWidth / 2, y: toPoint.y + to.offsetHeight };
        break;
      case 'down':
        fromPoint = { x: fromPoint.x + from.offsetWidth / 2, y: fromPoint.y + from.offsetHeight };
        toPoint = { x: toPoint.x + to.offsetLeft / 2, y: toPoint.y };
        break;
      case 'left':
        fromPoint ={ x: fromPoint.x, y: fromPoint.y + from.offsetHeight / 2 };
        toPoint = { x: toPoint.x + to.offsetWidth, y: toPoint.y + to.offsetHeight / 2 };
        break;
      case 'right':
        fromPoint = { x: fromPoint.x + from.offsetWidth, y: fromPoint.y + from.offsetHeight / 2 };
        toPoint = { x: toPoint.x, y: toPoint.y + to.offsetHeight / 2 };
        break;
    }

    // which way does the arrow need to jump?
    let isShiftAbove = toPoint.y < fromPoint.y;
    let isShiftLeft = toPoint.x < fromPoint.x;
    arrowElem.classList.add(isShiftAbove ? 'arrow--shift_above' : 'arrow--shift_below');
    arrowElem.classList.add(isShiftLeft ? 'arrow--shift_left' : 'arrow--shift_left');

    // position the arrow pieces
    let box = {top: 0, left: 0, width: Math.abs(toPoint.x - fromPoint.x), height: Math.abs(toPoint.y - fromPoint.y) };
    let headCurveClass = '';
    let tailCurveClass = '';

    switch (direction) {
      case 'up':
        box.top = toPoint.y;
        box.left = isShiftLeft ? toPoint.x : fromPoint.x;
        headCurveClass = isShiftLeft ? 'bottom-left' : 'bottom-right';
        tailCurveClass = isShiftLeft ? 'top-right' : 'top-left';
        break;
      case 'down':
        box.top = fromPoint.y;
        box.left = isShiftLeft ? toPoint.x : fromPoint.x;
        headCurveClass = isShiftLeft ? 'top-left' : 'top-right';
        tailCurveClass = isShiftLeft ? 'bottom-right' : 'bottom-left';
        break;
      case 'left':
        box.top = isShiftAbove ? toPoint.y : fromPoint.y;
        box.left = toPoint.x;
        headCurveClass = isShiftAbove ? 'top-right' : 'bottom-right';
        tailCurveClass = isShiftAbove ? 'bottom-left' : 'top-left';
        break;
      case 'left':
        box.top = isShiftAbove ? toPoint.y : fromPoint.y;
        box.left = toPoint.x;
        headCurveClass = isShiftAbove ? 'top-left' : 'bottom-left';
        tailCurveClass = isShiftAbove ? 'bottom-right' : 'top-right';
        break;
    }

    // set the box of the arrow container box
    arrowElem.style.top = box.top+'px';
    arrowElem.style.left = box.left+'px';
    arrowElem.style.width = box.width+'px';
    arrowElem.style.height = box.height+'px';

    // set the direction of the corner curves
    for (let headCurveElem of arrowElem.getElementsByClassName('arrow__head-curve')) {
      headCurveElem.classList.add('arrow__curve--'+headCurveClass);
    }
    for (let tailCurveElem of arrowElem.getElementsByClassName('arrow__tail-curve')) {
      tailCurveElem.classList.add('arrow__curve--'+tailCurveClass);
    }
  }
}
