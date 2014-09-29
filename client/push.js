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

      registerForNotifications:function (){
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

Meteor.startup(function () {
  if (Meteor.isCordova){
    Deps.autorun(function(){ 
      if(Meteor.userId()){
        pushStuff.registerForNotifications();
      }
    });
  }   
});