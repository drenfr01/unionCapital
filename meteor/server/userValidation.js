Accounts.onCreateUser(function (options, user) {
  user.deleteInd = false
  user.profile = options.profile
  return user
})
