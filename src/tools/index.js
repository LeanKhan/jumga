/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
const fetch = require('node-fetch');

function slugify(text) {
  const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
  const to = 'aaaaaeeeeeiiiiooooouuuunc------';

  const newText = text
    .split('')
    .map((letter, i) =>
      letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    );

  return newText
    .toString() // Cast to string
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-y-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

// fetch('https://api.flutterwave.com/v3/subaccounts', {
//   method: 'post',
//   body: payload,
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${process.env.FW_SECRET_KEY.trim()}`,
//   },
// })

// function retryRequest(url, options = {}, retries = 3) {
//   // Return a fetch request
//   return fetch(url, options).then(res => {
//     // check if successful. If so, return the response transformed to json
//     if (res.ok) return res.json()
//     // else, return a call to retryRequest
//     return retryRequest(url, options, retries - 1)
//   })
// }

function retryRequest(url, options = {}, retries = 3, backoff = 100) {
  const retryCodes = [408, 500, 502, 503, 504, 522, 524];

  // const pro = new Promise;

  /* 1 */
  return fetch(url, options)
    .then((res) => {
      if (res.ok) return Promise.resolve(res.json());

      console.log('retries => ', retries);
      console.log('Backoff => ', backoff);

      if (retries > 0 && retryCodes.includes(res.status)) {
        setTimeout(() => {
          /* 2 */
          return retryRequest(url, options, retries - 1, backoff * 2); /* 3 */
        }, backoff); /* 2 */
      } else {
        console.log('Here in then else');
        return Promise.reject(res);
      }
    })
    .catch((err) => {
      console.log('Here in catch error block');
      return Promise.reject(err);
    });
}

function retry2(fn, retries = 3, err = null) {
  if (!retries) {
    return Promise.reject(err);
  }
  return fn().catch((err) => {
    return retry2(fn, retries - 1, err);
  });
}

module.exports = {
  slugify,
  retryRequest,
};
