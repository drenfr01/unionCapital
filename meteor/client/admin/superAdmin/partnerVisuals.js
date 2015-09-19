/*
 * Per partner stacked bar graph, looking at types of events
 *
 */

Template.partnerVisuals.rendered = function(){

  var rawData = Transactions.find({approved: true}, 
                                  {fields: {category: 1, hoursSpent: 1, partnerOrg: 1}})
                                  .fetch();


  var grouped = _.groupBy(rawData, function(trans) {
    return trans.partnerOrg;
  });

  var filteredDataset = _.filter(grouped, function(elem) {
    return elem.length > 50;
  });

  var dataset = _.map(filteredDataset, function(value, key, list) {
    return [value[0].partnerOrg, value.length];
  });

  var w = 800;
  var h = 800;

  var outerRadius = w/2;
  var innerRadius = w/3;

  var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius);

  var outerArc = d3.svg.arc()
  .innerRadius(innerRadius * 1.2)
  .outerRadius(outerRadius * 1.2);

  var color = d3.scale.category20();

  var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return d[1];
  });

  //center align
  //d3.select("#checkInsByPartner").attr("align", "center");

  var svg = d3.select("#checkInsByPartner")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  svg.append("g")
  .attr("class", "slices");
  svg.append("g")
  .attr("class", "labels");
  svg.append("g")
  .attr("class", "lines");
  

  //align
  $("svg").css({top: 200, left: 200, position: 'absolute'});

  var arcs = svg.selectAll("g.arc")
  .data(pie(dataset))
  .enter()
  .append("g")
  .attr("class", "arc")
  .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

  arcs.append("path")
  .attr("fill", function(d, i) {
    return color(i);
  })
  .attr("d", arc);

  arcs.append("text")
  .attr("transform", function(d) {
    return "translate(" + arc.centroid(d) + ")";

  })
  .attr("text-anchor", "middle")
  .text(function(d) {
    return d.value;
  });

  //TEXT LABELS
  var text = svg.select(".labels").selectAll("text")
  .data(pie(dataset), function(d) { 
    return d.data.label;
  });

  text.enter()
  .append("text")
  .attr("dy", ".35em")
  .text(function(d) {
    return d.data[0];
  });

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

text.transition().duration(1000)
    .attrTween("transform", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = outerRadius * (midAngle(d2) < Math.PI ? 1 : -1);
        return "translate("+ pos +")";
      };
    })
    .styleTween("text-anchor", function(d){
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start":"end";
      };
    });

  text.exit()
    .remove();

};
