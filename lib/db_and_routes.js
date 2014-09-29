//We define the admins
var admins =["Mickaël Coenk"];


//We define our DBs
//Topics - {user_id: string
//          name:string, 
//          score:integer}
Topics = new Mongo.Collection("topics");
Topic = Model(Topics);

Topic.extend({
  uname: function() {
    var user = Meteor.users.findOne({_id: this.user_id});
    return user.uname();
  }
});
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
  return user.uname();
 },
 formatted_time: function () {
  return new Date(this.timestamp).toLocaleDateString() + " " + new Date(this.timestamp).toLocaleTimeString();
 },
 isMessage: function() {
  var res = (this.type === 'message');
  return res;
 },
 isCount: function() {
  var res = (this.type === 'count');
  return res;  
 },
 isAdminMessage: function() {
  // var res = ((typeof this.content !== 'undefined') && _.contains(admins,this.user_id) && (this.content.charAt(0)==='&'));
  var res = (this.type === 'adminMessage');
  return res;  
 }
});

Users = Meteor.users;
User = Model(Users);

User.extend({
  isAdmin: function() {
  var res = (_.contains(admins,this.profile.name));
  return res;      
  },
  uname: function() {
    var first_name = this.profile.name.split(' ')[0];
    var last_name_initial = this.profile.name.split(' ').slice(-1).join(' ').charAt(0);
    return first_name +" "+ last_name_initial;
  },
  setDevice: function(device_token) {
    if (this.profile.device_token !== device_token){
      Meteor.users.update({_id:this._id}, {$set:{"profile.device_token":device_token}});
      return true; 
    }
    else {
      return 'same token !';
    }
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
  this.route('topic_timeline', {
    path:'/topics/:id',
    notFoundTemplate: 'page_not_found',
    //Returns the relevant data to the template
    //It will then understand what it is about
    data: function() {
      var timeline_data;
      if(typeof Topics.findOne(this.params.id) !== 'undefined') {
        timeline_data = {
          topic_id: this.params.id,
          name: Topics.findOne(this.params.id).name,
          logs: Logs.find({topic_id: this.params.id}),
        };      
      }
      return timeline_data;
    }
  });
});