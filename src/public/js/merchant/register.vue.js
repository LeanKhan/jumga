/**
 * Register-Shop Component
 */
if (document.getElementById('open-shop-app')) {
  var RegisterFormComponent = {
    template: '#register-form-component',
    props: ['current_step', 'categories', 'countries', 'user'],
    data() {
      return {
        name: 'Register Shop Component',
        step: this.current_step,
        loading: false,
        shop_form: {
          country: {
            id: '',
            code: '',
          },
          category: {
            id: '',
            code: '',
          },
        },
      };
    },
    mounted() {
      this.step = this.current_step;

      if (this.user && !this.user.shop && !this.user.isAdmin) {
        console.log('signed in!');
        this.step = 1;
      }

      if (this.user && this.user.shop && !this.user.isAdmin) {
        console.log('signed in and open account!');
        this.step = 2;
      }
    },
  };
}
