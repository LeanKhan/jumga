/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-inner-declarations */
if (document.getElementById('admin-dashboard')) {
  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'decimal',
  //   minimumFractionDigits: 2,
  // });

  // Vue.filter('currency', value => `\u20A6 ${formatter.format(value)}`);

  const data = {
    activeTab: 0,
  };

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
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(_data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const methods = {
    addRider() {
      doPost('/riders/new', 'POST', this.rider_form)
        .then((d) => {
          console.log(d); // JSON data parsed by `data.json()` call
        })
        .catch((err) => {
          console.error(err);
        });
    },
    openShop(ev) {
      console.log('Shop is now open!', ev);

      doPost(`/shops/open?open=${ev}`, 'PATCH', { data: true })
        .then((d) => {
          console.log(d); // JSON data parsed by `data.json()` call
          this.isLive = data.isLive;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  };

  const routes = [
    { path: '/', redirect: '/riders' },
    { path: '/riders', component: RidersComponent, name: 'Riders' },
    { path: '/categories', component: CategoriesComponent, name: 'Categories' },
    { path: '/countries', component: CountriesComponent, name: 'Countries' },
  ];

  // 3. Create the router instance and pass the `routes` option
  // You can pass in additional options here, but let's
  // keep it simple for now.
  const router = new VueRouter({
    routes, // short for `routes: routes`
  });

  // 4. Create and mount the root instance.
  // Make sure to inject the router with the router option to make the
  // whole app router-aware.

  const AdminDashboard = new Vue({
    data,
    methods,
    router,
    components: {
      riders: RidersComponent,
      categories: CategoriesComponent,
      countries: CountriesComponent,
    },
  }).$mount('#admin-dashboard');
}
