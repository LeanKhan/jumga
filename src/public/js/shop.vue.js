/**
 * THE SHOP VUE APP
 */
if (document.querySelector('#shop-app')) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
  });

  Vue.filter('currency', (value) => `${formatter.format(value)}`);

  var data = {
    name: 'Shop Cart Component',
    loading: false,
  };

  const app = new Vue({
    data,
  }).$mount('#shop-app');
}
