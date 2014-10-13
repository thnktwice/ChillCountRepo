Template.topic.selected = function () {
  return Session.equals("selected_topic_id", this._id) ? "selected" : '';
};

Template.topic.helpers({
  currentUserIsAdmin: function() {
    if (Meteor.user()) {
      return Meteor.user().isAdmin();      
    }
    else {
      return false;
    }
  },
  beanIsConnected: function (){
    return Session.equals('bluetooth_status','bean_connected');
  }
});

Template.topic.events({
  'click .plus': function () {
    this.addACount(Meteor.userId());
  },  
  'click .go': function () {
    Router.go("/topics/"+this._id);
  },
  'click .link_icon': function (){
    Session.set("selected_topic_id", this._id);
  }
});