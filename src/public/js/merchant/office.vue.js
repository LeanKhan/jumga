/* eslint-disable no-unused-vars */
if (document.getElementById('shop-dashboard')) {
  var OfficeComponent = {
    template: '#office-component',
    props: ['shop_id', 'shop_slug'],
    data() {
      return {
        activeTab: 0,
        loading: false,
        shop: null,
        sales: [],
      };
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
    },
    mounted() {
      this.getShop();
    },
  };
}
