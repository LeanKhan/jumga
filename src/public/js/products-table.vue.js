if (document.getElementById('shop-dashboard')) {
  var ProductsTableComponent = {
    template: '#products-table-component',
    props: ['products'],
    data() {
      return {
        data: [
          {
            id: 1,
            first_name: 'Jesse',
            last_name: 'Simmons',
            date: '2016-10-15 13:43:27',
            gender: 'Male',
          },
          {
            id: 2,
            first_name: 'John',
            last_name: 'Jacobs',
            date: '2016-12-15 06:00:53',
            gender: 'Male',
          },
          {
            id: 3,
            first_name: 'Tina',
            last_name: 'Gilbert',
            date: '2016-04-26 06:26:28',
            gender: 'Female',
          },
          {
            id: 4,
            first_name: 'Clarence',
            last_name: 'Flores',
            date: '2016-04-10 10:28:46',
            gender: 'Male',
          },
          {
            id: 5,
            first_name: 'Anne',
            last_name: 'Lee',
            date: '2016-12-06 14:38:38',
            gender: 'Female',
          },
        ],
        columns: [
          {
            field: '_id',
            label: 'ID',
            width: '40',
            numeric: false,
          },
          {
            field: 'name',
            label: 'Name',
          },
        ],
      };
    },
  };

  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'decimal',
  //   minimumFractionDigits: 2,
  // });

  // Vue.filter('currency', value => `\u20A6 ${formatter.format(value)}`);
}
