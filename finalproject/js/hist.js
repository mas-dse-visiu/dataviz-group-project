function drawHist(label,spectrum)
{
    d3.selectAll('hist > *').remove();

    var top = top3(spectrum);

    //console.log(top);

    //var spectrum = [0.12,0.1,0.08,0.075,0.14,0.18,0.11,0.0007,0.3]
    var band = ['Coastal','Blue','Green','Red','NIR','SWIR1','SWIR2','Cirrus','NDVI'];

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

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
      .style('stroke','red');

    svg.append("path")
      .data([top[1].slice(0,9)])
      .attr("class", "line")
      .attr("d", valueline)
      .style('stroke','red');

    svg.append("path")
      .data([top[2].slice(0,9)])
      .attr("class", "line")
      .attr("d", valueline)
      .style('stroke','red');

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));
}

function top3 (spectrum)
{
    var lf = landfireAvg.slice();
    console.log(lf);

    for (var i = 0; i < lf.length; i++)
    {
        var key = lf[i].pop();
        lf[i].push(Math.abs(d3.sum(lf[i]) - d3.sum(spectrum)));
        lf[i].push(key);
    }

    lf.sort(sortArray);

    var r = [];
    r.push(lf.pop());
    r.push(lf.pop());
    r.push(lf.pop());

    return r;
}


function sortArray(a, b) {
    if (a[9] === b[9]) {
        return 0;
    }
    else {
        return (a[9] > b[9]) ? -1 : 1;
    }
}
//var spectrum = [0.12,0.1,0.08,0.075,0.14,0.18,0.11,0.0007,0.3];

