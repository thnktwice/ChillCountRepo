//Client side scripts
//

// Set ID of currently selected topic to null at the beginning
Session.setDefault('selected_topic_id', null);



Template.topics_board.events({
  'click button#add_topic' : function(){
    //We create a new topic in the db
    var input = Template.instance().$("input");
    Topics.insert({name: input.val(), score: 0});
    input.val('');
  }
});

// Template.topics_board.battery = function () {

// };

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

//Useful logging of the template data
Template.topic_timeline.helpers({
  log: function () {
    console.log(this);
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
