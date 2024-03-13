// Arrows
for (let arrowElem of document.getElementsByClassName('arrow')) {
  let from = document.getElementById(arrowElem.dataset.from);
  let to = document.getElementById(arrowElem.dataset.to);
  if (from !== null && to !== null) {
    // attach the anchor to the target element
    let anchorInto = arrowElem.classList.contains('arrow--anchor_to') ? to : from;
    if (anchorInto.tagName == "INPUT") {
      anchorInto = anchorInto.parentElement;
    }

    let anchor = document.createElement('div');
    anchor.classList.add('arrow-anchor');
    anchorInto.appendChild(anchor);

    arrowElem.remove();
    anchor.appendChild(arrowElem);

    // get offsets relative to anchor parent
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
    let anchorOffset = {
      x: anchorBox.left - anchorParent.left,
      y: anchorBox.top - anchorParent.top
    };
    
    // find the edge point of the attachment elements
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
      return { x: x + elem.offsetWidth / 2, y: y };
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
    arrowElem.classList.add(isShiftLeft ? 'arrow--shift_left' : 'arrow--shift_right');

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
  } else {
    if (from == null) {
      console.log("Arrow has no 'from' element to attach to:", arrowElem.dataset.from);
    } else {
      console.log("Arrow has no 'to' element to attach to:", arrowElem.dataset.to);
    }
  }
}
