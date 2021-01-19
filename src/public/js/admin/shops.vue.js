/**
 * Admin: Shops-Component
 */
/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var ShopsComponent = {
    template: '#shops-component',
    mixins: [NotificationMixin],
    data() {
      return {
        activeTab: 0,
        loading: false,
        shops: [],
        selected_shop: null,
      };
    },
    methods: {
      getShops() {
        doGet(`/shops?query={}`, 'GET')
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              null,
              'Could not fetch Shops',
              () => {
                this.shops = data.data;
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          });
      },
      deleteShop() {
        this.loading = true;

        const ans = confirm(
          'Are you sure you want to delete this shop?\nNo going back o'
        );

        if (!ans) return false;

        doGet(`/shops/${this.selected_shop._id}`, 'DELETE')
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              'Shop deleted successfully',
              'Could not delete Shops',
              () => {
                this.getShops();
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
      this.getShops();
    },
  };
}
