//Client side scripts
Topics = new Mongo.Collection("topics");

// ID of currently selected topic
Session.setDefault('selected_topic_id', null);

Template.topicboard.topics = function () {
  return Topics.find({}, {sort: {score: -1, name: 1}});
};

Template.topic.selected = function () {
  return Session.equals("selected_topic_id", this._id) ? "selected" : '';
};

Template.topic.events({
  'click': function () {
    Session.set("selected_topic_id", this._id);
    Topics.update(this._id, {$inc: {score: 1}});
  }
});

Template.topicboard.events({
  'click button' : function(){
    var input = Template.instance().$("input");
    Topics.insert({name: input.val(), score: 0});
    input.val('');
  }
});
