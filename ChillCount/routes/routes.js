
//We route the pages
Router.map(function() {

  this.route('login',{
    layoutTemplate: 'layout'
  });

  this.route('topicCreation',{
    layoutTemplate: 'layout'
  });
  //This will render the topics board template
  this.route('topicsBoard', {
    path: '/',
    layoutTemplate: 'layout',
    onBeforeAction: function () {
      //We "prefilter" if the user is logging in order to redirect to the good page
      if (Meteor.user() === null){
        if(!Meteor.loggingIn()){
          Router.go('login');
        }
      }
      this.next();
    },
    data: function(){
      var topics_board_data;
      if (Meteor.user() && Meteor.user().isAdmin()){
        topics_board_data = {
          topics: Topics.find({}, {sort: {score: -1, name: 1}})
        };
      }
      else{
        topics_board_data = {
          topics: Topics.find({$or: [{user_id: Meteor.userId()}, {type: 'public'}]}, {sort: {score: -1, name: 1}})
        };
      }
      return topics_board_data;
    }
  });

  //this will render the topic timeline, with the relevant data
  this.route('topicTimeline', {
    path:'/topics/:id',
    layoutTemplate: 'layout',
    notFoundTemplate: 'page_not_found',
    //Returns the relevant data to the template
    //It will then understand what it is about
    data: function() {

      var timeline_data;
      var topic = Topics.findOne(this.params.id);
      if(typeof topic !== 'undefined') {
        timeline_data = {
          topic_id: this.params.id,
          name: topic.name,
          logs: Logs.find({topic_id: this.params.id}, {sort: {timestamp: -1}}),
          score: topic.score,
          description: topic.description
        };      
      }
      return timeline_data;
    }
  });
});