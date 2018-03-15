var width = 300;
var height = 300;
var center = [width / 2, height / 2];
var innerRadius = 50;
var outerRadius = 100;

function drawPie (sel)
{
    d3.selectAll('svg > *').remove();

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var pie = d3.pie()
        .value(function(d) { return d.count; });

    var svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + center[0] + ', ' + center[1] + ')');

    var arc = d3.arc()
      .innerRadius(innerRadius + 10)
      .outerRadius(outerRadius);

    var hoverArc = d3.arc()
      .innerRadius(innerRadius - 40)
      .outerRadius(outerRadius - 40);

    svg.append('g').attr('class','slices');

    var path = svg.select('.slices')
                .selectAll('path')
                .data(pie(pieData[sel]))
            .enter();

    path.append('path')
        .attr('fill', function(d,i) { return color(i);})
        .attr('d',arc)
        .each(function (d) { this._current = d; })
            .on('mouseover', function (d, i) {
              d3.select(this)
                .transition()
                  .duration(500)
                  .ease(d3.easeElastic)
              .attr('transform', function (d) {
                var dist = 10;
                d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                var x = Math.sin(d.midAngle) * dist;
                var y = -Math.cos(d.midAngle) * dist;
                return 'translate(' + x + ',' + y + ')';
                });
            })
            .on('mouseout', function (d, i) {
                  d3.select(this)
                    .transition()
                      .duration(500)
                      .ease(d3.easeBounce)
                      .attr('transform', 'translate(0,0)');
            });

    path.append('text')
        .attr('dy','.35em')
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .text(function(d) { 
            if ((d.endAngle - d.startAngle)/(2*Math.PI) > 0.05) {
                return "C" + d.data.cluster;
            } 
            return ""; });

    var path = svg.selectAll("arc");
    path = path.data(pie(pieData[sel]));
    path.transition().duration(1000).attrTween('d', arcTween);
}

function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

drawPie(3092);

d3.select("select")
  .on("change",function(d){
    var selected = d3.select("#d3-dropdown").node().value;
    drawPie(selected);
})