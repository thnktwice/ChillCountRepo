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