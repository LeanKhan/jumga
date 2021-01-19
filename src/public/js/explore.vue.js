/** Explore page Vue Component */
if (document.querySelector('#explore-app')) {
  var data = {
    name: 'Explore App',
    loading: false,
    radioButton: null,
  };

  const app = new Vue({
    data,
  }).$mount('#explore-app');
}
