//We define our DBs
//Topics - {user_id: string
//          name:string, 
//          score:integer}
Topics = new Mongo.Collection("topics");
// Counts -- {topic_id: string,
//            user_id: string,
//            timestamp: number}
Counts = new Mongo.Collection("counts");
CountsModel = Model(Counts);

//Use a package library stupid models
CountsModel.extend({
 uname: function() {
  var user = Meteor.users.findOne({_id: this.user_id});
  var first_name = user.profile.name.split(' ')[0];
  var last_name_initial = Meteor.user().profile.name.split(' ').slice(-1).join(' ').charAt(0);
  return first_name +" "+ last_name_initial;
 }
});

//Messages -- {topic_id: string
//             user_id: string
//             message: string
//             timestamp: number}
Messages = new Mongo.Collection("messages");

//We route the pages
Router.map(function() {

  this.route('login');

  this.route('topic_creation');
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
        topics: Topics.find({$or: [{user_id: Meteor.userId()}, {type: 'public'}]}, {sort: {score: -1, name: 1}})
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