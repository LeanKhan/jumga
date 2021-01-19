/**
 * Open-Shop App (I call this an 'App' and not 'Component' because it is a parent Component)
 */
if (document.getElementById('open-shop-app')) {
  const data = {
    activeStep: 0,
  };

  const OpenShopApp = new Vue({
    data,
    components: {
      'register-form': RegisterFormComponent,
    },
  }).$mount('#open-shop-app');
}
