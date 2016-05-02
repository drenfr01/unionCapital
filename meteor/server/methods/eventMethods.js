Meteor.methods({
  postComment: function(event, comment) {
    check(event, Object);
    check(comment, String);
    
    const commentObject = {
      comment: comment,
      userId: this.userId,
      date: Date.now(),
      eventId: event._id,
      eventName: event.name,
      eventInstitution: event.institution

    };

    const commentId = Comments.insert(commentObject);
    Events.update(event._id, {$push: {comments: commentId} });

  },

  postRating: function(event, rating) {
    check(event, Object);
    check(rating, Number);

    const ratingObject = {
      rating: rating,
      userId: this.userId,
      date: Date.now(),
      eventId: event._id,
      eventName: event.name,
      eventInstitution: event.institution
    };

    const ratingId = Ratings.insert(ratingObject);
    Events.update(event._id, {$push: {ratings: ratingId} });
  }
});
