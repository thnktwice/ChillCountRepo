//We route the pages
Router.map(function() {
  this.route('topics_board', {path: '/'});
  this.route('topic_timeline');
});





//Client side scripts
Topics = new Mongo.Collection("topics");

// ID of currently selected topic
Session.setDefault('selected_topic_id', null);

Template.topics_board.topics = function () {
  return Topics.find({}, {sort: {score: -1, name: 1}});
};

Template.topic.selected = function () {
  return Session.equals("selected_topic_id", this._id) ? "selected" : '';
};

Template.topic.events({
  'click button.plus': function () {
    Topics.update(this._id, {$inc: {score: 1}});
  },  
  'click button.go': function () {
    Session.set("selected_topic_id", this._id);
    Topics.update(this._id, {$inc: {score: 1}});
    Router.go("topic_timeline");
  }
});

Template.topics_board.events({
  'click button#add_topic' : function(){
    var input = Template.instance().$("input");
    Topics.insert({name: input.val(), score: 0});
    input.val('');
  }
});

Template.topic_timeline.events({
  'click button#back' : function(){
    Router.go("topics_board");
  }
});
