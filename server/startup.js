
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
  // console.log(cert);
  // console.log(key);
  apnOptions = _.extend(
    {
    cert: cert,
    key: key,
    passphrase: 'cristohoger24'
    }, 
    apnOptions);
  // console.log(apnOptions);

  apnConnection = new apn.Connection(apnOptions);

  var sendAppleNotifications = function (topic_id, content, url) {
    var note = new apn.Notification();
    // expires 1 hour from now
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = alertSound;
    note.alert = content;
    note.payload = {'url': url};

    var topic = Topics.findOne(topic_id);
    var pushIds = topic.userDeviceTokens();

    _.each(pushIds, function (token) {
      var device = new apn.Device(token);
      apnConnection.pushNotification(note, device);
    });

    return {success:'ok'};
  }; // end sendAppleNotifications

  //Declare the methods on the server that can be accessed by the client
  Meteor.methods({
    sendNotificationsToTopicUsers: function(args) {
      sendAppleNotifications(args[0],args[1],"heyhey");
    }
  });
});