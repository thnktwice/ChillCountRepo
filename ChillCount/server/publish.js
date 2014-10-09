//Declare the database sharing server side

// Publish complete set of topics to all clients.
Meteor.publish('topics', function () {
  return Topics.find();
});

// Publish all counts for requested topic_id.
Meteor.publish('counts', function (topic_id) {
  // check if this of the right format. if not throw error.
  // See docs.
  check(topic_id, String);
  return Counts.find({topic_id: topic_id});
});
