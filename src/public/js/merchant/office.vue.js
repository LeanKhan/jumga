/**
 * Merchant: Office-Component
 */
/* eslint-disable no-unused-vars */
if (document.getElementById('shop-dashboard')) {
  var OfficeComponent = {
    template: '#office-component',
    props: ['shop_id', 'shop_slug', 'country'],
    mixins: [NotificationMixin],
    data() {
      return {
        activeTab: 0,
        loading: false,
        shop: null,
        sales: [],
      };
    },
    computed: {
      totalSales: function () {
        if (this.sales.length) {
          return this.sales.reduce((sum, tx) => {
            return sum + tx.transaction.meta.shop_money || 0;
          }, 0);
        }

        return 0;
      },
    },
    methods: {
      getShop() {
        const q = new URLSearchParams({
          select: ['dispatch_rider'],
          populate: 'dispatch_rider',
        }).toString();
        doGet(`/shops/${this.shop_id}?${q}`, 'GET')
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              null,
              'Could not fetch Shop',
              () => {
                this.shop = data.data;
                this.getSales();
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          });
      },
      getSales() {
        doGet(`/shops/${this.shop_id}/sales`, 'GET')
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              null,
              'Could not fetch Shop Sales',
              () => {
                this.sales = data.data;
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
          'Are you sure you really want to DELETE this shop?\nNo going back o'
        );

        if (!ans) return false;

        doGet(`/shops/${this.shop_id}`, 'DELETE')
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              'Bye! We will miss you come back soon!',
              'Could not delete Shop',
              () => {
                window.location = '/';
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
      this.getShop();
    },
  };
}
