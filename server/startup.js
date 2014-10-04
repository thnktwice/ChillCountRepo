
Meteor.startup(function () {

  Accounts.onCreateUser(function(options, user) {
    // We're enforcing at least an empty profile object to avoid needing to check
    // for its existence later.
    user.profile = options.profile ? options.profile : {};
    user.profile.username = user.emails[0].address.split("@",1)[0];
    console.log(user);
    return user;
  });

  //iOS
  //Enable push notification by adding the relevant package
  var apn = Meteor.npmRequire("apn");
  var path = Npm.require('path');
  var apnOptions = Meteor.settings.apnOptions || {};
  var alertSound = apnOptions.sound || "alert.aiff";
  var apnConnection;

  // default apn connection options
  // var cert = Assets.getText("cert.pem");
  var cert = Assets.getText("tiltProdCert.pem");
  var key = Assets.getText("key.pem");
  var ca = Assets.getText("entrust_2048_ca.cer");
  // console.log(cert);
  // console.log(key);
  apnOptions = _.extend(
    {
    cert: cert,
    key: key,
    ca: ca,
    passphrase: 'cristohoger24',
    production: true
    }, 
    apnOptions);
  // console.log(apnOptions);

  apnConnection = new apn.Connection(apnOptions);

  var sendAppleNotifications = function (topic_id, content) {
    console.log("sendAppleNotifications");
    var note = new apn.Notification();

    var topic = Topics.findOne(topic_id);
    var pushIds = topic.appleUserDeviceTokens();
    // expires 1 hour from now
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = alertSound;
    note.alert = "@"+topic.name+":" + content;
    note.payload = {'url': "/topics/"+topic_id};


    _.each(pushIds, function (token) {
      var device = new apn.Device(token);
      console.log("sending notification to +" + token );
      console.log(note);
      apnConnection.pushNotification(note, device);
    });

    return {success:'ok'};
  }; // end sendAppleNotifications



  var sendNotifications = function (topic_id, content) {
    sendAppleNotifications(topic_id,content);
  };


  var addACount = function(topic_id, user_id) {
    //We update the score count
    var my_score = Logs.find({user_id: user_id, topic_id: topic_id, type: 'count'}).count() +1;
    //On click on plus, we insert a new log in the db
    var timestamp = (new Date()).getTime();
    Logs.insert({
      topic_id: topic_id,
      user_id: user_id,
      type: 'count',
      timestamp: timestamp,
      score: my_score
    });

    //We update the score count
    var score = Logs.find({topic_id: topic_id, type: 'count'}).count();
    Topics.update(topic_id, {$set: {score: score}}); 
  };

  //Declare the methods on the server that can be accessed by the client
  Meteor.methods({
    sendNotificationsToTopicUsers: function(args) {
      sendNotifications(args[0],args[1]);
    },
    addARemoteCount: function(args){
      addACount(args[0],args[1]);
    }
  });
});