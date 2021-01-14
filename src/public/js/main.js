/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function changeCountry(c) {
  const country = c.value;

  doPost('/data/countries/set', 'PATCH', { country }).then((response) => {
    console.log(response);
  });
}

function change(c) {
  const dropdown = document.getElementById('country_dropdown');

  const country = c.value;

  dropdown.innerHTML = `<img src="https://www.countryflags.io/${c.value}/flat/16.png">`;
  c.blur();

  doPost('/data/countries/set', 'PATCH', { country }).then((response) => {
    console.log(response);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const { target } = el.dataset;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});
