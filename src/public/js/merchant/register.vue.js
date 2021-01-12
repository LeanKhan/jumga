if (document.getElementById('open-shop-app')) {
  var RegisterFormComponent = {
    template: '#register-form-component',
    props: ['current_step', 'categories', 'user'],
    data() {
      return {
        name: 'Register Form Component',
        step: this.current_step,
      };
    },
    mounted() {
      if (this.user && !this.user.shop && !this.user.isAdmin) {
        console.log('signed in!');
        this.step = 1;
      }
    },
  };
}
