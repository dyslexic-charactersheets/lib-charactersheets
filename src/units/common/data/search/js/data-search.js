/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

let searchInput = document.getElementById('search-form__input');
searchInput.addEventListener('change', (evt) => {
  let search = searchInput.value;
  console.log("Search for:", search);
});
