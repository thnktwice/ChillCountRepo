//Cordova code
Meteor.startup(function(){
  if (Meteor.isCordova){
    //the device package is useful because configuration of the bluetooth 
    //is different in android and in iod
    // alert('CORDOVA');
    // alert(device.model);
    // alert(device.cordova);
    var isAndroid = (device.platform !== 'iOS');
    if (!isAndroid){
      //Add bluetooth stuff
    }
  }
});
