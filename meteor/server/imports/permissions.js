/* global Roles */

function userIsPartnerAdminForPartnerOrg(userId, partnerOrg) {
  check(userId, String);
  check(partnerOrg, String);

  const user = Meteor.users.findOne({ _id: userId });
  if (!user) {
    throw new Meteor.Error('INVALID_USERID');
  }

  return Roles.userIsInRole(userId, 'partnerAdmin') && user.profile.partnerOrg === partnerOrg;
}

export function userHasPermissionToAccessMemberDataForPartnerOrg(userId, partnerOrg) {
  check(userId, String);
  check(partnerOrg, String);
  return Roles.userIsInRole(userId, 'admin') || userIsPartnerAdminForPartnerOrg(userId, partnerOrg);
}
