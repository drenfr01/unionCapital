/*
 * Type of events
 * Number of transactions per week
 * Number of users per week
*/

Template.visuals.rendered = function() {

  //Width and height
  var w = 1200;
  var h = 500;
  var barPadding = 10;

  var eventsData = Events.find({adHoc: false}, {fields: {category: 1}}).fetch();
  var grouped = _.groupBy(eventsData, function(event) {
    return event.category;
  });
    
  var dataset =  _.map(grouped, function(value, key, list) {
    return [key, value.length];
  });
  
  var xScale = d3.scale.ordinal()
  .domain(dataset.map(function(d) { return d[0]; }))
  .rangeRoundBands([0, w], 0.2);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
    .range([0, h]);
                
  //TODO: make this a column chart, have text go right along side it (i.e. text
  //read normally)

  //Create SVG element
  var svg = d3.select("#transactions")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return xScale(d[0]);
  })
  .attr("y", function(d) {
    return h - yScale(d[1]);
  })
  .attr("width", function(d) {
    return xScale.rangeBand();
  })
  .attr("height", function(d) {
    return yScale(d[1]);
  })
  .attr("fill", function(d) {
    return "rgb(0, 0, " + (d[1] * 10) + ")";
  });

  svg.selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text(function(d) {
    return d[0];
  })
  .attr("text-anchor", "middle")
  .attr("x", function(d, i) {
    return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
  })
  .attr("y", function(d) {
    return h - yScale(d[1]);
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "white");

};
