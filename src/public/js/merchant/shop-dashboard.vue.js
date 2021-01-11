if (document.getElementById('shop-dashboard')) {
  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'decimal',
  //   minimumFractionDigits: 2,
  // });

  // Vue.filter('currency', value => `\u20A6 ${formatter.format(value)}`);

  const data = {
    activeTab: 0,
    showBooks: false,
    isLive: false,
  };

  // async function doPost(url = '', method, data = {}) {
  //   // Default options are marked with *
  //   const response = await fetch(url, {
  //     method, // *GET, POST, PUT, DELETE, etc.
  //     mode: 'cors', // no-cors, *cors, same-origin
  //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //     credentials: 'same-origin', // include, *same-origin, omit
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     redirect: 'follow', // manual, *follow, error
  //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //     body: JSON.stringify(data), // body data type must match "Content-Type" header
  //   });
  //   return response.json(); // parses JSON response into native JavaScript objects
  // }

  const methods = {
    openShop: function (ev) {
      console.log('Shop is now open!', ev);

      doPost(`/shops/open?open=${ev}`, 'PATCH', { data: true })
        .then((data) => {
          console.log(data); // JSON data parsed by `data.json()` call
          this.isLive = data.isLive;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  };

  // ROUTER

  const routes = [
    { path: '/', redirect: '/products' },
    { path: '/products', component: ProductsComponent, name: 'Products' },
  ];

  // 3. Create the router instance and pass the `routes` option
  // You can pass in additional options here, but let's
  // keep it simple for now.
  const router = new VueRouter({
    routes, // short for `routes: routes`
  });

  const ShopDashboard = new Vue({
    data,
    methods,
    router,
    components: {
      products: ProductsComponent,
    },
  }).$mount('#shop-dashboard');
}
