//Cordova code
//
var bleManager = function() {
  //the device package is useful because configuration of the bluetooth 
  //is different in android and in iod

  var addressKey = "beanAddress";

  var beanServiceUuid = "";
  var beanCharacteristicUuid = "";
  var clientCharacteristicConfigDescriptorUuid = "";
  var batteryServiceUuid = "2a19";
  var batteryLevelCharacteristicUuid = "";

  var scanTimer = null;
  var connectTimer = null;
  var reconnectTimer = null;

  var iOSPlatform = "iOS";
  var androidPlatform = "Android"; 

  var error = function (error_message) {
    alert(error_message.error + " : " + error_message.message);
  };

  var stopScanSuccess = function (successReturn) {
    if (successReturn.status === "scanStopped") {
      console.log("Scan was stopped successfully");
    } else {
      console.log("Unexpected stop scan status: " + successReturn.status);
    }
  };

  var scanTimeout = function () {
    console.log("Scanning time out, stopping");
    bluetoothle.stopScan(stopScanSuccess, error);
  };

  var clearScanTimeout = function () {
    console.log("Clearing scanning timeout");
    if (scanTimer !== null) {
      Meteor.clearTimeout(scanTimer);
    }
  };

  var connectTimeout = function () {
    console.log("Connection timed out");
  };

  var clearConnectTimeout = function () { 
    console.log("Clearing connect timeout");
    if (connectTimer !== null) {
      Meteor.clearTimeout(connectTimer);
    }
  };

  var tempDisconnectDevice = function () {
    console.log("Disconnecting from device to test reconnect");
    bluetoothle.disconnect(tempDisconnectSuccess, error);
  };

  var tempDisconnectSuccess = function (successReturn) {
    if (successReturn.status === "disconnected") {
      console.log("Temp disconnect device and reconnecting in 1 second. Instantly reconnecting can cause issues");
      Meteor.setTimeout(reconnect, 1000);
    } else if (successReturn.status === "disconnecting") {
      console.log("Temp disconnecting device");
    } else {
      console.log("Unexpected temp disconnect status: " + successReturn.status);
    }
  };

  var reconnect = function () {
    console.log("Reconnecting with 3 second timeout");
    bluetoothle.reconnect(reconnectSuccess, reconnectError);
    reconnectTimer = Meteor.setTimeout(reconnectTimeout, 3000);
  };

  var reconnectSuccess = function (successReturn) {
    if (successReturn.status === "connected") {
      console.log("Reconnected to : " + successReturn.name + " - " + successReturn.address);
      clearReconnectTimeout();
      if (device.platform === iOSPlatform) {
        console.log("Reconnected on IOS ! good to go");
        var params = {"serviceUuids":beanServiceUuid};
        // bluetoothle.services(servicesHeartSuccess, servicesHeartError, paramssuccessReturn);
      }
      else if (device.platform === androidPlatform) {
        console.log("Beginning discovery for android");
        alert('lets go discover then little Android Friend !');
        // bluetoothle.discover(discoverSuccess, discoverError);
      }
    } else if (successReturn.status === "connecting") {
      console.log("Reconnecting to : " + successReturn.name + " - " + successReturn.address);
    } else {
      console.log("Unexpected reconnect status: " + successReturn.status);
      disconnectDevice();
    }
  };

  var reconnectError = function (error_message) {
    error(error_message);
    disconnectDevice();
  };

  var reconnectTimeout = function() {
    console.log("Reconnection timed out");
  };

  var clearReconnectTimeout = function() { 
    console.log("Clearing reconnect timeout");
    if (reconnectTimer !== null) {
      Meteor.clearTimeout(reconnectTimer);
    }
  };

  var disconnectDevice = function() {
    bluetoothle.disconnect(disconnectSuccess, error);
  };

  var disconnectSuccess = function(successReturn) {
    if (successReturn.status === "disconnected") {
      console.log("Disconnect device");
      closeDevice();
    } else if (successReturn.status === "disconnecting") {
      console.log("Disconnecting device");
    } else {
      console.log("Unexpected disconnect status: " + successReturn.status);
    }
  };

  var closeDevice = function() {
    bluetoothle.close(closeSuccess, error);
  };

  var closeSuccess = function(successReturn) {
    if (successReturn.status === "closed") {
      console.log("Closed device");
    } else {
      console.log("Unexpected close status: " + successReturn.status);
    }
  };

  var closeError = function(successReturn) {
    console.log("Close error: " + obj.error + " - " + obj.message);
  };

  var connectError = function (error_message) {
    console.log("Connect error: " + obj.error + " - " + obj.message);
    clearConnectTimeout();
  };

  var connectSuccess = function(successReturn) {
    if (successReturn.status === "connected") {
      console.log("Connected to : " + successReturn.name + " - " + successReturn.address);
      clearConnectTimeout();
      tempDisconnectDevice();
    } else if (successReturn.status === "connecting") {
      console.log("Connecting to : " + successReturn.name + " - " + successReturn.address);
    } else {
      console.log("Unexpected connect status: " + successReturn.status);
      clearConnectTimeout();
    }
  };

  var connectDevice = function (address) {
    console.log("Begining connection to: " + address + " with 5 second timeout");
    var params = {"address":address};
    bluetoothle.connect(connectSuccess, error, params);
    connectTimer = Meteor.setTimeout(connectTimeout, 5000);
  };

  var startScanSuccessCallback = function (successReturn) {
    if (successReturn.status === 'scanStarted') {
      console.log("Scan was started successfully, stopping in 10");
      scanTimer = Meteor.setTimeout(scanTimeout, 10000);
    }
    else if (successReturn.status === 'scanResult') {

      if(successReturn.name === 'Bean') {

        console.log("Bean "+ successReturn.address + " detected. Stopping scan");
        bluetoothle.stopScan(stopScanSuccess, error);
        clearScanTimeout();

        window.localStorage.setItem(addressKey, successReturn.address);

        connectDevice(successReturn.address);
      }
    }
    else {
      console.log("Unexpected start scan status: " + successReturn.status);
    }
  };

  var initializeSuccessCallback = function (successReturn) {
    if (successReturn.status === 'enabled') {
      var address = window.localStorage.getItem(addressKey);
      if (address === null){
        console.log("Bluetooth init success");
        var params = {"serviceUuids": beanServiceUuid};
        bluetoothle.startScan(startScanSuccessCallback, error, {'serviceUuids':[]});
      }
      else {
        connectDevice(address);
      }
    }
    else {
      console.log("Unexpected initialize status: " + successReturn.status);
    }
  };

  var myself = {
    setup: function(){
      bluetoothle.initialize(initializeSuccessCallback, error, {request:true});
    }
  };

  return myself;

}.call();

//Here we call the above function
Meteor.startup(function () {
  if (Meteor.isCordova) {
    bleManager.setup();
  }
});
