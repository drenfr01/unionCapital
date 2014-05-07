Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('landing', {path: '/'});
  this.route('pending', {path: '/*'});
});

var requireCustomer = function() {
  if(_.isUndefined(Session.get("currentCustomer"))) {
    Router.go('landing');
    throwError("You must select a customer", "alert-danger");
  }
};


//Router.onBeforeAction(requireCustomer,{except: 
// ['landing','uploadStyles']} );

//This can be used to reset session variables that are really page variables
Router.onBeforeAction(function() {
});
