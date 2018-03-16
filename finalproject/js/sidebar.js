var width = 250;
var height = 250;
var center = [width / 2, height / 2];
var innerRadius = 50;
var outerRadius = 100;

function drawPie ()
{
    var veg = d3.select("#veg-dropdown").node().value;
    var type = d3.select("#type-dropdown").node().value;

    d3.selectAll('svg > *').remove();

    var color = d3.scaleOrdinal()
                  .domain(['0','1','2','3','4','5','6','7','8','9'
                          ,'10','11','12','13','14','15','16','17','18','19'
                          ,'20','21','22','23','91','93','98','99'])
                  .range([ '#a6cee3'
                        , '#1f78b4'
                        , '#b2df8a'
                        , "#33a02c"
                        , "#fb9a99"
                        , '#e31a1c'
                        , '#fdbf6f'
                        , '#ff7f00'
                        , "#cab2d6"
                        , "#6a3d9a"
                        , '#ffff99'
                        , '#b15928'
                        , '#8dd3c7'
                        , "#ffffb3"
                        , "#bebada"
                        , '#fb8072'
                        , '#80b1d3'
                        , '#fdb462'
                        , "#b3de69"
                        , "#fccde5"
                        , '#d9d9d9'
                        , '#bc80bd'
                        , '#ccebc5'
                        , "#ffed6f"
                        , '#ffff99'
                        , '#b15928'
                        , '#8dd3c7'
                        , "#ffffb3"]);
                //   [
                //     ['0', '#a6cee3'],
                //     ['1', '#1f78b4'],
                //     ['2', '#b2df8a'],
                //     ["3", "#33a02c"],
                //     ["4", "#fb9a99"],
                //     ['5', '#e31a1c'],
                //     ['6', '#fdbf6f'],
                //     ['7', '#ff7f00'],
                //     ["8", "#cab2d6"],
                //     ["9", "#6a3d9a"],
                //     ['10', '#ffff99'],
                //     ['11', '#b15928'],
                //     ['12', '#8dd3c7'],
                //     ["13", "#ffffb3"],
                //     ["14", "#bebada"],
                //     ['15', '#fb8072'],
                //     ['16', '#80b1d3'],
                //     ['17', '#fdb462'],
                //     ["18", "#b3de69"],
                //     ["19", "#fccde5"],
                //     ['20', '#d9d9d9'],
                //     ['21', '#bc80bd'],
                //     ['22', '#ccebc5'],
                //     ["23", "#ffed6f"]
                // ]
                  // );
      //d3.schemeCategory20);

    var dataset = (type == 'clabel') ? pieData[veg] : fuelData[veg];

    if (typeof dataset == 'undefined') return;

    var pie = d3.pie()
        .value(function(d) { return d.count; });

    var svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + center[0] + ', ' + center[1] + ')');

    svg.append('text')
      .attr('x', 0)
      .attr('y', -110)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('LANDFIRE Cluster Composition')

    var arc = d3.arc()
      .innerRadius(innerRadius + 10)
      .outerRadius(outerRadius);

    var hoverArc = d3.arc()
      .innerRadius(outerRadius-10)
      .outerRadius(outerRadius-10);

    svg.append('g').attr('class','slices');

    var path = svg.select('.slices')
                .selectAll('path')
                .data(pie(dataset))
            .enter();

    path.append('path')
        .attr('fill', function(d,i) { return color((type=='clabel')?d.data.cluster:d.data.fuel);})
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
        .attr("transform", function(d) { return "translate(" + hoverArc.centroid(d) + ")"; })
        .text(function(d) { 
            if ((d.endAngle - d.startAngle)/(2*Math.PI) > 0.05) {
                var label;
                if (type == 'clabel') label = "C"+d.data.cluster;
                else label = "F"+d.data.fuel;
                return label + ":" + ((d.endAngle - d.startAngle)/(2*Math.PI)*100).toFixed(1) + "%" ;
            } 
            return ""; });

    var path = svg.selectAll("arc");
    path = path.data(pie(dataset));
    path.transition().duration(1000).attrTween('d', arcTween);
}

function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

d3.select("#veg-dropdown")
  .on("change",function(d){
    drawPie();
});