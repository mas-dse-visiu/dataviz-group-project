var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.ind_ratio;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale);

// setup y
var yValue = function(d) { return d.team_ratio;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft(yScale);

// setup fill color
var cValue = function(d) { return d.Sports;},
    color = d3.scaleOrdinal(d3.schemeCategory10);

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function updateScatter(country) {

  // load data
  d3.csv("data/year_sport_country_total_ind_team.csv", function(error, data) {

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.ind_ratio = +d.ind_ratio;
      d.team_ratio = +d.team_ratio;
      d.individual = +d.individual;
      d.team = +d.team;
    });

    updateGraph(data,country);
  });
};

function updateGraph(data,country) {

  data = data.filter(function(d) {return d.Country == country});
  var sports = d3.map(data, function(d) { return cValue(d); });

  // don't want dots overlapping axis, so add in buffer to data domain
  //xScale.domain([d3.min(data, xValue)-0.1, d3.max(data, xValue)+0.1]);
  //yScale.domain([d3.min(data, yValue)-0.1, d3.max(data, yValue)+0.1]);
  xScale.domain([0, 1]);
  yScale.domain([0, 1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Individual");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Team");

  // x-axis
  svg.append("text")
    .attr("transform","translate(" + (-100 + width/2) + " ," + (height + margin.top + 10) + ")")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Ratio of Individual Medals Won"); 

  // y-axis
  svg.append("g")
      .call(d3.axisLeft(yScale))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", -50 - (height / 2))
      .attr("dy", "1em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Ratio of Team Medals Won");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9)
               .style("background-color", "#ccc")
               .style("min-height", "75px");
          tooltip.html(d.Year + "<br/>Total: " + d.total 
            + "<br/>Ind: " + d.individual + ", Team: " + d.team 
            + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 8) + "px")
               .style("top", (d3.event.pageY - 50) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // draw legend
    var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
    .selectAll("g")
    .data(sports.keys())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", 42)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
      
};
