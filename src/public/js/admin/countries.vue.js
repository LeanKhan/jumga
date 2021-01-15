/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var CountriesComponent = {
    template: '#countries-component',
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
            field: 'short_code',
            label: 'Short Code',
          },
          {
            field: 'currency_code',
            label: 'Currency Code',
          },
          {
            field: 'dollar_exchange_rate',
            label: 'Dollar Exchange Rate',
          },
          {
            field: 'phonenumber_code',
            label: 'Phonenumber Code',
          },
        ],
        countries: [],
        update: false,
        selected_country: null,
        country_form: {
          name: '', // Nigeria
          short_code: '', // NG
          currency_code: '', // NGN
          dollar_exchange_rate: '', // 380
          phonenumber_code: '', // +234
        },
      };
    },
    methods: {
      getCountries() {
        doGet('/data/countries', 'GET')
          .then((d) => {
            this.countries = d.data;
          })
          .catch((err) => {
            console.error(err);

            this.$buefy.notification.open({
              duration: 5000,
              message: 'Could not fetch Countries',
              position: 'is-top',
              type: 'is-danger',
              queue: false,
            });
          });
      },
      addCountry() {
        this.loading = true;

        doPost('/data/countries/new', 'POST', this.country_form)
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

            this.country_form = {
              name: '', // Nigeria
              short_code: '', // NG
              currency_code: '', // NGN
              dollar_exchange_rate: '', // 380
              phonenumber_code: '', // +234
            };

            this.getCountries();
          })
          .catch((err) => {
            // show toast here...
            console.error(err);

            if (!err.success && err.error) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || 'Could not add Country',
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
      updateCountry() {
        this.loading = true;
        doPost(`/data/countries/${this.selected_country._id}/update`, 'PUT', {
          update: this.country_form,
        })
          .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            this.activeTab = 0;

            if (data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message: 'Country Updated Successfully!',
                position: 'is-top',
                type: 'is-success',
                queue: false,
              });

              this.cancel();
            }

            if (!data.success) {
              this.$buefy.notification.open({
                duration: 5000,
                message:
                  data.msg || `${data.error} \n [Could not Update Country]`,
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

            // this.$router.push('/');
          })
          .catch((err) => {
            console.error(err);

            if (!err.success && err.error) {
              this.$buefy.notification.open({
                duration: 5000,
                message: err.error.message || 'Error updating Country',
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
      goToAddCountry() {
        this.activeTab = 1;
      },
      cancel() {
        this.update = false;
        this.activeTab = 0;
        this.selected_country = null;
      },
      goToUpdateCountry() {
        this.update = true;
        this.activeTab = 1;

        if (this.selected_country) {
          this.country_form = this.selected_country;
        }
      },
    },
    mounted() {
      this.getCountries();
    },
  };
}
