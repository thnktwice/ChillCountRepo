
Meteor.startup(function () {
  //Enable push notification by adding the relevant package
  var apn = Meteor.npmRequire("apn");
  var path = Npm.require('path');
  var apnOptions = Meteor.settings.apnOptions || {};
  var alertSound = apnOptions.sound || "alert.aiff";
  var apnConnection;

  // default apn connection options
  apnOptions = _.extend(
    {
    cert: path.join("../", "private", "cert.pem"),
    key: path.join("../", "private", "key.pem")
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
});