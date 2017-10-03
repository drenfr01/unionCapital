//given a datetime, returns a moment time adjusted for DST
var DSTCorrectedTime = function(datetime, duration) {
  var isDSTNow = moment().isDST();
  var newMoment = moment(datetime).add(duration, "hours");
  if(isDSTNow) {
    if(newMoment.isDST()) {
      return newMoment;
    } else {
      return newMoment.subtract(-1, "hours");
    }
  } else {
    if(newMoment.isDST()) {
      return newMoment.add(1, "hours");
    } else {
      return newMoment;
    }

  }
};


UI.registerHelper('formatDate', function(unformattedDate) {
    if(moment(unformattedDate).isValid()) {
      return DSTCorrectedTime(unformattedDate).format('MMMM DD h:mm A');
    } else {
      return "";
    }
});

UI.registerHelper('formatJustDate', function(unformattedDate) {
    if(moment(unformattedDate).isValid()) {
      return DSTCorrectedTime(unformattedDate).format('MMMM DD');
    } else {
      return "";
    }
});

UI.registerHelper('formatPrettyDate', function(unformattedDate) {
    if(moment(unformattedDate).isValid()) {
      return DSTCorrectedTime(unformattedDate).format('dddd, MMMM Do');
    } else {
      return "Invalid Date";
    }
});

UI.registerHelper('endTime', function(unformattedDate, duration) {
  
    var duration = duration || 0;
    var test = DSTCorrectedTime(unformattedDate, duration).format('h:mm A');
    return test;
});

UI.registerHelper('justTime', function(unformattedDate) {
    return DSTCorrectedTime(unformattedDate).format('h:mm A');
});

UI.registerHelper('formattedDateRange', function(startDate, duration) {
  var formattedStartDate = DSTCorrectedTime(startDate);
  var formattedEndDate = formattedStartDate.clone().add(duration, 'h');
  if (formattedStartDate.isSame(formattedEndDate), 'd')
    return formattedStartDate.format('MMMM Do h:mm A') + ' - ' + formattedEndDate.format('h:mm A');
  else
    return formattedStartDate.format('MMMM Do h:mm A') + ' - ' + formattedEndDate.format('MMMM Do h:mm A');
});

UI.registerHelper("eventOptions", function() {
  return _.chain(Events.find().fetch())
          .map(function(event){
            return { label: event.name, value: event._id };
          }).value();
});

//handlebars supports iterating over object keys, but
//Meteor currently does not. This gives Meteor this ability
UI.registerHelper("arrayify", function(obj) {
  result = [];
  for (var key in obj) {
    result.push({name: key, value: obj[key]});
  }
  return result;
});

// Returns a single date if both startdate and enddate are on the same day
UI.registerHelper('formatEventDate', function(unformattedStartDate, unformattedEndDate) {

  var startDate = moment(unformattedStartDate).isValid() ? moment(unformattedStartDate).format('M/D/YY hh:mm A') : '';
  var endDate = moment(unformattedEndDate).isValid() ? moment(unformattedEndDate).format('M/D/YY hh:mm A') : '';

  var finalDateString = startDate + endDate;

  // If both are not empty, then return a single day or a range
  // If at least one is empty, then it will return the concatenation of the two
  // which will be either an empty string or the single good day
  if (startDate && endDate) {
    if (moment(startDate).isSame(endDate, 'day'))
      finalDateString = startDate;
    else
      finalDateString = startDate + ' - ' + endDate;
  }
  return finalDateString;
});

Template.registerHelper('ifNotEmpty', function(item, options) {
  console.log(options);
	if(item){
		if(item instanceof Array){
			if(item.length > 0){
				return options.fn(this);
			}else{
				return options.inverse(this);
			}
		}else{
			if(item.fetch().length > 0){
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		}
	}else{
		return options.inverse(this);
	}
});

Template.registerHelper('formatNumber', function(number) {
  return number ? Number(number).toLocaleString() : 0;
});

Template.registerHelper('eventPoints', function() {
    const sum = R.compose(
        R.reduce((acc, value) => acc + value, 0),
        R.map(R.prop('points')),
        R.defaultTo([])
      )(this.addons);

    var event = this.event;
    if(event && event.isPointsPerHour) {
      return sum + Math.round(event.pointsPerHour * this.hoursSpent) || '?';
    } else if (event && event.points){
      return sum + event.points;
    } else {
      return 'TBD'; 
    }
});
