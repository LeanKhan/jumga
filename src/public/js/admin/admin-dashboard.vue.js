/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-inner-declarations */
if (document.getElementById('admin-dashboard')) {
  const data = {
    activeTab: 0,
  };

  const routes = [
    { path: '', redirect: '/riders' },
    { path: '/riders', component: RidersComponent, name: 'Riders' },
    {
      path: '/categories',
      component: CategoriesComponent,
      name: 'Categories',
    },
    {
      path: '/countries',
      component: CountriesComponent,
      name: 'Countries',
    },
    { path: '/shops', component: ShopsComponent, name: 'Shops' },
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
    router,
    components: {
      riders: RidersComponent,
      categories: CategoriesComponent,
      countries: CountriesComponent,
    },
  }).$mount('#admin-dashboard');
}
