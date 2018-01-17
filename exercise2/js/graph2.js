
function updateGraph2(data) {
  //var keys = data.columns.slice(1);
  var keys = ["Medal_count_individual", "Medal_count_team" ]
  //console.log(keys);

  data.forEach(function(d) {
        d.sum = +d.Medal_count_individual + +d.Medal_count_team
  });

  //console.log(JSON.stringify(data));

  var x = d3.scaleLinear().range([ 0, width2 ]);
    
  var y = d3.scaleLinear().range([ height2, 0 ]);

  x.domain([0, d3.max(data, function(d) { return d.Medal_count_individual; })]);
  y.domain([0, d3.max(data, function(d) { return d.Medal_count_team; })]);

  // add the dots

  gdot = g2.selectAll("dot")
     .data(data)
     .enter().append("g")

  gdot.append("circle")
       .attr("r", 5)
       .attr("cx", function(d) { return x(d.Medal_count_individual); })
       .attr("cy", function(d) { return y(d.Medal_count_team); });

  // add the X Axis
  g2.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x))

  g2.append("text")
    .attr("transform","translate(" + (width2/2) + " ," + (height2 + margin2.top + 10) + ")")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Individual Medals"); 

  // add the Y Axis
  g2.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin2.left)
      .attr("x",0 - (height2 / 2))
      .attr("dy", "1em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Team Medals");

  gdot.append("text").text(function(d){
                    return d.Year__;
                })
                .attr("x", function (d) {
                    return x(d.Medal_count_individual);
                })
                .attr("y", function (d) {
                    return y(d.Medal_count_team);
                })
                .attr("fill", "red")
                .attr("dy", "-0.32em")
                .attr("text-anchor", "middle");
  
}
