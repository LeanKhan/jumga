if (document.getElementById('shop-dashboard')) {
  var ProductsComponent = {
    template: '#products-component',
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
        doGet('/products', 'GET')
          .then((d) => {
            this.products = d.data;
          })
          .catch((err) => {
            console.error(err);
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

            this.getProducts();
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
            this.isOpen = false;
          });
      },
    },
    mounted() {
      console.log('Loaded merchant app! Thank you Jesus!');

      this.getProducts();
    },
  };

  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'decimal',
  //   minimumFractionDigits: 2,
  // });

  // Vue.filter('currency', value => `\u20A6 ${formatter.format(value)}`);
}
