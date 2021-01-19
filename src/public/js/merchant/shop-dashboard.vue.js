if (document.getElementById('shop-dashboard')) {
  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'decimal',
  //   minimumFractionDigits: 2,
  // });

  // Vue.filter('currency', value => `\u20A6 ${formatter.format(value)}`);

  // register modal component
  Vue.component('modal', ModalComponent);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  });

  /**
   * \u20A6  is the unicode for Naira symbol
   */

  Vue.filter('currency', (value) => `${formatter.format(value)}`);

  const data = {
    activeTab: 0,
    showBooks: false,
    isLive: false,
    showModal: false,
  };

  const methods = {
    openShop: function (ev) {
      console.log('Shop is now open!', ev.target.value);

      const open = !JSON.parse(ev.target.value);

      doPost(`/shops/open?open=${open}`, 'PATCH', { data: true })
        .then((data) => {
          console.log(data); // JSON data parsed by `data.json()` call

          if (data.success) {
            this.$buefy.notification.open({
              duration: 5000,
              message: 'Shop is now live and ready to sell!',
              position: 'is-top',
              type: 'is-info',
              queue: false,
            });

            this.isLive = data.isLive;
          }

          if (!data.success) {
            this.$buefy.notification.open({
              duration: 5000,
              message:
                'Could not make Shop live, please contact Admin or try again...',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          }

          if (!data.success && data.alerts) {
            data.alerts.forEach((alert) => {
              this.$buefy.notification.open({
                duration: 5000,
                message: alert.msg,
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            });
          }
        })
        .catch((err) => {
          console.error(err);

          if (!err.success && err.error) {
            this.$buefy.notification.open({
              duration: 5000,
              message: err.error.message || 'Error opening Shop!',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          }

          if (!err.success && err.alerts) {
            err.alerts.forEach((alert) => {
              this.$buefy.notification.open({
                duration: 5000,
                message: alert.msg,
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            });
          }
        });
    },
  };

  // ROUTER

  const routes = [
    { path: '/', redirect: '/products' },
    {
      path: '/products',
      component: ProductsComponent,
      name: 'Products',
    },
    {
      path: '/update',
      component: UpdateShopComponent,
      name: 'Update Shop',
    },
    {
      path: '/office',
      component: OfficeComponent,
      name: 'Office',
    },
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
      update: UpdateShopComponent,
      office: OfficeComponent,
    },
    mounted: function () {
      console.log('Loaded Shop Merchant App');
    },
  }).$mount('#shop-dashboard');
}
