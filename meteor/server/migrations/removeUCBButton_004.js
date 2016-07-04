deleteUCBButtons = function() {
  Events.remove({name: AppConfig.ucbButtonEvent})
  Transactions.update({}, {$unset: {hasUCBButton: ""}}, {multi: true});
  //find all UCB button transactions
  //use the imageId as the link between a UCB button transaction and the main one
  //update the main transaction to have UCB addon
  //delete all UCB button events
  Transactions.find({'event.name': AppConfig.ucbButtonEvent}).forEach(
    function(trans){
    //TODO: need to find transaction it's linked to...via event?
    //use imageId?, ignore events that don't have an imageId
    if(!R.isNil(trans.imageId)) {
      var transToUpdate = Transactions.findOne({
        'event.name': {$ne: AppConfig.ucbButtonEvent},
        imageId: trans.imageId});
      if(!R.isNil(transToUpdate)) {
        Transactions.update({_id: transToUpdate._id, 
                            imageId: {$exists: true}}, 
                            {$push: {addons: {name: "UCB Button", points: 50 }}});
      }
    }
  });
  Transactions.remove({'event.name': AppConfig.ucbButtonEvent, 
    imageId: {$exists: true}});
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

