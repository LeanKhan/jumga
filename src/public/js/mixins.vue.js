var NotificationMixin = {
  methods: {
    /**
     * Show Alerts :)
     * @param {*} $buefy the this.$buefy instance
     * @param {*} data the response from fetch
     * @param {*} success_message the success message
     * @param {*} failure_message the failure message
     * @param {*} done the function you want to run if success
     */
    showAlerts: function (
      $buefy,
      data,
      success_message,
      failure_message,
      done
    ) {
      console.log(data);

      if (data.success) {
        if (success_message) {
          $buefy.notification.open({
            duration: 5000,
            message: success_message,
            position: 'is-top',
            type: 'is-success',
            queue: false,
          });
        }

        done();
      }
      if (!data.success && data.alerts) {
        data.alerts.forEach((alert) => {
          $buefy.notification.open({
            duration: 5000,
            message: alert.msg,
            position: 'is-top',
            type: 'is-danger',
            queue: false,
          });
        });
      }

      if (!data.success) {
        $buefy.notification.open({
          duration: 5000,
          message: data.error || failure_message,
          position: 'is-top',
          type: 'is-danger',
          queue: false,
        });
      }
    },

    networkErrorAlert: function ($buefy, err, done = null) {
      console.error(err);

      $buefy.notification.open({
        duration: 5000,
        message: err.message || 'Network or Server Error',
        position: 'is-top',
        type: 'is-danger',
        queue: false,
      });

      if (done) {
        done();
      }
    },
  },
};
