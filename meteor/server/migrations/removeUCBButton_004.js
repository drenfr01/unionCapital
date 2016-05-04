deleteUCBButtons = function() {
  Events.remove({name: AppConfig.ucbButtonEvent})
  Transactions.update({}, {$unset: {hasUCBButton: ""}}, {multi: true});
  Transactions.find({'event.name': AppConfig.ucbButtonEvent}).forEach(
    function(trans){
    //TODO: need to find transaction it's linked to...via event?
    //use imageId?, ignore events that don't have an imageId
    var transToUpdate = Transactions.findOne({imageId: trans.imageId});
      console.log(Transactions.update({_id: transToUpdate._id, 
      imageId: {$exists: true}}, 
      {$push: {addons: {name: "UCB Button", points: 50 }}}));
  });
  Transactions.remove({'event.name': AppConfig.ucbButtonEvent});
};

var backwards = function() {
  console.log("This is a database update with no real rollback possibility. Be afraid, be very afraid.");
}

Migrations.add({
  version: 4,
  name: 'Move UCB button flags to addons and delete all UCB button events',
  up: deleteUCBButtons,
  down: backwards,
});

