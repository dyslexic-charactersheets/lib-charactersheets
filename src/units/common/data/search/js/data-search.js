let searchInput = document.getElementById('search-form__input');
searchInput.addEventListener('change', (evt) => {
  let search = searchInput.value;
  console.log("Search for:", search);
});
