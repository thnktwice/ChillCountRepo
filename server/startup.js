
Meteor.startup(function () {
  //Enable push notification by adding the relevant package
  var apn = Meteor.npmRequire("apn");
  var path = Npm.require('path');
  var apnOptions = Meteor.settings.apnOptions || {};
  var alertSound = apnOptions.sound || "alert.aiff";
  var apnConnection;

  // default apn connection options
  var cert = Assets.getText("cert.pem");
  var key = Assets.getText("key.pem");
  console.log(cert);
  console.log(key);
  apnOptions = _.extend(
    {
    cert: cert,
    key: key,
    passphrase: 'cristohoger24'
    }, 
    apnOptions);
  console.log(apnOptions);

  apnConnection = new apn.Connection(apnOptions);

  var sendAppleNotifications = function (alert, url, pushIds) {
    var note = new apn.Notification();
    // expires 1 hour from now
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = alertSound;
    note.alert = alert;
    note.payload = {'url': url};

    _.each(pushIds, function (token) {
      var device = new apn.Device(token);
      apnConnection.pushNotification(note, device);
    });

    return {success:'ok'};
  }; // end sendAppleNotifications

  //Declare the methods on the server that can be accessed by the client
  Meteor.methods({
    sendNotificationsToTopicUsers: function(topic_id, content) {
      sendAppleNotifications("blabla","heyhey",["7d203af3d633addf9c86d678aac44d7dac2574ba6378e526830341049e521451"]);
    }
  });
});