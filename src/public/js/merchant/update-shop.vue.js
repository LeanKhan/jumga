if (document.getElementById('shop-dashboard')) {
  var UpdateShopComponent = {
    template: '#update-shop-component',
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
            console.log(data); // JSON data parsed by `data.json()` call
            this.activeTab = 0;

            if (data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: 'Shop Updated Successfully!',
                position: 'is-top',
                type: 'is-success',
                queue: false,
              });
            }

            if (!data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: data.error || `${data.msg} \n [Could not Update shop]`,
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

            this.$router.push('/');
          })
          .catch((err) => {
            console.error(err);

            if (!err.success && err.error) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || 'Error updating shop',
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
    },
    mounted() {
      console.log('Loaded update shop! Thank you Jesus!');
    },
  };

  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'decimal',
  //   minimumFractionDigits: 2,
  // });

  // Vue.filter('currency', value => `\u20A6 ${formatter.format(value)}`);
}
