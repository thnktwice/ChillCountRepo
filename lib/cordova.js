//Cordova code
//
//
var pushStuff = function () {

  //pour le push
  var pushSuccessHandler = function (result) { 
    alert('pushResult = ' + result); 
  };

  var pushErrorHandler = function (error) { 
    alert('pushError = ' + error); 
  };

  var pushTokenHandler = function (result) { 
    alert('iOS device token = ' + result); 
    Meteor.user().setDevice(result);
  };

  var myself = {

    registerForNotifications:function () {

      var pushNotification = window.plugins.pushNotification;
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

var bleManager = function() {
  //the device package is useful because configuration of the bluetooth 
  //is different in android and in iod

  var addressKey = "beanAddress";

  var beanServiceUuid = "";
  var beanCharacteristicUuid = "";
  var clientCharacteristicConfigDescriptorUuid = "";
  var batteryServiceUuid = "180f";
  var batteryLevelCharacteristicUuid = "2a19";

  var beanScratchServiceUuid = "a495ff20-c5b1-4b44-b512-1370f02d74de";
  var beanScratchOneCharacteristicUuid = "a495ff21-c5b1-4b44-b512-1370f02d74de";

  var scanTimer = null;
  var connectTimer = null;
  var reconnectTimer = null;

  var iOSPlatform = "iOS";
  var androidPlatform = "Android"; 

  var error = function (error_message) {
    console.log(error_message.error + " : " + error_message.message);
  };

  var stopScanSuccess = function (successReturn) {
    if (successReturn.status === "scanStopped") {
      console.log("Scan was stopped successfully");
    } 
    else {
      alert("Unexpected stop scan status: " + successReturn.status);
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
    } 
    else if (successReturn.status === "disconnecting") {
     console.log("Temp disconnecting device");
    } 
    else {
      alert("Unexpected temp disconnect status: " + successReturn.status);
    }
  };

  var reconnect = function () {
    console.log("Reconnecting with 3 second timeout");
    bluetoothle.reconnect(reconnectSuccess, reconnectError);
    reconnectTimer = Meteor.setTimeout(reconnectTimeout, 3000);
  };

  var discoverSuccess = function (successReturn){
    if (successReturn === 'discovered'){
      console.log("discovery working");
      var params = {"serviceUuid":beanScratchServiceUuid, "characteristicUuid":beanScratchOneCharacteristicUuid, "isNotification": true};
      bluetoothle.subscribe(subscribeToScratchOneSuccess, reconnectError,params);
    }
  };

  var reconnectSuccess = function (successReturn) {
    if (successReturn.status === "connected") {
      console.log("Reconnected to : " + successReturn.name + " - " + successReturn.address);
      clearReconnectTimeout();
      if (device.platform === iOSPlatform) {
        console.log("Reconnected on IOS ! good to go for services");
        // var params = {"serviceUuids":batteryServiceUuid};
        // bluetoothle.services(beanBatteryService, error, params);
        var params ={};
        bluetoothle.services(beanService,error,params);
      }
      else if (device.platform === androidPlatform) {
        alert('lets go discover then little Android Friend !');
        bluetoothle.discover(discoverSuccess, error);
      }
    } 
    else if (successReturn.status === "connecting") {
      console.log("Reconnecting to : " + successReturn.name + " - " + successReturn.address);
    } 
    else {
      alert("Unexpected reconnect status: " + successReturn.status);
      disconnectDevice();
    }
  };

  var reconnectError = function (error_message) {
    error(error_message);
    disconnectDevice();
  };

  var reconnectTimeout = function() {
    alert("Reconnection timed out");
  };

  var clearReconnectTimeout = function() { 
    console.log("Clearing reconnect timeout");
    if (reconnectTimer !== null) {
      Meteor.clearTimeout(reconnectTimer);
    }
  };

  var suscribToBatterySuccess = function (successReturn) {
    if (successReturn.status === "subscribed") {
      alert("Suscribed to battery pop pop");
    }
    else if (successReturn.status === "subscribedResult") {
      alert("Battery suscribtion..." + successReturn.value);
      Template.topics_board.battery = value;
    }
  };

  var subscribeToScratchOneSuccess = function (successReturn) {
    if (successReturn.status === "subscribed") {
      alert("Subscribed to scratch one !");
    }
    else if (successReturn.status === "subscribedResult") {
      alert("scratch one subscrition..." + successReturn.value);
    }
  };

  var readSuccessCallback = function (successReturn) {
    alert("Reading");
    alert(JSON.stringify(successReturn));
  };

  var characteristicsBatterySuccess = function (successReturn) {
    if (successReturn.status == "discoveredCharacteristics"){
      alert("characteristics discovered..");
      var characteristicUuids = successReturn.characteristicUuids;
      alert(JSON.stringify(successReturn));
      for (var i = 0; i < characteristicUuids.length; i++){
        alert("Battery Characteristics found");
        var characteristicUuid = characteristicUuids[i];
        if (characteristicUuid === batteryLevelCharacteristicUuid) {
          alert("Battery level characteristic found, suscribing...");
          var params = {"serviceUuid":batteryServiceUuid, "characteristicUuid":batteryLevelCharacteristicUuid, "isNotification": true};
          // bluetoothle.subscribe(suscribToBatterySuccess,reconnectError,params);
          bluetoothle.read(readSuccessCallback, reconnectError, params);
        }
      }
    }
  };

  var characteristicsScratchOneSuccess = function (successReturn) {
    if (successReturn.status == "discoveredCharacteristics") {
      console.log("characteristics discovered");
      var characteristicUuids = successReturn.characteristicUuids;
      for (var i = 0; i < characteristicUuids.length; i++) {
        var characteristicUuid = characteristicUuids[i];
        if (characteristicUuid === beanScratchOneCharacteristicUuid) {
          console.log("bean scratch one characteristicUuid found, suscribing...");
          var params = {"serviceUuid":beanScratchServiceUuid, "characteristicUuid":beanScratchOneCharacteristicUuid, "isNotification": true};
          bluetoothle.subscribe(subscribeToScratchOneSuccess, reconnectError,params);
        }
      }
    }
  };

  var beanBatteryService = function (successReturn) {
    if (successReturn.status === 'discoveredServices') {
      var serviceUuids = successReturn.serviceUuids;
      for (var i = 0; i < serviceUuids.length; i++) {
        var serviceUuid = serviceUuids[i];
        if (serviceUuid === batteryServiceUuid) {
          console.log("Finding battery characteristics");
          var params = {"serviceUuid":batteryServiceUuid, "characteristicUuids":batteryLevelCharacteristicUuid};
          bluetoothle.characteristics(characteristicsBatterySuccess, reconnectError, params);
          return;
        }
      }
      alert("Error: battery service not found");
    }
    else {
      alert("Unexpected services battery: " + successReturn.status);
      disconnectDevice();      
    }
  };

  var beanService = function (successReturn) {
    if (successReturn.status === 'discoveredServices') {
      var serviceUuids = successReturn.serviceUuids;
      var found= false;
      for (var i = 0; i < serviceUuids.length; i++) {
        var serviceUuid = serviceUuids[i];
        console.log(serviceUuid);
        // if (serviceUuid === batteryServiceUuid) {
        //   alert("Finding battery characteristics");
        //   var params = {"serviceUuid":batteryServiceUuid, "characteristicUuids":batteryLevelCharacteristicUuid};
        //   bluetoothle.characteristics(characteristicsBatterySuccess, reconnectError, params);
        //   return;
        // }
        if (serviceUuid === beanScratchServiceUuid) {
          console.log("finding bean scratch service");
          found = true;
          var params = {"serviceUuid":beanScratchServiceUuid, "characteristicUuids":beanScratchOneCharacteristicUuid};
          bluetoothle.characteristics(characteristicsScratchOneSuccess, reconnectError, params);
        }
      }
      if(!found){
        alert("Bean not found...check if you are not already connected");
      }
    }
    else {
      alert("Unexpected services battery: " + successReturn.status);
      disconnectDevice();      
    }
  };

  var disconnectDevice = function() {
    bluetoothle.disconnect(disconnectSuccess, error);
  };

  var disconnectSuccess = function(successReturn) {
    if (successReturn.status === "disconnected") {
      console.log("Disconnect device");
      closeDevice();
    } 
    else if (successReturn.status === "disconnecting") {
      console.log("Disconnecting device");
    } 
    else {
      alert("Unexpected disconnect status: " + successReturn.status);
    }
  };

  var closeDevice = function() {
    bluetoothle.close(closeSuccess, error);
  };

  var closeSuccess = function(successReturn) {
    if (successReturn.status === "closed") {
      alert("Closed device");
    } 
    else {
      alert("Unexpected close status: " + successReturn.status);
    }
  };

  var closeError = function(successReturn) {
    alert("Close error: " + obj.error + " - " + obj.message);
  };

  var connectError = function (error_message) {
    alert("Connect error: " + obj.error + " - " + obj.message);
    clearConnectTimeout();
  };

  var connectSuccess = function(successReturn) {
    if (successReturn.status === "connected") {
      console.log("Connected to : " + successReturn.name + " - " + successReturn.address);
      clearConnectTimeout();
      tempDisconnectDevice();
    } 
    else if (successReturn.status === "connecting") {
      console.log("Connecting to : " + successReturn.name + " - " + successReturn.address);
    } 
    else {
      alert("Unexpected connect status: " + successReturn.status);
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
        alert("Bean "+ successReturn.address + " detected. Stopping scan");
        bluetoothle.stopScan(stopScanSuccess, error);
        clearScanTimeout();
        window.localStorage.setItem(addressKey, successReturn.address);
        connectDevice(successReturn.address);
      }
    }
    else {
      alert("Unexpected status: " + successReturn.status);
    }
  };

  var initializeSuccessCallback = function (successReturn) {
    if (successReturn.status === 'enabled') {
      var address = window.localStorage.getItem(addressKey);
      if (address === null){
        alert("Bluetooth init success");
        var params = {"serviceUuids": beanServiceUuid};
        bluetoothle.startScan(startScanSuccessCallback, error, {'serviceUuids':[]});
      }
      else {
        connectDevice(address);
      }
    }
    else {
      alert("Unexpected initialize status: " + successReturn.status);
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
    alert("is cordova 4");
    Meteor.setTimeout(bleManager.setup,1000);

    Tracker.autorun(function(){ 
      if(Meteor.user()){
        console.log("USERRR");
        pushStuff.registerForNotifications();
      }
    });
  }
});
