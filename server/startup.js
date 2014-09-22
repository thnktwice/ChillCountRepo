//If database empty fill with samples
Meteor.startup(function () {
  if (Topics.find().count() === 0) {
    var names = ["I am bored :(",
                 "I want to eat something"];
    for (var i = 0; i < names.length; i++)
      Topics.insert({name: names[i],
                      score: 0});
  }
});