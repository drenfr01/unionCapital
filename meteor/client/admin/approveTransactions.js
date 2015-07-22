Template.approveTransactions.rendered = function() {
  Session.setDefault('selectedPartnerOrg', 'admin_only');
};

Template.approveTransactions.helpers({

  // Returns only the points approvals that are assigned to this role
  'pendingTransaction': function() {

    // Build the selector starting with this
    var selector = { approved: false, deleteInd: false };

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
      selector.partnerOrg = Meteor.user().profile.partnerOrg;
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
  ucbButtonEvent: function() {
    var buttonEvent = Events.findOne({ name: AppConfig.ucbButtonEvent })._id;
    if (this.eventId === buttonEvent) {
      return 'Y';
    } else {
      return 'N';
    }
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

    Meteor.call('approveTransaction', transactionId, points, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage('Event submission approved');
      }
    });
  },

  'change #superAdminFilter': function(event) {
    Session.set('selectedPartnerOrg', $(event.target).val());
  }
});
