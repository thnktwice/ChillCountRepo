//We define our DBs
//Topics - {user_id: string
//          name:string, 
//          score:integer}
Topics = new Mongo.Collection("topics");
// Counts -- {topic_id: string,
//            user_id: string,
//            timestamp: number
//            type: string
//            content: string}
Logs = new Mongo.Collection("logs");
Log = Model(Logs);

//Use a package library stupid models
Log.extend({
 defaultValues: {
  type:'count',
  content:''
 },
 uname: function() {
  var user = Meteor.users.findOne({_id: this.user_id});
  var first_name = user.profile.name.split(' ')[0];
  var last_name_initial = Meteor.user().profile.name.split(' ').slice(-1).join(' ').charAt(0);
  return first_name +" "+ last_name_initial;
 },
 isMessage: function() {
  var res = (this.type === 'message');
  return res;
 },
 isCount: function() {
  var res = (this.type === 'count');
  return res;  
 }
});

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
        topic_id: this.params.id,
        name: Topics.findOne(this.params.id).name,
        logs: Logs.find({topic_id: this.params.id}),
      };
      return timeline_data;
    }
  });
});