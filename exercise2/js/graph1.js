
function updateGraph1(data) {
  //var keys = data.columns.slice(1);
  var keys = ["Medal_count_individual", "Medal_count_team" ]
  //console.log(keys);

  var x0 = d3.scaleBand()
    .rangeRound([0, width1])
    .paddingInner(0.1);

  var x1 = d3.scaleBand()
    .padding(0.05);

  var y = d3.scaleLinear()
    .rangeRound([height1, 0]);

  var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  x0.domain(data.map(function(d) { return d.Year__; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return +d[key]; }); })]).nice();

  g1.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Year__) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height1 - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  g1.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height1 + ")")
      .call(d3.axisBottom(x0));

  g1.append("text")
    .attr("transform","translate(" + (width1/2) + " ," + (height1 + margin1.top + 10) + ")")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Years"); 

  g1.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) - 5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Medals");

  var legend = g1.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", 42)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d.replace(/_/g, " "); });
}
