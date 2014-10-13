// Publish complete set of topics to all clients.
Meteor.publish('topics', function () {
  return Topics.find();
});