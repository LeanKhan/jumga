/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var RidersComponent = {
    template: '#riders-component',
    data() {
      return {
        activeTab: 0,
        loading: false,
        columns: [
          {
            field: '_id',
            label: 'ID',
            width: '40',
            numeric: false,
          },
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
          .then((d) => {
            this.riders = d.data;
          })
          .catch((err) => {
            console.error(err);

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Could not fetch Dispatch Riders',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          });
      },
      fetchRider() {
        doGet(`/riders/${this.selected_rider._id}`, 'GET')
          .then((d) => {
            this.rider_form = d.data;
          })
          .catch((err) => {
            console.error(err);

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Could not fetch Dispatch Rider',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          });
      },
      addRider() {
        this.loading = true;

        doPost('/riders/new', 'POST', { rider: this.rider_form })
          .then((data) => {
            // show toast here...
            console.log(data); // JSON data parsed by `data.json()` call

            this.activeTab = 0;

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

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Dispatch Rider added successfully!',
              position: 'is-top',
              type: 'is-success',
              queue: false,
            });

            this.getRiders();
          })
          .catch((err) => {
            // show toast here...
            console.error(err);

            if (!err.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || err.msg,
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
      addRiderAccount() {
        this.loading = true;

        doPost('/riders/add-account', 'POST', { rider: this.rider_form })
          .then((data) => {
            // show toast here...
            console.log('bad request?');
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

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Dispatch Rider Account added successfully!',
              position: 'is-top',
              type: 'is-success',
              queue: false,
            });

            this.getRiders();
          })
          .catch((err) => {
            // show toast here...
            console.error(err);

            console.log(this.$buefy.notification);

            if (!err.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || err.msg,
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
      goToAddAccount() {
        this.fetchRider();

        this.activeTab = 2;
      },
      assignToShop() {
        doPost(`/riders/${this.selected_rider._id}/assign-to-shop`, 'PATCH', {
          rider: this.rider_form,
        })
          .then((data) => {
            // show toast here...
            console.log('bad request?');
            console.log(data); // JSON data parsed by `data.json()` call

            if (!data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: data.error.message || data.msg,
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

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Dispatch Rider assigned to Shop successfully!',
              position: 'is-top',
              type: 'is-success',
              queue: false,
            });

            this.getRiders();
          })
          .catch((err) => {
            // show toast here...
            console.error(err);

            console.log(this.$buefy.notification);

            if (!err.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || err.msg,
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
      console.log('Here in Riders Table Component! Thank you Jesus!!!');

      this.getRiders();
    },
  };
}
