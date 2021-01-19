/**
 * Merchant: Update Shop Component
 */
if (document.getElementById('shop-dashboard')) {
  var UpdateShopComponent = {
    template: '#update-shop-component',
    mixins: [NotificationMixin],
    props: [
      'shop_id',
      'shop_slug',
      'shop_description',
      'shop_theme_color',
      'shop_banner_image',
      'shop_logo',
    ],
    data() {
      return {
        loading: false,
        activeTab: 0,
        shop_form: {
          theme_color: this.shop_theme_color,
          description: this.shop_description,
          pictures: {
            banner_image: this.shop_banner_image,
            logo: this.shop_logo,
          },
        },
      };
    },
    methods: {
      updateShop() {
        this.loading = true;
        doPost('/shops/dashboard/update', 'PUT', { update: this.shop_form })
          .then((data) => {
            console.log(data);

            this.activeTab = 0;
            this.showAlerts(
              this.$buefy,
              data,
              'Shop updated successfully!',
              'Could not update Shop',
              () => {
                this.$router.push();
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
    },
    mounted() {
      console.log('Loaded update-shop component! Thank you Jesus!');
    },
  };
}
