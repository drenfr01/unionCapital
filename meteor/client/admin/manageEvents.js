/* global R */
/* global EventCategories */
/* global GlobalHelpers */
/* global AppConfig */
/* global Events */
/* global Roles */

Session.set('category', null);
Session.set('superCategory', null);
Session.set('institution', null);
Session.set('eventTypeSelected', AppConfig.eventRange.current);
var searchText = new ReactiveVar(null);

function getSkipCount() {
  return (GlobalHelpers.currentPage() - 1) * AppConfig.public.recordsPerPage;
}

Template.manageEvents.onCreated(function() {
  const template = this;

  this.subscribe('eventCategories');
  this.subscribe('eventOrgs');
  this.subscribe('partnerOrganizations');
  this.subscribe('partnerOrgSectors');

  template.autorun(function() {
    template.subscribe(
      'manageEvents', 
      Session.get('eventTypeSelected'),
      Session.get('institution'),
      Session.get('category'),
      Session.get('superCategory'),
      searchText.get(),
      getSkipCount()
    );
  });
});

function isComment(feedbackItem) {
  return feedbackItem.feedbackType === AppConfig.feedbackType.comment;
}

function isRating(feedbackItem) {
  return feedbackItem.feedbackType === AppConfig.feedbackType.rating;
} 

function calculateAverageFromArray(list) {
  return R.converge(
    R.divide,
    [R.sum, R.length]
  )(list);
}

function getAverageRating(feedback) {
  return R.compose(
    calculateAverageFromArray,
    R.pluck('feedbackContent'),
    R.filter(isRating)
  )(feedback);
}

Template.manageEvents.helpers({
  superCategories: function() {
    const eventCategories = EventCategories.getSuperCategories(true);
    return R.compose(
      R.sortBy(R.identity),
      R.append('All'),
      R.pluck('name')
    )(eventCategories);
  },

  categories: function() {
    const superCategory = Session.get('superCategory');
    const eventCategories = (!superCategory || superCategory === 'All')
      ? EventCategories.getAllCategories(true)
      : EventCategories.getCategoriesForSuperCategory(superCategory);

    return R.compose(
      R.sortBy(R.prop('name')),
      R.append('All')
    )(eventCategories);
  },

  events: function() {
    return Events.find();
  },

  eventTypeSelected: function(eventType) {
    return Session.equals("eventTypeSelected", eventType);
  },

  numOfComments: function() {
    if(this.feedback) {
      return R.filter(isComment, this.feedback).length || 0;
    }
    return 0; 
  },

  avgRating: function() {
    if(this.feedback) {
      return getAverageRating(this.feedback);
    }
    return 'None' 
  },
});

Template.manageEvents.events({
  'change .radio-button': function(e) {
    Session.set('eventTypeSelected', e.target.value);
    $("#search-box").val("");
  },

  'change #institutions': function() {
    Session.set("institution", $("#institutions").val());
  },

  'change #supercategories': function() {
    Session.set('superCategory', $("#supercategories").val());
  },

  'change #categories': function() {
    Session.set("category", $("#categories").val());
  },

  'keyup #search-box': _.throttle(function(e) {
    var text = $(e.target).val().trim();
    if(text) {
      searchText.set(text);
    } else {
      searchText.set(null);
    }
  }, 200),

  'click .editEvent': function(e) {
    e.preventDefault();
    if(Roles.userIsInRole(Meteor.userId(), ['admin']) ||
       Meteor.user().profile.partnerOrg === this.institution) {
      Router.go('editEvent', {_id: this._id});
    } else {
      sAlert.error('Permission Denied: You do not own this event');
    }
  },

  'click .deleteEvent': function() {
    if(Roles.userIsInRole(Meteor.userId(), ['admin']) ||
       Meteor.user().profile.partnerOrg === this.institution) {
      Meteor.call('deleteEvent', this._id, function(error) {
        if(error) {
          sAlert.error(error.reason);
        }
      });
    } else {
      sAlert.error('Permission Denied: You do not own this event');
    }
  },

  'click #addEvent': function(e) {
    e.preventDefault();
    Router.go('addEvents');
  },

  'click #clearBtn': function() {
    searchText.set(null);
    $('#search-box').val('');
    $('#search-box').focus();
  },
});

