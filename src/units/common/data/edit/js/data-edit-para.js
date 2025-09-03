/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

// field interactions: PARA

for (let field of document.getElementsByClassName('field--control_p')) {
  for (let control of field.getElementsByClassName('field__control')) {
    ((control) => {
      function updateEmpty() {
        let empty = true;
        for (let part of control.getElementsByClassName('p__editpart')) {
          if (part.innerText != "") {
            empty = false;
          }
        }
        control.classList.toggle('field__control--empty', empty);
      }

      for (let part of control.getElementsByClassName('p__editpart')) {
        part.addEventListener('input', updateEmpty);
        ((part) => {
          part.addEventListener('click', (evt) => {
            setTimeout(() => {
              part.focus();
            }, 0);
            evt.stopPropagation(); // don't fall back to the bigger click
          })
        })(part);
      }

      control.addEventListener('click', () => {
        for (let part of control.getElementsByClassName('p__body')) {
          ((part) => {
            setTimeout(() => {
              part.focus();
              // set caret at end
              let sel = window.getSelection();
              sel.selectAllChildren(part);
              sel.collapseToEnd();
            }, 0);
            return;
          })(part);
        }
      });
    })(control);
  }
}
