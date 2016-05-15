changeMultipleOrgs = function() {
  Meteor.users.find().forEach(function(user){
    if(user.profile.partnerOrg) {
      var partnerOrg = user.profile.partnerOrg;
      var partnerOrgArray = [];
      partnerOrgArray.push(partnerOrg);
      Meteor.users.update({_id: user._id}, 
                          {$set: {'profile.partnerOrg': partnerOrgArray}});
    } 
  });
}
