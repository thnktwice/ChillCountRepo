Meteor.startup(function () {

  if (Meteor.isCordova){
    var pushNotification = window.plugins.pushNotification;
    //pour le push
    var pushSuccessHandler = function (result) { 
      alert('result = ' + result); 
    };
    var pushErrorHandler = function (error) { 
      alert('error = ' + error); 
    };
    var pushTokenHandler = function (result) { 
      alert('iOS device token = ' + result); 
    };

    pushNotification.register(
      pushTokenHandler,
      pushErrorHandler,
      {"badge":"true",
      "sound":"true",
      "alert":"true",
      "ecb":"onNotificationAPN"});     
  }

});