/* eslint-disable no-unused-vars */
/**
 * doPost
 *
 * Browser Fetch wrapper function
 *
 * For requests with payload (body)
 *
 * reason: so I don't have to be repeating stuff
 * @param {*} url
 * @param {*} method
 * @param {*} _data
 */
async function doPost(url = '', method, _data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(_data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * doGet
 * Browser Fetch wrapper function
 *
 * For requests that don't need a payload (body)
 *
 * reason: so I don't have to be repeating stuff
 * @param {*} url
 * @param {*} method
 */
async function doGet(url = '', method) {
  // Default options are marked with *
  const response = await fetch(url, {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
