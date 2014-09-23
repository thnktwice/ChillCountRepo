//Cordova code
Meteor.startup(function(){
  if (Meteor.isCordova){
    //the device package is useful because configuration of the bluetooth 
    //is different in android and in iod
    // alert('CORDOVA');
    // alert(device.model);
    // alert(device.cordova);
    var isAndroid = (device.platform !== 'iOS');

    var err = function(message) {
      alert("Error : " + message);
    };

    var stopScanning = function () {
      bluetoothle.stopScan(alert('scan stopped'), err('stop scan'));
    };

    var startScanSuccessCallback = function (successReturn) {
      alert('START SCAN ' + successReturn.status);
      if (successReturn.status === 'scanStarted') {
        alert("scan starting");
        setTimeout(stopScanning, 50000);
      }
      if (successReturn.status === "scanResult"){
        alert(successReturn.name);
      }

    };
    var initializeSuccessCallback = function (successReturn) {
      alert("Success : "+ successReturn.status);
      if (successReturn.status === 'enabled') {
        bluetoothle.startScan(startScanSuccessCallback, err('start scan'), {'serviceUuids':[]});
      }
    };

    //Bluetooth stuff
      //return {status:enabled} if ok
    bluetoothle.initialize(initializeSuccessCallback, err('init'), {request:true});

    if (!isAndroid){
      //IOS stuff
    }
  }
});
