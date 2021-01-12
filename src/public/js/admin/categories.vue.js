/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var CategoriesComponent = {
    template: '#categories-component',
    data() {
      return {
        activeTab: 0,
        loading: false,
        columns: [
          {
            field: 'name',
            label: 'Name',
          },
          {
            field: 'item_name_singular',
            label: 'Item Name (Singular)',
          },
          {
            field: 'item_name_plural',
            label: 'Item Name (Plural)',
          },
        ],
        categories: [],
        category_form: {
          name: '', // Fashion
          item_name_singular: '', // Clothes,
          item_name_plural: '',
        },
      };
    },
    methods: {
      getCategories() {
        doGet('/data/categories', 'GET')
          .then((d) => {
            this.categories = d.data;
          })
          .catch((err) => {
            console.error(err);

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Could not fetch Categories',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          });
      },
      addCategory() {
        this.loading = true;

        doPost('/data/categories/new', 'POST', this.category_form)
          .then((data) => {
            // show toast here...
            console.log(data); // JSON data parsed by `data.json()` call

            if (!data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: JSON.parse(data.error).message || data.msg,
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

            this.activeTab = 0;

            (this.category_form = {
              name: '', // Fashion
              item_name_singular: '', // Clothes,
              item_name_plural: '',
            }),
              this.getCategories();
          })
          .catch((err) => {
            // show toast here...
            console.error(err);

            if (!err.success && err.error) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || 'Could not add Category',
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
    },
    mounted() {
      this.getCategories();
    },
  };
}
