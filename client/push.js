Meteor.startup(function () {
  if (Meteor.isCordova){
    var device_token = '';
    var pushNotification = window.plugins.pushNotification;
    //pour le push
    var pushSuccessHandler = function (result) { 
      alert('result = ' + result); 
    };
    var pushErrorHandler = function (error) { 
      alert('error = ' + error); 
    };
    var pushTokenHandler = function (result) { 
      console.log('iOS device token = ' + result); 
      device_token=result;
    };

    pushNotification.register(
      pushTokenHandler,
      pushErrorHandler,
      {"badge":"true",
      "sound":"true",
      "alert":"true",
      "ecb":"onNotificationAPN"});
    Deps.autorun(function(){ 
      if(Meteor.userId() && device_token !== ''){
        console.log('hey');
      }
    });     
  } 
    Deps.autorun(function(){ 
      if(Meteor.user()){
        console.log(Meteor.userId());
        console.log(Meteor.user().uname());
      }
    });     
});