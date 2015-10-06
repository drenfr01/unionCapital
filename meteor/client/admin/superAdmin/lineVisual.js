Template.lineVisual.rendered = function() {
  var width = 800,
  height = 500,
  margin = 50;


  //data
  var rawData = Transactions.find({approved: true}, 
                                  {fields: {transactionDate: 1}})
                                  .fetch();


  var grouped = _.groupBy(rawData, function(trans) {
    return moment(trans.transactionDate).startOf('month').toString();
  });

  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var dataset = _.map(grouped, function(value, key, list) {
    return {x: monthNames[moment(key).month()], y: value.length};
  });

  dataset = [dataset];
  console.log(dataset);

  //scales



  x = d3.scale.ordinal() // <-A
  .domain(monthNames)
  .range([margin, width - margin]),
  y = d3.scale.linear() // <-B
  .domain([0, 5000])
  .range([height - margin, margin]);

  var data = [ // <-C
    [
    {x: 0, y: 5},{x: 1, y: 9},{x: 2, y: 7},
    {x: 3, y: 5},{x: 4, y: 3},{x: 6, y: 4},
    {x: 7, y: 2},{x: 8, y: 3},{x: 9, y: 2}
  ],

  d3.range(10).map(function(i){
    return {x: i, y: Math.sin(i) + 5};
  })
  ];

  var line = d3.svg.line() // <-D
  .x(function(d){return x(d.x);})
  .y(function(d){return y(d.y);});

  var svg = d3.select("#line").append("svg");

  svg.attr("height", height)
  .attr("width", width);

  svg.selectAll("path")
  .data(dataset)
  .enter()
  .append("path") // <-E
  .attr("class", "line")            
  .attr("d", function(d){return line(d);}); // <-F

  renderAxes(svg);

  function renderAxes(svg){ // <-G
    var xAxis = d3.svg.axis()
    .scale(x.range([0, quadrantWidth()]))
    .orient("bottom")
    .ticks(12);

    var yAxis = d3.svg.axis()
    .scale(y.range([quadrantHeight(), 0]))
    .orient("left");

    svg.append("g")        
    .attr("class", "axis")
    .attr("transform", function(){
      return "translate(" + xStart() 
      + "," + yStart() + ")";
    })
    .call(xAxis);

    svg.append("g")        
    .attr("class", "axis")
    .attr("transform", function(){
      return "translate(" + xStart() 
      + "," + yEnd() + ")";
    })
    .call(yAxis);
  }

  function xStart(){
    return margin;
  }        

  function yStart(){
    return height - margin;
  }

  function xEnd(){
    return width - margin;
  }

  function yEnd(){
    return margin;
  }

  function quadrantWidth(){
    return width - 2 * margin;
  }

  function quadrantHeight(){
    return height - 2 * margin;
  }        
};
