// field interactions: checkboxes
for (let field of document.getElementsByClassName('field--control_checkbox')) {
  ((field) => {
    let name = field.getAttribute('name').replace(/^field-/, '');
    for (let checkbox of field.getElementsByTagName('input')) {
      checkbox.addEventListener('input', (evt) => {
        let checked = checkbox.checked;
        for (let otherCheckbox of document.querySelectorAll('input[name="'+name+'"]')) {
          if (checkbox == otherCheckbox)
            continue;
          otherCheckbox.checked = checked;
        }
      });
    }
  })(field);
}
