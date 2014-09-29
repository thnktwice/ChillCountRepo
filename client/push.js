Meteor.startup(function () {
  if (Meteor.isCordova){
    var pushStuff = function () {

      var pushNotification = window.plugins.pushNotification;
      //pour le push
      var pushSuccessHandler = function (result) { 
        alert('pushResult = ' + result); 
      };

      var pushErrorHandler = function (error) { 
        alert('pushError = ' + error); 
      };

      var pushTokenHandler = function (result) { 
        console.log('iOS device token = ' + result); 
        Meteor.user().setDevice(result);
      };

      var myself = {

        registerForNotifications:function () {
          console.log("REGISTERRR");
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
        }
      };

      return myself;

    }.call();

    Deps.autorun(function(){ 
      if(Meteor.user()){
        console.log("USERRR");
        pushStuff.registerForNotifications();
      }
    });
  }   
});