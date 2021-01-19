/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var CountriesComponent = {
    template: '#countries-component',
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
          payment_methods: [],
          fw_processing_fees: {
            local: '',
            international: '',
          },
        },
      };
    },
    methods: {
      getCountries() {
        doGet('/data/countries', 'GET')
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              null,
              'Could not fetch Countries',
              () => {
                this.countries = data.data;
              }
            );
          })
          .catch((err) => {
            this.networkErrorAlert(this.$buefy, err);
          });
      },
      addCountry() {
        this.loading = true;

        this.getCountries();
        doPost('/data/countries/new', 'POST', this.country_form)
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              'Country added successfully',
              'Could not add Country',
              () => {
                this.getCountries();
              }
            );

            this.activeTab = 0;

            this.country_form = {
              name: '', // Nigeria
              short_code: '', // NG
              currency_code: '', // NGN
              dollar_exchange_rate: '', // 380
              phonenumber_code: '', // +234
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
      updateCountry() {
        this.loading = true;
        doPost(`/data/countries/${this.selected_country._id}/update`, 'PUT', {
          update: this.country_form,
        })
          .then((data) => {
            this.showAlerts(
              this.$buefy,
              data,
              'Country updated successfully',
              'Could not update Country',
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
