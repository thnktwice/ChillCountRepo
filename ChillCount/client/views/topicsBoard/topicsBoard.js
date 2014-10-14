Template.topicsBoard.events({
  'click #add_topic' : function(e){
    // we prevent the form to relaod the page
    e.preventDefault();
    Router.go('topicCreation');
  }
});