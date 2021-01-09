/* eslint-disable no-unused-vars */
if (document.getElementById('admin-dashboard')) {
  var RidersComponent = {
    template: '#riders-component',
    data() {
      return {
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
        ],
        riders: [],
        rider_form: {
          firstname: '',
          lastname: '',
          bio: '',
          account_name: '',
          account_number: '',
          bank: '',
          bio: '',
          country: '',
          currency: '',
        },
        loading: false,
        isOpen: false,
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
          });
      },
      addRider() {
        this.loading = true;

        postData('/riders/new', 'POST', this.rider_form)
          .then((data) => {
            // show toast here...
            console.log(data); // JSON data parsed by `data.json()` call

            this.getRiders();
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
      console.log('Here in Riders Table Component! Thank you Jesus!!!');

      this.getRiders();
    },
  };
}
