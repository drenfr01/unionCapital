/*
 * B1: My xs: age at bottom, years of experience at top, mastery as bubble
 * B2: calendar year at bottom, ___, size of company as top (SFDC vs. Pega).
 * With transformation
 * B3: 
 */
//TODO: put definition of skill on web page: "what differentiates me from
//average college grad"
var skills = [
  "Consulting",
  "Sales",
  "Programming",
  "JavaScript",
  "Node",
  "Meteor",
  "SQL",
  "Machine Learning",
  "MongoDB",
  "Enterprise Architecture",
  "Healthcare I.T.",
  "Project Management",
  "Relational Databases",
  "Vim",
  "Java",
  "C/C++",
  "Functional Programming",
  "TDD"
];

var data = [
[
  {r: 1250, y: 5, x: "Consulting" },
  {r: 20, y: 3, x: "Sales" },
  {r: 3500, y: 6, x: "Programming" },
  {r: 400, y: 3, x: "JavaScript" },
  {r: 30, y: 2, x: "Node" },
  {r: 300, y: 3, x: "Meteor" },
  {r: 490, y: 8, x: "SQL" },
  {r: 200, y: 2, x: "Machine Learning" },
  {r: 150, y: 3, x: "MongoDB" },
  {r: 50, y: 3, x: "Enterprise Architecture" },
  {r: 1000, y: 5, x: "Healthcare I.T." },
  {r: 300, y: 4, x: "Project Management" },
  {r: 600, y: 7, x: "Relational Databases" },
  {r: 200, y: 6, x: "Vim" },
  {r: 800, y: 5, x: "Java" },
  {r: 100, y: 2, x: "C/C++" },
  {r: 115, y: 2, x: "Functional Programming" },
  {r: 15, y: 1, x: "TDD" }
],
[
  {r: 1499, y: 5, x: "Consulting" },
  {r: 300, y: 3, x: "Sales" },
  {r: 4000, y: 6, x: "Programming" },
  {r: 700, y: 4, x: "JavaScript" },
  {r: 50, y: 3, x: "Node" },
  {r: 500, y: 5, x: "Meteor" },
  {r: 500, y: 8, x: "SQL" },
  {r: 200, y: 2, x: "Machine Learning" },
  {r: 150, y: 3, x: "MongoDB" },
  {r: 100, y: 3, x: "Enterprise Architecture" },
  {r: 1000, y: 5, x: "Healthcare I.T." },
  {r: 300, y: 4, x: "Project Management" },
  {r: 600, y: 7, x: "Relational Databases" },
  {r: 300, y: 6, x: "Vim" },
  {r: 800, y: 4, x: "Java" },
  {r: 100, y: 2, x: "C/C++" },
  {r: 125, y: 2, x: "Functional Programming" },
  {r: 75, y: 2, x: "TDD" }
]
];
function bubbleChart() {
    var _chart = {};

    var _width = 900, _height = 500,
            _margins = {top: 30, left: 60, right: 30, bottom: 30},
            _x, _y, _r, // <-A
            _data = [],
            _colors = d3.scale.category10(),
            _svg,
            _bodyG;

    _chart.render = function () {
        if (!_svg) {
            _svg = d3.select("#line").append("svg")
                    .attr("height", _height)
                    .attr("width", _width);

            renderAxes(_svg);

            defineBodyClip(_svg);
        }

        renderBody(_svg);
    };

    function renderAxes(svg) {
        var axesG = svg.append("g")
                .attr("class", "axes");

        var xAxis = d3.svg.axis()
                .scale(_x.rangePoints([0, quadrantWidth()]))
                .tickValues(_x.domain())
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(_y.range([quadrantHeight(), 0]))
                .orient("left");

        axesG.append("g")
                .attr("class", "axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(xAxis);

        axesG.append("g")
                .attr("class", "axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(yAxis);
    }

    function defineBodyClip(svg) {
        var padding = 0;

        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }

    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" 
                            + xStart() 
                            + "," 
                            + yEnd() + ")")
                    .attr("clip-path", "url(#body-clip)");

        renderBubbles();
    }

    function renderBubbles() {
        _r.range([0, 50]); // <-B
    
        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i)
                        .data(list)
                    .enter()
                    .append("circle") // <-C
                    .attr("class", "bubble _" + i);

            _bodyG.selectAll("circle._" + i)
                        .data(list)
                    .style("stroke", function (d, j) { 
                        return _colors(j); 
                    })
                    .style("fill", function (d, j) { 
                        return _colors(j); 
                    })
                    .transition()
                    .attr("cx", function (d) { 
                        return _x(d.x); // <-D
                    })
                    .attr("cy", function (d) { 
                        return _y(d.y); // <-E
                    })
                    .attr("r", function (d) { 
                        return _r(d.r); // <-F
                    });
        });
    }

    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };

    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };
    
    _chart.r = function (r) {
        if (!arguments.length) return _r;
        _r = r;
        return _chart;
    };

    _chart.addSeries = function (series) {
        _data.push(series);
        return _chart;
    };

    _chart.removeSeries = function() {
      _data.pop();
      return _chart;
    }

    return _chart;
}

function randomData() {
    return Math.random() * 9;
}

    //x = x
    //y = mastery
    //r = hours spent 
    //to make this chronological, will go back and setup time series for each
    //year

var currentSeries = 0;

function next() {
  if(currentSeries >= data.length - 1) {
    currentSeries = 0;
  } else {
    currentSeries++;
  }
  chart.removeSeries();
  chart.addSeries(data[currentSeries]);

  chart.render();
}

function play() {
  //
}

var chart = bubbleChart()
        .x(d3.scale.ordinal().domain(skills))
        .y(d3.scale.linear().domain([0,10]))
        .r(d3.scale.pow().exponent(0.5).domain([0, 3500]));


chart.addSeries(data[currentSeries]);

//TODO: have axis lines that correspond to employment
//TODO: have scale of mastery
//TODO: have initial year (22) and last year (26) present on graph
//Definitely need explanation at the top
//changes
Template.bubbleVisual.rendered = function() {
  chart.render();
};

Template.bubbleVisual.events({
  'click #next': function(e) {
    next();
  }
});
