Template.topic.helpers({
  selected: function() {
    return Session.equals("selected_topic_id", this._id) ? "selected" : '';    
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
    if(Session.equals("selected_topic_id",this._id)){
      Session.set("selected_topic_id","");
    }else{
      Session.set("selected_topic_id", this._id);
    }
  }
});