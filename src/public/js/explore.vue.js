if (document.querySelector('#explore-app')) {
  const Foo = {
    template: '<div>foo <router-link to="/bar">bar</router-link> </div>',
  };
  const Bar = {
    template: '<div>bar <router-link to="/foo">foo</router-link></div>',
  };

  var data = {
    name: 'Explore App',
    loading: false,
    radioButton: null,
  };

  // 2. Define some routes
  // Each route should map to a component. The "component" can
  // either be an actual component constructor created via
  // `Vue.extend()`, or just a component options object.
  // We'll talk about nested routes later.
  // const routes = [
  //   { path: '/foo', component: Foo },
  //   { path: '/bar', component: Bar },
  // ];

  // 3. Create the router instance and pass the `routes` option
  // You can pass in additional options here, but let's
  // keep it simple for now.
  // const router = new VueRouter({
  //   mode: 'history',
  //   routes, // short for `routes: routes`
  // });

  // 4. Create and mount the root instance.
  // Make sure to inject the router with the router option to make the
  // whole app router-aware.
  const app = new Vue({
    data,
  }).$mount('#explore-app');

  // Now the app has started!
}
