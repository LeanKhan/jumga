/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var ShopsComponent = {
    template: '#shops-component',
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
            if (data.success) {
              this.shops = data.data;
            } else {
              console.error(data.error);

              this.$buefy.notification.open({
                duration: 5000,
                message: 'Could not fetch Shops',
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
              message: 'Could not fetch Shops',
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
      deleteShop() {
        this.loading = true;

        doGet(`/shops/${this.selected_shop._id}`, 'DELETE')
          .then((data) => {
            if (data.success) {
              this.getShops();
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
