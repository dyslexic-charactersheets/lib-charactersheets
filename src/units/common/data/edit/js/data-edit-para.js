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
      }
      control.addEventListener('click', () => {
        for (let part of control.getElementsByClassName('p__editpart')) {
          setTimeout(() => {
            part.focus();
          }, 0);
          return;
        }
      });
    })(control);
  }
}
