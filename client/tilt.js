//Client side scripts
Topics = new Mongo.Collection("topics");

Template.topicboard.topics = function () {
  return Topics.find({}, {sort: {score: -1, name: 1}});
};

Template.topic.selected = function () {
  return Session.equals("selected_topic", this._id) ? "selected" : '';
};

Template.topic.events({
  'click': function () {
    Session.set("selected_topic", this._id);
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
