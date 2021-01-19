/**
 * Admin: Riders Component
 */
/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var RidersComponent = {
    template: '#riders-component',
    mixins: [NotificationMixin],
    data() {
      return {
        activeTab: 0,
        loading: false,
        columns: [
          {
            field: 'firstname',
            label: 'Firstname',
          },
          {
            field: 'lastname',
            label: 'Lastname',
          },
          {
            field: 'employed',
            label: 'Employed',
          },
          {
            field: 'account.subaccount_id',
            label: 'Has Account?',
          },
        ],
        riders: [],
        update: false,
        selected_rider: null,
        rider_form: {
          firstname: '',
          lastname: '',
          bio: '',
          account: {
            account_name: '',
            account_number: '',
            bank: '',
            country: '',
            currency: '',
          },
          bio: '',
        },
      };
    },
    methods: {
      getRiders() {
        doGet('/riders', 'GET')
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              null,
              'Could not fetch Dispatch Riders',
              () => {
                this.riders = data.data;
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          });
      },
      fetchRider() {
        doGet(`/riders/${this.selected_rider._id}`, 'GET')
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              null,
              'Could not fetch Dispatch Rider',
              () => {
                this.rider_form = data.data;
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          });
      },
      addRider() {
        this.loading = true;

        doPost('/riders/new', 'POST', { rider: this.rider_form })
          .then((data) => {
            // show toast here...
            console.log(data); // JSON data parsed by `data.json()` call

            this.activeTab = 0;
            this.showAlerts(
              this.$buefy,
              data,
              'Dispatch Rider Added Successfully!',
              'Error adding Dispatch Rider',
              () => {
                this.getRiders();
              }
            );

            // TODO: this can still be modularized so I dont have to
            // be writing "x y'd successfully!" or "Error y-ing x"

            this.rider_form = {
              firstname: '',
              lastname: '',
              bio: '',
              account: {
                account_name: '',
                account_number: '',
                bank: '',
                country: '',
                currency: '',
              },
              bio: '',
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
      addRiderAccount() {
        this.loading = true;

        doPost('/riders/add-account', 'POST', { rider: this.rider_form })
          .then((data) => {
            console.log(data);

            this.showAlerts(
              this.$buefy,
              data,
              'Dispatch Rider Account Added Successfully!',
              'Error adding Dispatch Rider Account',
              this.getRiders()
            );

            this.selected_rider = null;

            this.activeTab = 0;

            this.rider_form = {
              firstname: '',
              lastname: '',
              bio: '',
              account: {
                account_name: '',
                account_number: '',
                bank: '',
                country: '',
                currency: '',
              },
              bio: '',
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
      updateRider() {
        this.loading = true;
        doPost(`/riders/${this.selected_rider._id}/update`, 'PUT', {
          update: this.rider_form,
        })
          .then((data) => {
            console.log(data);
            this.activeTab = 0;

            this.showAlerts(
              this.$buefy,
              data,
              'Dispatch Rider Updated Successfully!',
              'Error updating Dispatch Rider',
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

      assignToShop() {
        doPost(`/riders/${this.selected_rider._id}/assign-to-shop`, 'PATCH', {
          rider: this.rider_form,
        })
          .then((data) => {
            // show toast here...
            console.log(data); // JSON data parsed by `data.json()` call
            this.showAlerts(
              this.$buefy,
              data,
              'Dispatch Rider assigned to Shop successfully!',
              'Error assigning Dispatch Rider to Shop',
              () => {
                this.getRiders();
              }
            );

            this.selected_rider = null;

            this.activeTab = 0;

            this.rider_form = {
              firstname: '',
              lastname: '',
              bio: '',
              account: {
                account_name: '',
                account_number: '',
                bank: '',
                country: '',
                currency: '',
              },
              bio: '',
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
      goToAddAccount() {
        this.fetchRider();

        this.activeTab = 2;
      },
      goToAddRider() {
        this.activeTab = 1;
      },

      cancel() {
        this.update = false;
        this.activeTab = 0;
        this.selected_rider = null;
      },

      goToUpdateRider() {
        this.update = true;
        this.activeTab = 1;

        if (this.selected_rider) {
          this.rider_form = this.selected_rider;
        }
      },
    },
    mounted() {
      console.log('Here in Riders Table Component! Thank you Jesus!!!');

      this.getRiders();
    },
  };
}
