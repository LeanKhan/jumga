if (document.querySelector('#shop-app')) {
  // 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
  // and then call `Vue.use(VueRouter)`.

  // 1. Define route components.
  // These can be imported from other files
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  });

  /**
   * \u20A6  is the unicode for Naira symbol
   */

  Vue.filter('currency', (value) => `${formatter.format(value)}`);
  const Foo = {
    template: '<div>foo <router-link to="/bar">bar</router-link> </div>',
  };
  const Bar = {
    template: '<div>bar <router-link to="/foo">foo</router-link></div>',
  };

  // var CartComponent = {
  //     template: '#cart-component',
  //     data() {
  //       return {
  //         name: 'Cart Component',
  //         loading: false
  //       };
  //     },
  //     mounted() {
  //      console.log('Cart component loaded!')
  //     },
  //   };

  var data = {
    name: 'Cart Component',
    loading: false,
  };

  // 2. Define some routes
  // Each route should map to a component. The "component" can
  // either be an actual component constructor created via
  // `Vue.extend()`, or just a component options object.
  // We'll talk about nested routes later.
  const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
  ];

  // 3. Create the router instance and pass the `routes` option
  // You can pass in additional options here, but let's
  // keep it simple for now.
  const router = new VueRouter({
    mode: 'history',
    routes, // short for `routes: routes`
  });

  // 4. Create and mount the root instance.
  // Make sure to inject the router with the router option to make the
  // whole app router-aware.
  const app = new Vue({
    router,
    data,
  }).$mount('#shop-app');

  // Now the app has started!
}
