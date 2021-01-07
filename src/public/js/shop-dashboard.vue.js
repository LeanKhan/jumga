if (document.getElementById('shop-dashboard')) {
  //   var ShopDashboardComponent = {
  //     template: '#shop-dashboard-component',
  //     data() {
  //       return {
  //         activeTab: 0,
  //         showBooks: false,
  //         isSwitched: false,
  //       };
  //     },

  //     mounted() {
  //       console.log(
  //         'HELLO, WELCOME TO SHOP DASHBOARD COMPONENT. THANK YOU JESUS!'
  //       );
  //     },
  //   };

  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'decimal',
  //   minimumFractionDigits: 2,
  // });

  // Vue.filter('currency', value => `\u20A6 ${formatter.format(value)}`);

  const data = {
    activeTab: 0,
    showBooks: false,
    isLive: false,
    product_form: {
      name: '',
      price: '',
      description: '',
      category: '',
      tags: [],
    },
  };

  async function postData(url = '', method, data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const methods = {
    addProduct: function () {
      postData('/products/new', 'POST', this.product_form)
        .then((data) => {
          console.log(data); // JSON data parsed by `data.json()` call
        })
        .catch((err) => {
          console.error(err);
        });
    },
    openShop: function (ev) {
      console.log('Shop is now open!', ev);

      postData(`/shops/open?open=${ev}`, 'PATCH', { data: true })
        .then((data) => {
          console.log(data); // JSON data parsed by `data.json()` call
          this.isLive = data.isLive;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  };

  const ShopDashboard = new Vue({
    el: '#shop-dashboard',
    data,
    methods,
    components: {
      'products-table': ProductsTableComponent,
    },
  });
}
