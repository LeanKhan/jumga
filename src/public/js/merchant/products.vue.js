/**
 * Merchant: Products-Component
 */
if (document.getElementById('shop-dashboard')) {
  var ProductsComponent = {
    template: '#products-component',
    props: ['shop_id', 'shop_slug', 'country'],
    mixins: [NotificationMixin],
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
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              null,
              'Could not fetch Products',
              () => {
                this.products = data.data;
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          });
      },
      updateProduct() {
        this.loading = true;
        doPost(`/products/${this.selected_product._id}/update`, 'PUT', {
          update: this.product_form,
        })
          .then((data) => {
            this.activeTab = 0;
            this.showAlerts(
              this.$buefy,
              data,
              'Product updated successfully',
              'Could not update Product',
              () => {
                this.cancel();
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      deleteProduct() {
        this.loading = true;
        doGet(`/products/${this.selected_product._id}`, 'DELETE')
          .then((data) => {
            this.activeTab = 0;
            this.showAlerts(
              this.$buefy,
              data,
              'Product deleted successfully',
              'Could not delete Product',
              () => {
                this.cancel();
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
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
            this.activeTab = 0;
            this.showAlerts(
              this.$buefy,
              data,
              'Product added successfully',
              'Could not add Product',
              () => {
                this.resetForm();
                this.getProducts();
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
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
            'X-Requested-With': 'XMLHttpRequest',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            this.showModal = false;
            this.showAlerts(
              this.$buefy,
              data,
              'products uploaded successfully!',
              'Could not upload Products',
              () => {
                this.getProducts();
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
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
      resetForm() {
        this.product_form = {
          shop_id: this.shop_id,
          shop_slug: this.shop_slug,
          name: '',
          price: '',
          description: '',
          category: '',
          tags: [],
        };
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
}
