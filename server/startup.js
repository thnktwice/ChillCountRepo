
Meteor.startup(function () {

//If database empty fill with samples
  if (Topics.find().count() === 0) {
    var data = [{
      name: "I am bored",
      counts: [
        [],
        [],
        []
      ]
    },
    {
      name: "Squirrel !",
      counts: [
        [],
        [],
        [],
        []
      ]
    }];

    var timestamp = (new Date()).getTime();

    for (var i = 0; i < data.length; i++) {
      //We create the topic and keep the id
      var topic_id = Topics.insert({
        name: data[i].name,
        score: 0
      });
      //We attach the related counts
      for (var j= 0; j < data[i].counts.length; j++){
        Counts.insert({
          topic_id: topic_id,
          timestamp: timestamp
        });
      }
      //We update the score count
      var score = Counts.find({topic_id: topic_id}).count();
      Topics.update(topic_id, {$set: {score: score}});
    }

  }
});