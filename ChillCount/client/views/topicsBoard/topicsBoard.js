Template.topicsBoard.events({
  'click #add_topic' : function(e){
    // we prevent the form to relaod the page
    e.preventDefault();
    Router.go('topicCreation');
  }
});

//Useful logging of the template data
Template.topicsBoard.helpers({
  debug: function () {
    console.log(this);
  },
  beanIsConnected: function (){
    return Session.equals('bluetooth_status','bean_connected');
  }
});