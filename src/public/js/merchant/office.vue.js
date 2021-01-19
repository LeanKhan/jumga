/* eslint-disable no-unused-vars */
if (document.getElementById('shop-dashboard')) {
  var OfficeComponent = {
    template: '#office-component',
    props: ['shop_id', 'shop_slug', 'country'],
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
            if (data.success) {
              console.log(data.data);
              this.shop = data.data;

              this.getSales();
            } else {
              console.error(data.error);

              this.$buefy.notification.open({
                duration: 5000,
                message: 'Could not fetch Shop',
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            }
          })
          .catch((err) => {
            console.error(err);

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Could not fetch Shop',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          });
      },
      getDispatchRider(id, shop_slug) {
        const q = new URLSearchParams({
          select: ['firstname', 'lastname', 'picture'],
        }).toString();
        return doGet(`/riders/${id}?${q}`, 'GET')
          .then((data) => {
            if (data.success) {
              return data.data;
            } else {
              console.error(data.error);

              this.$buefy.notification.open({
                duration: 5000,
                message: `Could not fetch Dispatch Rider for Shop ${shop_slug}`,
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            }
            return { lastname: 'Not Found :/' };
          })
          .catch((err) => {
            return { firstname: 'Not Found :/' };

            console.error(err);

            this.$buefy.notification.open({
              duration: 5000,
              message: `Could not fetch Dispatch Rider for Shop ${shop_slug}`,
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          });
      },
      getSales(id) {
        doGet(`/shops/${this.shop_id}/sales`, 'GET').then((data) => {
          if (data.success) {
            this.sales = data.data;
          } else {
            console.error(data.error);

            this.$buefy.notification.open({
              duration: 5000,
              message: `Could not fetch shop sales`,
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          }
        });
      },
      deleteShop() {
        this.loading = true;

        doGet(`/shops/${this.shop_id}`, 'DELETE')
          .then((data) => {
            if (data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: 'Bye! We will miss you! Come back soon :3',
                position: 'is-top',
                type: 'is-success',
                queue: false,
              });

              window.location = '/';
            } else {
              console.error(data.error);

              this.$buefy.notification.open({
                duration: 5000,
                message: data.error || 'Shop could not be deleted :/',
                position: 'is-top',
                type: 'is-danger',
                queue: false,
              });
            }
          })
          .catch((err) => {
            console.log('Error deleting shop => ', err);

            this.$buefy.notification.open({
              duration: 5000,
              message: err.error || 'Shop could not be deleted :/',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
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
