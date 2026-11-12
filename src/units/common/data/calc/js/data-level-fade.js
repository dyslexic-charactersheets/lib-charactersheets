/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

function updateLevelFade(evt) {
  var currentLevel = parseInt(evt ? evt.target.value : getFieldValue('level'));
  for (var el of document.querySelectorAll('[data-fade-level]')) {
    el.classList.toggle('level-faded', currentLevel > 0 && parseInt(el.dataset.fadeLevel) > currentLevel);
  }
}

window.addEventListener('load', (event) => {
  if (!document.documentElement.classList.contains('html--enable-level-fade')) {
    return;
  }
  for (var input of document.getElementsByName('level')) {
    input.addEventListener('input', updateLevelFade);
    input.addEventListener('change', updateLevelFade);
  }
  updateLevelFade();
});
