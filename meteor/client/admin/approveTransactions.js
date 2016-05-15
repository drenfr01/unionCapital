var selector = { approved: false, deleteInd: false };

Template.approveTransactions.rendered = function() {
  Session.setDefault('selectedPartnerOrg', 'admin_only');
};

Template.approveTransactions.onCreated(function() {
  this.subscribe('transactions', {approved: false});
  this.subscribe('partnerOrganizations');

    var self = this;
    self.autorun(function() {
      var dataContext = Session.get('modalDataContext') || {userId: ""};
      self.subscribe('singleImage', dataContext.userId);
    });
});

Template.approveTransactions.helpers({

  // Returns only the points approvals that are assigned to this role
  'pendingTransaction': function() {

    //reset the selector
    selector = { approved: false, deleteInd: false }

    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {

      // Set the appropriate role and partner org
      // If there is no filtering, it does not add the kv pair
      if (Session.equals('selectedPartnerOrg', 'super_admin_only')) {
        selector.approvalType = 'super_admin';
      } else if (Session.equals('selectedPartnerOrg', 'all')) {
        selector.approvalType = 'partner_admin';
      } else {
        selector.approvalType = 'partner_admin';
        selector.partnerOrg = Session.get('selectedPartnerOrg');
      }

    } else if (Roles.userIsInRole(Meteor.userId(), 'partnerAdmin')) {
      // Uses the partner admin's org to filter if not superadmin
      selector.approvalType = 'partner_admin';
      selector.partnerOrg = Meteor.user().primaryPartnerOrg();
    }

    return Transactions.find(selector);
  },
  eventDate: function() {
    return this.event.eventDate;
  },
  partnerOrgs: function() {
    return PartnerOrgs.find();
  },

  'modalData': function() {
    return Session.get('modalDataContext');
  },

  'approvalModalData': function() {
    return Session.get('approvalModalDataContext');
  },

  'imageUrl': function(imageId) {
    if(Images.findOne(imageId)) {
      return Images.findOne(imageId).url();
    }
  },

  'getPoints': function(eventId) {
    var event = this.event;
    if(event.isPointsPerHour) {
      return event.pointsPerHour * this.hoursSpent;
    } else {
      return event.points;
    }
  },

  isAdmin: function() {
    return Roles.userIsInRole(Meteor.userId(), 'admin');
  },
  
  transactionDescription: function() {
    return this.event.description.substr(0,50);
  }
});

Template.approveTransactions.events({

  'click .showImage': function(e) {
    Session.set('modalDataContext', this);
  },

  'click .rejectEvent': function(e) {
    e.preventDefault();

    var attributes = {
      imageId: this.imageId,
      transactionId: this._id
    };

    Meteor.call('rejectTransaction', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      }
      Router.go('approveTransactions');
    });
  },

  'click .approveEvent': function(e) {
    Session.set('approvalModalDataContext', this);
  },

  'click #sendApproval': function(e) {
    var points = parseInt($("#pointsInput").val());

    if(_.isNaN(points) || _.isNull(points)) {
        addErrorMessage("Please enter points into the box");
    } else {
      Meteor.call('approveTransaction', this._id, points, function(error) {
        if(error) {
          addErrorMessage(error.reason);
        } else {
          addSuccessMessage('Event submission approved');
        }
      });
    }
  },

  'change #superAdminFilter': function(event) {
    Session.set('selectedPartnerOrg', $(event.target).val());
  },

  'click .close': function(e) {
    Session.set('modalDataContext');
    $('#showImageModal').modal('hide');
    $('.body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
});
