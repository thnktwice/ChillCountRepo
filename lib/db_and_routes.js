//We define our DBs
//Topics - {name:string, 
//          score:integer}
Topics = new Mongo.Collection("topics");
// Counts -- {topic_id: String,
//           timestamp: Number}
Counts = new Mongo.Collection("counts");

//We route the pages
Router.map(function() {
  //This will render the topics board template
  this.route('topics_board', {
    path: '/',
    data: function(){
      var topics_board_data = {
        topics: Topics.find({}, {sort: {score: -1, name: 1}})
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
        topic: Topics.findOne(this.params.id),
        counts: Counts.find({topic_id: this.params.id}),
      };
      return timeline_data;
    }
  });
});