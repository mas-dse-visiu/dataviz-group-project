var map = L.map('map').setView([36.7783, -119.4179], 6);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
subdomains: 'abcd',
maxZoom: 19
}).addTo(map);

// get color depending on population density value
function getColor(d) {
    return d > 32  ? '#a50f15' :
           d > 16  ? '#cb181d' :
           d > 8   ? '#fb6a4a' :
           d > 4   ? '#fc9272' :
           d > 2   ? '#fcbba1' :
                      '#fee5d9';
}

var geojson;
var info = L.control();
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2, 4, 8, 16, 32],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            (grades[i]+1) + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            //'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +

    }

    return div;
};

legend.addTo(map);

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>County Cases Reported</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.positive_cases + ' cases'
        : 'Hover over a county');
};

info.addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}	

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function change_map(slideAmount){

	var lookup = arraylookup[+slideAmount]
	var e = lookup.toString();
	var myvar = e.split('-');
    var d = new Date(+myvar[0], 0, 1+((+myvar[1]-1)*7));

	document.getElementById("sliderAmount").innerHTML = "West Nile Virus Reported Cases Across California for week of " + d.toString().substring(4, 15);

	if (geojson !== undefined) { geojson.remove(); }

	//console.log(e)

	geojson = L.geoJson(statesData, {
		style: function(feature) {
    		return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.positive_cases)
			};
		},
		filter: function(feature) {
			if (feature.properties.year === +myvar[0] && feature.properties.week_reported === +myvar[1]) return true
		},
		onEachFeature: function(feature, layer) {
		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		        click: zoomToFeature
		    });
		}
	}).addTo(map);
}

change_map(35);



