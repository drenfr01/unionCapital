var selector = { approved: false, deleteInd: false };

Template.approveTransactions.rendered = function() {
  Session.setDefault('selectedPartnerOrg', 'admin_only');
  var self = this;

  self.autorun(function() {
    if(self.subscriptionsReady()) {
      var listTransactions = {};
      Transactions.find().forEach(function(trans) {
        //all UCB events can be approved, selfie events need points
        var canApprove = !GlobalHelpers.isSelfieEvent(trans);
        listTransactions[trans._id] = {canApprove: canApprove};
      });
      self.transactionInstances.set(listTransactions);
    }   
  });
};

Template.approveTransactions.onCreated(function() {
  this.subscribe('transactions', {approved: false});
  this.subscribe('partnerOrganizations');
  this.transactionInstances = new ReactiveVar({});

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

  'descriptionModalData': function() {
    return Session.get('descriptionModalContext'); 
  },

  'imageUrl': function(imageId) {
    if(Images.findOne(imageId)) {
      return Images.findOne(imageId).url();
    }
  },

  'getPoints': function() {
    return GlobalHelpers.eventPoints(this);
  },

  isAdmin: function() {
    return Roles.userIsInRole(Meteor.userId(), 'admin');
  },
  
  transactionDescription: function() {
    return this.event.description.substr(0,50);
  },

  isDisabled: function() {
    return GlobalHelpers.isSelfieEvent(this) ? "" : "disabled";
  },

  isCheckboxDisabled: function() {
    return Template.instance().transactionInstances.get()[this._id].canApprove ? 
        "" : "disabled";
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
        sAlert.error(error.reason);
      } else {
        sAlert.success('Rejected event'); 
      }
    });
  },

  'click .eventName': function(e) {
    Session.set('descriptionModalContext', this); 
  },

  'click #sendApproval': function(e) {
    //for each checked checkbox, send approvals
    //note: checkbox can only be checked if valid
    //number entered and we check server side as well
    $('input[type="checkbox"]:checked').each(function() {
      if($(this).attr('id') !== 'checkAll') {
        let transactionId = $(this).attr('class');
        let points = parseInt($(".pointInput." + transactionId).val());
        Meteor.call('approveTransaction', transactionId, points, function(error) {
          if(error) {
            sAlert.error(error.reason);
          } else {
            console.log('approving!');
            sAlert.success('Event submission approved');
          }
        });
      }
    });
    $('#checkAll').prop('checked', false);
  },

  'change #superAdminFilter': function(event) {
    Session.set('selectedPartnerOrg', $(event.target).val());
    $('#checkAll').prop('checked', false);
  },

  'click .close': function(e) {
    Session.set('modalDataContext');
    $('#showImageModal').modal('hide');
    $('.body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  },

  'change .pointInput': _.debounce(function(e, template) {
    var points = parseInt($(e.target).val());
    //annoyingly NaN is a number, but it's not a
    //finite number
    if(_.isFinite(points)) {
      let reactiveDict = template.transactionInstances.get();
      reactiveDict[this._id].canApprove = true;
      template.transactionInstances.set(reactiveDict);
    } else {
      let reactiveDict = template.transactionInstances.get();
      reactiveDict[this._id].canApprove = false;
      template.transactionInstances.set(reactiveDict);
      sAlert.error('You must enter a valid, positive number');
    }
  }, 100),

  'click #checkAll': function(e) {
    //if checkbox is checked, check all non-disabled checkboxes on page
    if($(e.target).is(':checked')) {
      $('input[type="checkbox"]:enabled').prop('checked', true);
    } else {
      $('input[type="checkbox"]:enabled').prop('checked', false);
    }
  },

});
