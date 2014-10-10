Template.topicTimeline.events({
  'click #back' : function(){
    Router.go("topicsBoard");
  },
  'click button#new_message' : function(e, templ) {
    //We stop the event from propagating
    e.preventDefault();
    //We take the value from the input
    var message = templ.$("#message_content");
    //We create the relevant new topic in the database
    //On click on plus, we insert a new log in the db
    var timestamp = (new Date()).getTime();

    var my_score = Logs.find({user_id: Meteor.userId(), topic_id: this.topic_id, type: 'count'}).count();

    var res = {
      topic_id: this.topic_id,
      user_id: Meteor.userId(),
      type: 'message',
      timestamp: timestamp,
      content: message.val(),
      score: my_score
    };
    if (Meteor.user().isAdmin() && res.content.charAt(0) === '&') {
      res.type = 'adminMessage';
      res.content= res.content.slice(1);

      //send notifications to the ids registerd by the server on this topic
      Meteor.call('sendNotificationsToTopicUsers', [this.topic_id,res.content], function(topic_id,content){});
    }
    Logs.insert(res);
    console.log(res);
    message.val('');
  },
  'click .plus' : function() {
    Topics.findOne(this.topic_id).addACount(Meteor.userId());
  }
});

Template.topicTimeline.helpers({
  debug: function () {
    console.log(this);
  },
  my_score: function(){
    var my_score = Logs.find({user_id: Meteor.userId(), topic_id: this.topic_id, type: 'count'}).count();
    return my_score;
  }
});

Template.log.events({
  'click .delete' : function(e,templ) {
    this.remove();
  }
});

Template.count.isMine = function () {
  return (this.user_id === Meteor.userId()) ;
};

Template.message.isMine = function () {
  return (this.user_id === Meteor.userId()) ;
};

