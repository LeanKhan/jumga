if (document.getElementById('shop-dashboard')) {
  var ProductsComponent = {
    template: '#products-component',
    props: ['shop_id', 'shop_slug', 'country'],
    data() {
      return {
        loading: false,
        showModal: false,
        activeTab: 0,
        file: null,
        products: [], // list of products :) thank you Jesus!
        update: false,
        selected_product: null,
        product_form: {
          name: '',
          price: 0,
          description: '',
          picture: '',
          tags: [],
        },
      };
    },
    computed: {
      convertedCurrency: function () {
        return (
          parseFloat(this.product_form.price) *
          parseFloat(this.country.dollar_exchange_rate)
        );
      },
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
      updateProduct() {
        this.loading = true;
        doPost(`/products/${this.selected_product._id}/update`, 'PUT', {
          update: this.product_form,
        })
          .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            this.activeTab = 0;

            if (data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: 'Product Updated Successfully!',
                position: 'is-top',
                type: 'is-success',
                queue: false,
              });

              this.cancel();
            }

            if (!data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message:
                  data.error || `${data.msg} \n [Could not Update Product]`,
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            }

            // this.$router.push('/');
          })
          .catch((err) => {
            console.error(err);

            if (!err.success && err.error) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || 'Error updating Product',
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
          });
      },
      deleteProduct() {
        this.loading = true;
        doGet(`/products/${this.selected_product._id}`, 'DELETE')
          .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            this.activeTab = 0;

            if (data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: 'Product Deleted Successfully!',
                position: 'is-top',
                type: 'is-success',
                queue: false,
              });

              this.cancel();
            }

            if (!data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message:
                  data.error || `${data.msg} \n [Could not Delete Product]`,
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            }

            if (!data.success && data.alerts) {
              data.alerts.forEach((alert) => {
                this.$buefy.notification.open({
                  duration: 5000,
                  message: alert.msg,
                  position: 'is-top',
                  type: 'is-danger',
                  queue: false,
                });
              });
            }

            // this.$router.push('/');
          })
          .catch((err) => {
            console.error(err);

            if (!err.success && err.error) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || 'Error deleting Product',
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
          });
      },
      addProduct() {
        this.loading = true;
        doPost('/products/new', 'POST', {
          ...this.product_form,
          shop_slug: this.shop_slug,
        })
          .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            this.activeTab = 0;

            if (data.success) {
              this.product_form = {
                shop_id: this.shop_id,
                shop_slug: this.shop_slug,
                name: '',
                price: '',
                description: '',
                category: '',
                tags: [],
              };

              this.getProducts();

              this.$buefy.notification.open({
                duration: 5000,
                message: 'Product added successully!',
                position: 'is-top',
                type: 'is-success',
                queue: false,
              });
            }

            if (!data.success && data.alerts) {
              data.alerts.forEach((alert) => {
                this.$buefy.notification.open({
                  duration: 5000,
                  message: alert.msg,
                  position: 'is-top',
                  type: 'is-danger',
                  queue: false,
                });
              });
            }

            if (!data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: 'Error adding Product',
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            }

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
      submitBatchUpload() {
        this.loading = true;
        const formData = new FormData();

        formData.append('csv', this.file);

        fetch(`/products/${this.shop_id}/batch-upload`, {
          method: 'POST',
          mode: 'cors',
          body: formData,
          headers: {
            // 'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
            if (data.success) {
              this.showModal = false;
              this.getProducts();

              this.$buefy.notification.open({
                duration: 5000,
                message: 'Products Uploaded Successfully!',
                position: 'is-top',
                type: 'is-success',
                queue: false,
              });
            }

            if (!data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message:
                  data.error || `${data.msg} \n [Could not Upload Products]`,
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            this.$buefy.notification.open({
              duration: 5000,
              message: data.error || data.msg,
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      goToAddProduct() {
        this.activeTab = 1;
      },
      cancel() {
        this.update = false;
        this.activeTab = 0;
        this.selected_product = null;
      },
      goToUpdateProduct() {
        this.update = true;
        this.activeTab = 1;

        if (this.selected_product) {
          this.product_form = this.selected_product;
        }
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
