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
          });
      },
      addCountry() {
        this.loading = true;

        doPost('/data/countries/new', 'POST', this.country_form)
          .then((data) => {
            // show toast here...
            console.log(data); // JSON data parsed by `data.json()` call

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
