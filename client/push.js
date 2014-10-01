if (Meteor.isCordova){
  // alert('i----------sCordova');
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
  Meteor.startup(function () {

    alert("------ISSTARTUP");
    alert("heyhey");

      var pushNotification = window.plugins.pushNotification;
      //pour le push
      alert('h' +pushNotification);
      alert(pushNotification.register);
      console.log(window.plugins);
      alert(window.plugins);

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