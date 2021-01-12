/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function changeCountry(c) {
  const country = c.value;

  console.log('Country => ', c);

  doPost('/data/countries/set', 'PATCH', { country }).then((response) => {
    console.log(response);
  });
}
