Accounts.onCreateUser(function (options, user) {
  user.deleteInd = false
  //Setting profile is necessary here even though meteor claims that createUser should insert it
  user.profile = options.profile
  return user
})
