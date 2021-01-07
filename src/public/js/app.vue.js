if (document.querySelector('#vue-app')) {
  const app = new Vue({
    el: '#vue-app',
    components: {
      'shop-dashboard': ShopDashboardComponent,
    },
  });
}
