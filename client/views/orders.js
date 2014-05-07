Template.orders.rendered = function() {
  Session.set('expandedOrderIds', {});
};

Template.orders.events({
  'click #reviewOrder': function(e) {
    e.preventDefault();
    targetEmail = $('#targetEmail').val();
    
    //Note: this depends on below event adding the success class
    //to a table row
    if($('.success').length && targetEmail) {
      toBeOrderedArray = [];
      $('.success').each(function(){
        var input = $(this);
        orderId = input.attr('id');
        toBeOrderedArray.push(orderId);
      });

      attributes = {
        targetEmail: targetEmail,
        toBeOrderedArray: toBeOrderedArray,
        fromEmail: 'tyler.sheffels@gmail.com',
        customerId: Session.get('currentCustomer')
      };

      Meteor.call('buildEmailForReview', attributes,
        function(error, emailId) {
          if(error) {
            throwError(error.reason, "alert-danger");
            Router.go('order');
          }
          Session.set('emailId', emailId);
          Router.go('review');
          throwError("Review this order", "alert-success");

      });
    } else {
      throwError("Please select an order and fill in an email address!", 
          "alert-danger");
    }
  },

  'click .orderRow.default': function(e) {
    e.preventDefault();
    var current = e.currentTarget.id;
    $("#" + current).addClass('success').removeClass('default');
  },

  'click .orderRow.success': function(e) {
    e.preventDefault();
    var current = e.currentTarget.id;
    $("#" + current).removeClass('success').addClass('default');
  },
  'click .expand': function(e) {
    e.preventDefault();

    orderIds = Session.get('expandedOrderIds');
    orderId = this._id;
    //Using an object here to mimic a set, don't want
    //multiple clicks to add duplicate orderIds. 
    if(orderId in orderIds) {
      delete orderIds[orderId];
    } else { 
      orderIds[orderId] = true;
    }
    Session.set('expandedOrderIds', orderIds);
  }

});
Template.orders.activeOrder = function() {
  var ret = Session.get('currentCustomer') ? Orders.find({customerId: Session.get('currentCustomer')}) : Orders.find();

  return ret
};

Template.orders.helpers({
  isOrdered: function(orderId) {
    orderIds = Session.get('expandedOrderIds');
    if(!_.isUndefined(orderIds) && orderId in orderIds) {
      return true;
    }
    return false;
  },
  getMeasurements: function(orderId) {
    var html = "<table class='table table-hover'><tr class='info'><th>Measurement</th><th>Value</th></tr>";
    var order = Orders.findOne(orderId);
    _.each(order.measurements, function(value, key) {
      html += '<tr><td>' + key + '</td><td>' + value + 
      '</td></tr>';
    });
    html += '</table>';
    return html;
  },
  getStyleChoices: function(orderId) {
    var html = "<table class='table table-hover'><tr class='info'><th>Style Category</th><th>Option</th></tr>";
    var order = Orders.findOne(orderId);
    _.each(order.styleChoices, function(value, key) {
      html += '<tr><td>' + key + '</td><td>' + value + 
      '</td></tr>';
    });
    html += '</table>';
    return html;
   }
});
