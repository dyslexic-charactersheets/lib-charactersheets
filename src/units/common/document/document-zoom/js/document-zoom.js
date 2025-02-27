function zoom() {
  let html = document.getElementsByTagName('html')[0];
  html.classList.toggle('zoom');
}

function unzoom() {
  let html = document.getElementsByTagName('html')[0];
  html.classList.remove('zoom');
}

function unzoomTo(pageId) {
  unzoom();
  setTimeout(() => {
    // scroll to page
    console.log("Scroll to", pageId);

    let page = document.getElementById("page-"+pageId);
    page.scrollIntoView({
      behavior: 'smooth'
    });
    // window.scrollTo(0, page.offsetTop);
  }, 1);
}

for (let btn of document.getElementsByClassName('zoom-button')) {
  btn.addEventListener('click', zoom);
}

for (let btn of document.getElementsByClassName('page-zoom-button')) {
  ((btn) => {
    let pageId = btn.dataset.page;
    btn.addEventListener('click', () => unzoomTo(pageId));
  })(btn);
}

for (let toggle of document.getElementsByClassName('toggle-print-page')) {
  for (let checkbox of toggle.getElementsByTagName('input')) {
    ((checkbox) => {
      let page = checkbox.closest('.page-container').querySelector('.page');
      page.classList.toggle('page--no-print', !checkbox.checked);
      checkbox.addEventListener('change', () => {
        page.classList.toggle('page--no-print', !checkbox.checked);
      });
    })(checkbox);
  }
}
