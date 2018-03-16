function drawHist(label,spectrum)
{
    d3.selectAll('hist > *').remove();

    var top = top3(spectrum);

    //console.log(top);

    //var spectrum = [0.12,0.1,0.08,0.075,0.14,0.18,0.11,0.0007,0.3]
    var band = ['Coastal','Blue','Green','Red','NIR','SWIR1','SWIR2','Cirrus','NDVI'];

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 250 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d,i) { return x(i); })
        .y(function(d) { return y(d); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("hist").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    svg.append('text')
      .attr('x', (width + margin.left + margin.right)/2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Closest Spectral Profiles')

    // Scale the range of the data
    x.domain(d3.extent(spectrum, function(d,i) { return i; }));
    y.domain([0, 0.5]);//d3.max(spectrum, function(d) { return d; })]);

    // Add the valueline path.
    svg.append("path")
      .data([spectrum])
      .attr("class", "line")
      .attr("d", valueline);

    svg.append("path")
      .data([top[0].slice(0,9)])
      .attr("class", "line")
      .attr("d", valueline)
      .style('stroke','RED')
      .style('stroke-width','0.5px');

    svg.append("path")
      .data([top[1].slice(0,9)])
      .attr("class", "line")
      .attr("d", valueline)
      .style('stroke','GREEN')
      .style('stroke-width','0.5px');

    svg.append("path")
      .data([top[2].slice(0,9)])
      .attr("class", "line")
      .attr("d", valueline)
      .style('stroke','GOLD')
      .style('stroke-width','0.5px');

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));


    svg.append('rect')
      .attr('x',margin.left/2)
      .attr('y',15)
      .attr('width',8)
      .attr('height',8)
      .style('fill','RED');

    svg.append('rect')
      .attr('x',margin.left/2)
      .attr('y',15+margin.top)
      .attr('width',8)
      .attr('height',8)
      .style('fill','GREEN');

    svg.append('rect')
      .attr('x',margin.left/2)
      .attr('y',15+margin.top*2)
      .attr('width',8)
      .attr('height',8)
      .style('fill','GOLD');

    svg.append("text")
      .attr("transform", "translate("+margin.left+","+margin.top+")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style('font-size','8pt')
      .style("fill", "RED")
      .text(top[0][9]);

    svg.append("text")
      .attr("transform", "translate("+margin.left+","+margin.top*2+")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style('font-size','8pt')
      .style("fill", "GREEN")
      .text(top[1][9]);

    svg.append("text")
      .attr("transform", "translate("+margin.left+","+margin.top*3+")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style('font-size','8pt')
      .style("fill", "GOLD")
      .text(top[2][9]);
}

function top3 (spectrum)
{
    var lf = [];//landfireAvg.slice();

    for (var i = 0; i < landfireAvg.length; i++)
    {
        lf.push(landfireAvg[i].slice(0,10))
        lf[i].push(Math.abs(d3.sum(landfireAvg[i].slice(0,9)) - d3.sum(spectrum)));
    }

    lf.sort(sortArray);

    return lf.slice(0,3);
}


function sortArray(a, b) {
    if (a[10] === b[10]) {
        return 0;
    }
    else {
        return (a[10] < b[10]) ? -1 : 1;
    }
}

//var spectrum = [0.12,0.1,0.08,0.075,0.14,0.18,0.11,0.0007,0.3];
//drawHist(3092,spectrum);
