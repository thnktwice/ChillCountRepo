if (Meteor.isCordova){
  // alert('i----------sCordova');
  Meteor.startup(function () {

    alert("------ISSTARTUP");

      var pushNotification = window.plugins.pushNotification;
      //pour le push
      alert(window.plugins);
      var pushSuccessHandler = function (result) { 
        alert('pushResult = ' + result); 
      };

      var pushErrorHandler = function (error) { 
        alert('pushError = ' + error); 
      };

      var pushTokenHandler = function (result) { 
        alert('iOS device token = ' + result);
        Session.set('device_token', result); 
      };

      pushNotification.register(
        pushTokenHandler,
        pushErrorHandler,
        {
        "badge":"true",
        "sound":"true",
        "alert":"true",
        "ecb":"onNotificationAPN"
        }
      );
  });
}