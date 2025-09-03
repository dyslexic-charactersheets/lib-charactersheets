/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

const spotlightBox = document.getElementById('focus');

function spotlight(target) {
  // find the nearest section / page area to spotlight
  let box = target.closest('section');
  if (box === null) {
    box = target.closest('.page');
  }
  let boxbounds = box.getBoundingClientRect();

  // move the spotlight and show it
  const gap = 16;
  spotlightBox.style.top = (boxbounds.top-gap)+"px";
  spotlightBox.style.left = (boxbounds.left-gap)+"px";
  spotlightBox.style.width = (boxbounds.width+gap*2)+"px";
  spotlightBox.style.height = (boxbounds.height+gap*2)+"px";
  spotlightBox.classList.add("spotlight--show");
}

function unspotlight() {
  spotlightBox.classList.remove("spotlight--show");
}
