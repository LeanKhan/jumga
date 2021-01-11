if (document.getElementById('open-shop-app')) {
  var RegisterFormComponent = {
    template: '#register-form-component',
    props: ['current_step', 'categories'],
    data() {
      return {
        name: 'Register Form Component',
      };
    },
  };
}
