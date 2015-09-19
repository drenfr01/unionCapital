/*
 * Type of events
 * Number of transactions per week
 * Number of users per week
*/

Template.visuals.rendered = function() {

  //Width and height
  var w = 1200;
  var h = 600;
  var barPadding = 10;
  var padding = 200;

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
    .domain([0, d3.max(dataset, function(d) { return d[1]; }) + 100])
    .range([h - padding, 0]);

  //axis
  var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(10);

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
    return yScale(d[1]);
  })
  .attr("width", function(d) {
    return xScale.rangeBand();
  })
  .attr("height", function(d) {
    return (yScale(0) - yScale(d[1]));
  })
  .attr("fill", function(d) {
    return "rgb(0, 0, " + (d[1] * 10) + ")";
  })
  .attr("transform", "translate(" + padding + ",0)")
  .on("mouseover", function(d) {
    d3.select(this)
    .attr("fill", "orange");
    //tool tip
    var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
    var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

    svg.append("text")
    .attr("id", "tooltip")
    .attr("x", xPosition)
    .attr("y", yPosition) 
    .attr("text-anchor", "top")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text(d[0] + "," + d[1]);
   })
  .on("mouseout", function(d) {
    d3.select("#tooltip").remove();
    d3.select(this)
    .transition()
    .duration(250)
    .attr("fill", "rgb(0, 0, " + (d[1]) + ")");
  })
  .on("click", function() {
    sortBars();
  });

  //Axis

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + padding + "," + (h - padding) + ")")
  .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-65)";
    });

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + padding + ",0)")
  .call(yAxis);
  
  //sorting
  var sortOrder = false;
  var sortBars = function() {
    sortOrder = !sortOrder;
    svg.selectAll("rect")
    .sort(function(a,b) {
      if(sortOrder) {
        return d3.ascending(a[1], b[1]);
      } else {
        return d3.descending(a[1], b[1]);
      }
    })
    .transition()
    .duration(100)
    .attr("x", function(d, i) {
      return xScale(i);
    });
  };
};
