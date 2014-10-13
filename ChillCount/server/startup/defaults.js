Meteor.startup(function () {

  Accounts.onCreateUser(function(options, user) {
    // We're enforcing at least an empty profile object to avoid needing to check
    // for its existence later.
    user.profile = options.profile ? options.profile : {};
    user.profile.username = user.emails[0].address.split("@",1)[0];
    console.log(user);
    return user;
  });

});