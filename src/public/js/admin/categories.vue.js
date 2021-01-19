/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var CategoriesComponent = {
    template: '#categories-component',
    mixins: [NotificationMixin],
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
        update: false,
        selected_category: null,
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
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              null,
              'Could not fetch Categories',
              () => {
                this.categories = data.data;
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          });
      },
      addCategory() {
        this.loading = true;

        doPost('/data/categories/new', 'POST', this.category_form)
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              'Category added successfully',
              'Could not add Category',
              () => {
                this.getCategories();
              }
            );

            this.activeTab = 0;

            this.category_form = {
              name: '', // Fashion
              item_name_singular: '', // Clothes,
              item_name_plural: '',
            };
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          })
          .finally(() => {
            this.loading = false;
            this.isOpen = false;
          });
      },
      updateCategory() {
        this.loading = true;
        doPost(`/data/categories/${this.selected_category._id}/update`, 'PUT', {
          update: this.category_form,
        })
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              'Category updated successfully',
              'Could not update Category',
              () => {
                this.cancel();
              }
            );

            this.activeTab = 0;
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      goToAddCategory() {
        this.activeTab = 1;
      },
      cancel() {
        this.update = false;
        this.activeTab = 0;
        this.selected_category = null;
      },
      goToUpdateCategory() {
        this.update = true;
        this.activeTab = 1;

        if (this.selected_category) {
          this.category_form = this.selected_category;
        }
      },
    },
    mounted() {
      this.getCategories();
    },
  };
}
