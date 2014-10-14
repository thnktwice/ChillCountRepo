Template.topicStats.helpers({
  moreIsSelected: function(){
    if(this.goal) {
      return (this.goal.comparator === 'moreThan' ? 'selected' : '' );
    }
    return '';
  },
  lessIsSelected: function(){
    if(this.goal) {
      return (this.goal.comparator === 'lessThan' ? 'selected' : '' );
    }
    return '';
  }
});

Template.topicStats.events({
  'change #goal_comparator': function(event,templ){
    var value = templ.$('#goal_comparator').val();
    if (value === 'more'){
      this.goal.update({'comparator':'moreThan'});
    } else{
      this.goal.update({'comparator':'lessThan'});
    }
  },
  'change #goal_value': function(event,templ){
    var value = templ.$('#goal_value').val();
    this.goal.update({'value':value});
  }
});