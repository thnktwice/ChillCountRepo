//Client side scripts
//

// Set ID of currently selected topic to null at the beginning
Session.setDefault('selected_topic_id', null);

Accounts.ui.config({
  requestPermissions: {
    facebook: ['public_profile','user_friends', 'email']
  }
});

Template.topics_board.events({
  'click button#add_topic' : function(e){
    // we prevent the form to relaod the page
    e.preventDefault();
    Router.go('topic_creation');
  }
});

//This is one way of defining a helper
Template.topic.selected = function () {
  return Session.equals("selected_topic_id", this._id) ? "selected" : '';
};

Template.topic.events({
  'click button.plus': function () {
    //On click on plus, we insert a new log in the db
    var timestamp = (new Date()).getTime();
    Counts.insert({
      topic_id: this._id,
      user_id: Meteor.userId(),
      timestamp: timestamp
    });
    //We update the score count
    var score = Counts.find({topic_id: this._id}).count();
    Topics.update(this._id, {$set: {score: score}});
  },  
  'click button.go': function () {
    Session.set("selected_topic_id", this._id);
    Router.go("/topics/"+this._id);
  }
});

Template.topic_creation.events({
  'click button#new_topic' : function(e, templ) {
    //We stop the event from propagating
    e.preventDefault();
    //We take the value from the inputs
    var topic_name = templ.$("#topic_name").val();
    var topic_type = templ.$("input[type='radio'][name='topic_type']:checked").val();
    console.log(topic_name);
    console.log(topic_type);
    //We create the relevant new topic in the database
    Topics.insert({user_id: Meteor.userId(), name: topic_name, type:topic_type, score: 0});
    Router.go('/');
  },
  'click button#cancel_new_topic' : function() {
    Router.go('/');
  }
});

//Useful logging of the template data

Template.topics_board.helpers({
  log: function () {
    console.log(this);
  }
});
Template.topic_timeline.helpers({
  log: function () {
    console.log(this);
  }
});

Template.login.helpers({
  goHome: function(){
    Router.go('topics_board');
  }
});

Template.topic_timeline.events({
  'click button#back' : function(){
    Router.go("topics_board");
  }
});

//how to display the good timestamp
Template.count.helpers({
  formatted_time: function(timestamp){
    return new Date(this.timestamp).toLocaleDateString() + " " + new Date(this.timestamp).toLocaleTimeString();
  }
});

