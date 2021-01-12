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
    },
    mounted() {
      this.getCountries();
    },
  };
}
