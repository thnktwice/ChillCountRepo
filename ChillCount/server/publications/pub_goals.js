// Publish complete set of goals to all clients.
Meteor.publish('goals', function () {
  return DailyGoals.find();
});