//Topics - {user_id: string
//          name:string,
//          type:private or public
//          description:string, 
//          score:integer}
Topics = new Mongo.Collection("topics");
Topic = Model(Topics);

Topic.extend({
  uname: function() {
    var user = Meteor.users.findOne({_id: this.user_id});
    return user.uname();
  },
  appleUserDeviceTokens: function () {
    var user_device_tokens = [];
    var logs = Logs.find({topic_id: this._id});
    logs.forEach(function(log){
      var user = Users.findOne(log.user_id);
      if (user.profile){
        if (typeof user.profile.device_token !== 'undefined' && typeof user.profile.device_type !== 'undefined'){
          if (user.profile.device_type === 'iOS' ){
            user_device_tokens = _.union(user_device_tokens,[user.profile.device_token]);
          }
        }
      }  
    });

    return user_device_tokens;
  },
  androidUserDeviceTokens: function () {
    var user_device_tokens = [];
    var logs = Logs.find({topic_id: this._id});
    logs.forEach(function(log){
      var user = Users.findOne(log.user_id);
      if (user.profile){
        if (typeof user.profile.device_token !== 'undefined' && typeof user.profile.device_type !== 'undefined'){
          if (user.profile.device_type === 'android' ){
            user_device_tokens = _.union(user_device_tokens,[user.profile.device_token]);
          }
        }
      }  
    });

    return user_device_tokens;    
  },
  addACount: function (user_id){
     //We update the score count
    var my_score = Logs.find({user_id: user_id, topic_id: this._id, type: 'count'}).count() +1;
    //On click on plus, we insert a new log in the db
    var timestamp = (new Date()).getTime();
    Logs.insert({
      topic_id: this._id,
      user_id: user_id,
      type: 'count',
      timestamp: timestamp,
      score: my_score
    });

    //We update the score count
    var score = Logs.find({topic_id: this._id, type: 'count'}).count();
    Topics.update(this._id, {$set: {score: score}});    
  }
});