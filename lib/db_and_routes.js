//We define our DBs
//Topics - {user_id: string
//          name:string, 
//          score:integer}
Topics = new Mongo.Collection("topics");
// Counts -- {topic_id: string,
//           timestamp: sumber}
Counts = new Mongo.Collection("counts");

//We route the pages
Router.map(function() {

  this.route('login');
  //This will render the topics board template
  this.route('topics_board', {
    path: '/',
    onBeforeAction: function () {
      //We "prefilter" if the user is logging in order to redirect to the good page
      if (Meteor.user() === null){
        if(!Meteor.loggingIn()){
          this.redirect('login');
        }
      }
    },
    data: function(){
      var topics_board_data = {
        topics: Topics.find({user_id: Meteor.userId()}, {sort: {score: -1, name: 1}})
      };
      return topics_board_data;
    }
  });

  //this will render the topic timeline, with the relevant data
  this.route('topic_timeline', {
    path:'/topics/:id',
    notFoundTemplate: 'page_not_found',
    //Returns the relevant data to the template
    //It will then understand what it is about
    data: function() {
      var timeline_data = {
        name: Topics.findOne(this.params.id).name,
        counts: Counts.find({topic_id: this.params.id}),
      };
      return timeline_data;
    }
  });
});