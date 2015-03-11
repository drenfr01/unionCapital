AutoForm.hooks({
  insertPartnerOrgForm: {
    before: {
      insert: function(doc, template) {
        doc.deleteInd = false;
        return doc;
      } 
    }
  }
});

Template.addPartnerOrg.helpers({
  sectors: function() {
    return PartnerOrgSectors.find().map(function(sector) {
      return {label: sector.name, value: sector.name};
    });
  }
});

Template.addPartnerOrg.events({
  'click #submit': function(e) {
    Router.go('partnerOrgs');
  }
});
