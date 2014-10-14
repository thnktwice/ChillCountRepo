// Logs -- {topic_id: string,
//            user_id: string,
//            timestamp: number
//            type: string
//            content: string,
//            score: integer}
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
  var day = new Date(this.timestamp);
  var dayWrapper = moment(day);
  return dayWrapper.format("MMM Do, HH:mm");

  //.toLocaleDateString() + " " + new Date(this.timestamp).toLocaleTimeString();
 },
 formatted_day: function (){
  var day = new Date(this.timestamp);
  var dayWrapper = moment(day);
  return dayWrapper.format("MMM Do");
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

