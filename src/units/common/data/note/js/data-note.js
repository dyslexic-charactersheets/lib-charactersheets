for (var note of document.getElementsByClassName('page__note')) {
  (function (note) {
    let control = note.getElementsByClassName('page__note__control')[0];
    function updateNote() {
      documentChanged()
      let content = control.value;
      console.log("Key press:", content);
      if (content.length > 0) {
        note.classList.add('page__note--filled');
      } else {
        note.classList.remove('page__note--filled');
      }
    }
    control.addEventListener('keydown', function (event) {
      setTimeout(updateNote, 1);
    });
  })(note);
}
