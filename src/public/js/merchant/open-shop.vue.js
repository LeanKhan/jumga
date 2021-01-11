console.log('hei-iii x');
if (document.getElementById('open-shop-app')) {
  console.log('hei-iii x2');

  const data = {
    activeStep: 0,
  };

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

  // const routes = [
  //   { path: '/', redirect: '/products' },
  //   { path: '/products', component: ProductsComponent, name: 'Products' },
  // ];

  // // 3. Create the router instance and pass the `routes` option
  // // You can pass in additional options here, but let's
  // // keep it simple for now.
  // const router = new VueRouter({
  //   routes, // short for `routes: routes`
  // });

  const OpenShopApp = new Vue({
    data,
    methods,
    components: {
      'register-form': RegisterFormComponent,
    },
  }).$mount('#open-shop-app');
}
