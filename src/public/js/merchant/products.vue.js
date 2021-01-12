if (document.getElementById('shop-dashboard')) {
  var ProductsComponent = {
    template: '#products-component',
    props: ['shop_id'],
    data() {
      return {
        loading: false,
        activeTab: 0,
        products: [], // list of products :) thank you Jesus!
        columns: [
          {
            field: '_id',
            label: 'ID',
            width: '40',
            numeric: false,
          },
          {
            field: 'name',
            label: 'Name',
          },
        ],
        product_form: {
          name: '',
          price: '',
          description: '',
          category: '',
          tags: [],
        },
      };
    },
    methods: {
      getProducts() {
        doGet(`/products?shop=${this.shop_id}`, 'GET')
          .then((d) => {
            this.products = d.data;
          })
          .catch((err) => {
            console.error(err);

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Could not fetch Products!',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          });
      },
      addProduct() {
        this.loading = true;
        doPost('/products/new', 'POST', this.product_form)
          .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            this.activeTab = 0;

            this.product_form = {
              name: '',
              price: '',
              description: '',
              category: '',
              tags: [],
            };

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Product added successully!',
              position: 'is-top',
              type: 'is-success',
              queue: false,
            });

            this.getProducts();
          })
          .catch((err) => {
            console.error(err);

            if (!err.success && err.error) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || 'Error adding Product',
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
          })
          .finally(() => {
            this.loading = false;
            this.isOpen = false;
          });
      },
    },
    mounted() {
      console.log('Loaded shop products component! Thank you Jesus!');

      this.getProducts();
    },
  };

  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'decimal',
  //   minimumFractionDigits: 2,
  // });

  // Vue.filter('currency', value => `\u20A6 ${formatter.format(value)}`);
}
