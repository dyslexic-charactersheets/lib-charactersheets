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
    let anchor = document.createElement('div');
    anchor.classList.add('arrow-anchor');
    if (arrowElem.classList.contains('arrow--anchor_to')) {
      to.appendChild(anchor);
    } else {
      from.appendChild(anchor);
    }

    arrowElem.remove();
    anchor.appendChild(arrowElem);

    let pageContainer = arrowElem.closest('.page__contents');
    let pageContainerBox = pageContainer.getBoundingClientRect();

    let direction = arrowElem.dataset.direction;
    let isVertical = direction == 'up' || direction == 'down';
    let isHorizontal = direction == 'left' || direction == 'right';
    if (isVertical) {
      arrowElem.classList.add('arrow--align_vertical');
    } else if (isHorizontal) {
      arrowElem.classList.add('arrow--align_horizontal');
    }

    let anchorBox = anchor.getBoundingClientRect();
    let anchorParent = pageContainerBox;
    // let anchorParent = (anchor.offsetParent == null ? pageContainerBox : anchor.offsetParent.getBoundingClientRect());
    let anchorOffset = {
      x: anchorBox.left - anchorParent.left,
      y: anchorBox.top - anchorParent.top
    };

    // find the positions of the start and end points
    // let fromContainerBox = (from.offsetParent == null ? pageContainerBox : from.offsetParent.getBoundingClientRect());
    // let toContainerBox = (to.offsetParent == null ? pageContainerBox : to.offsetParent.getBoundingClientRect());
    // let fromPoint = { x: from.offsetLeft + (fromContainerBox.left - pageContainerBox.left), y: from.offsetTop + (fromContainerBox.top - pageContainerBox.top) };
    // let toPoint = { x: to.offsetLeft + (toContainerBox.left - pageContainerBox.left), y: to.offsetTop + (toContainerBox.top - pageContainerBox.top) };

    // switch (direction) {
    //   case 'up':
    //     fromPoint = { x: fromPoint.x + from.offsetWidth / 2, y: fromPoint.y };
    //     toPoint = { x: toPoint.x + to.offsetWidth / 2, y: toPoint.y + to.offsetHeight };
    //     break;
    //   case 'down':
    //     fromPoint = { x: fromPoint.x + from.offsetWidth / 2, y: fromPoint.y + from.offsetHeight };
    //     toPoint = { x: toPoint.x + to.offsetLeft / 2, y: toPoint.y };
    //     break;
    //   case 'left':
    //     fromPoint ={ x: fromPoint.x, y: fromPoint.y + from.offsetHeight / 2 };
    //     toPoint = { x: toPoint.x + to.offsetWidth, y: toPoint.y + to.offsetHeight / 2 };
    //     break;
    //   case 'right':
    //     fromPoint = { x: fromPoint.x + from.offsetWidth, y: fromPoint.y + from.offsetHeight / 2 };
    //     toPoint = { x: toPoint.x, y: toPoint.y + to.offsetHeight / 2 };
    //     break;
    // }

    
    function left(elem) {
      let outerBox = (elem.offsetParent == null ? pageContainerBox : elem.offsetParent.getBoundingClientRect());
      let x = elem.offsetLeft + (outerBox.left - pageContainerBox.left);
      let y = elem.offsetTop + (outerBox.top - pageContainerBox.top);
      return { x: x, y: y + elem.offsetHeight / 2 };
    }

    function right(elem) {
      let outerBox = (elem.offsetParent == null ? pageContainerBox : elem.offsetParent.getBoundingClientRect());
      let x = elem.offsetLeft + (outerBox.left - pageContainerBox.left);
      let y = elem.offsetTop + (outerBox.top - pageContainerBox.top);
      return { x: x + elem.offsetWidth, y: y + elem.offsetHeight / 2 };
    }

    function top(elem) {
      let outerBox = (elem.offsetParent == null ? pageContainerBox : elem.offsetParent.getBoundingClientRect());
      let x = elem.offsetLeft + (outerBox.left - pageContainerBox.left);
      let y = elem.offsetTop + (outerBox.top - pageContainerBox.top);
      return { x: x + elem.offsetWidth / 2, y: box.y };
    }

    function bottom(elem) {
      let outerBox = (elem.offsetParent == null ? pageContainerBox : elem.offsetParent.getBoundingClientRect());
      let x = elem.offsetLeft + (outerBox.left - pageContainerBox.left);
      let y = elem.offsetTop + (outerBox.top - pageContainerBox.top);
      return { x: x + elem.offsetWidth / 2, y: y + elem.offsetHeight };
    }

    let fromPoint;
    switch (direction) {
      case 'up':
      case 'up-left':
      case 'up-down':
        fromPoint = top(from);
        break;

      case 'down':
      case 'down-left':
      case 'down-right':
        fromPoint = bottom(from);
        break;

      case 'left':
      case 'left-up':
      case 'left-down':
        fromPoint = left(from);
        break;

      case 'right':
      case 'right-up':
      case 'right-down':
        fromPoint = right(from);
        break;
    }
    
    let toPoint;
    switch (direction) {
      case 'up':
      case 'left-up':
      case 'right-up':
        toPoint = bottom(to);
        break;

      case 'down':
      case 'left-down':
      case 'right-down':
        toPoint = top(to);
        break;

      case 'left':
      case 'up-left':
      case 'down-left':
        toPoint = right(to);
        break;

      case 'right':
      case 'up-right':
      case 'down-right':
        toPoint = left(to);
        break;
    }

    // which way does the arrow need to jump?
    let isShiftAbove = toPoint.y < fromPoint.y;
    let isShiftLeft = toPoint.x < fromPoint.x;
    arrowElem.classList.add(isShiftAbove ? 'arrow--shift_above' : 'arrow--shift_below');
    arrowElem.classList.add(isShiftLeft ? 'arrow--shift_left' : 'arrow--shift_left');

    // position the arrow pieces
    let box = {
      top: Math.min(fromPoint.y, toPoint.y) - anchorOffset.y, 
      left: Math.min(fromPoint.x, toPoint.x) - anchorOffset.x, 
      width: Math.abs(toPoint.x - fromPoint.x), 
      height: Math.abs(toPoint.y - fromPoint.y)
    };
    let headCurveClass = '';
    let tailCurveClass = '';

    switch (direction) {
      case 'up':
        // box.top = toPoint.y;
        // box.left = isShiftLeft ? toPoint.x : fromPoint.x;
        headCurveClass = isShiftLeft ? 'bottom-left' : 'bottom-right';
        tailCurveClass = isShiftLeft ? 'top-right' : 'top-left';
        break;
      case 'down':
        // box.top = fromPoint.y;
        // box.left = isShiftLeft ? toPoint.x : fromPoint.x;
        headCurveClass = isShiftLeft ? 'top-left' : 'top-right';
        tailCurveClass = isShiftLeft ? 'bottom-right' : 'bottom-left';
        break;
      case 'left':
        // box.top = isShiftAbove ? toPoint.y : fromPoint.y;
        // box.left = toPoint.x;
        headCurveClass = isShiftAbove ? 'top-right' : 'bottom-right';
        tailCurveClass = isShiftAbove ? 'bottom-left' : 'top-left';
        break;
      case 'left':
        // box.top = isShiftAbove ? toPoint.y : fromPoint.y;
        // box.left = toPoint.x;
        headCurveClass = isShiftAbove ? 'top-left' : 'bottom-left';
        tailCurveClass = isShiftAbove ? 'bottom-right' : 'top-right';
        break;

      case 'up-left':
      case 'right-down':
        headCurveClass = 'top-right';
        break;
      case 'up-right':
      case 'left-down':
        headCurveClass = 'top-left';
        break;
      case 'down-left':
      case 'right-up':
        headCurveClass = 'bottom-right';
        break;
      case 'down-right':
      case 'left-up':
        headCurveClass = 'bottom-left';
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
