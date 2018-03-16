var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/positron-gl-style/style-cdn.json',
    center: [-117.0864, 33.1192],
    zoom: 10
});

map.addControl(new mapboxgl.NavigationControl());

var layertracker = [];
var currentpop
var objectpop = new Map();
var openPopup = true;

map.on('load', function () {

	map.addLayer({
        "id": "landsat8",
        "source": {
            "type": "image",
    "url": "/data/img-out.gif",
    "coordinates": [
        [-117.20485950972358, 33.146093693059406],
        [-117.10192301086187, 33.146220451091324],
        [-117.10177204098497, 33.015225120424695],
        [-117.20455607071793, 33.01509899094663]
    	]
        },
        "type": "raster",
        "paint" : {
    "raster-opacity" : 0.85
  }
    });

});

function format_marker(opop) {
    var latlong_string = '';
    //for (index = 0; index < arraypop.length; ++index){
    for(var [key, value] of opop) {
      //latlong_string += String(index) + ') ' + String(latlong[index].getPosition().lat()) + ', ' + String(latlong[index].getPosition().lng()) + '<br>';
      latlong_string += "<button onclick=\"deleteToArrayPop(" + value.point.features[0].properties.id + ")\">Remove</button> ";
      latlong_string += " id: " + String(value.point.features[0].properties.id) + ",";
      latlong_string += " long: " + String(value.point.lngLat.lng.toFixed(3)) + ",";
      latlong_string += " lat: " + String(value.point.lngLat.lat.toFixed(3)) + ",";
      latlong_string += " vlabel: " + String(value.point.features[0].properties.vlabel) + ",";
      latlong_string += " clabel: " + String(value.point.features[0].properties.clabel) + ",";
      latlong_string += " flabel: " + String(value.point.features[0].properties.flabel) + ",";

      tempArray = specData[+value.point.features[0].properties.id].map(function(each_element){
            return Number(each_element.toFixed(3));
      });

      latlong_string += " spectrum: [" + String(tempArray) + "]";
      latlong_string += "<br>"
    }
    
    //console.log(latlong_string);
    return latlong_string;
}

function addToArrayPop(){
    currentref = new mapboxgl.Popup()
        .setLngLat(currentpop.lngLat)
        .setHTML("\nid: " + currentpop.features[0].properties.id
            + "\n<br>vlabel: " + currentpop.features[0].properties.vlabel
            + "\n<br>clabel: " + currentpop.features[0].properties.clabel
            + "\n<br>flabel: " + currentpop.features[0].properties.flabel);
    objectpop.set(String(currentpop.features[0].properties.id),{"point": currentpop, "reference": currentref});
    document.getElementById('pop-info').innerHTML = format_marker(objectpop);
}

function deleteToArrayPop(id){
    objectpop.get(String(id)).reference.remove();
    objectpop.delete(String(id));
    document.getElementById('pop-info').innerHTML = format_marker(objectpop);
}

function toggleLayer() {

    n = document.getElementById('veg-dropdown');
    m = document.getElementById('type-dropdown');

    if (layertracker.length > 0){
        var lastid = layertracker.pop()
        map.removeLayer(lastid);
        map.removeSource(lastid);
    }

    map.addLayer({
            'id': n.value,
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': mapData[n.value]
            },
            'layout': {'visibility': 'visible'},
            'paint': {
                //'fill-color': '#088',
                'fill-color': {
                property: m.value,
                type: 'categorical',
                stops: [
                    ['0', '#a6cee3'],
                    ['1', '#1f78b4'],
                    ['2', '#b2df8a'],
                    ["3", "#33a02c"],
                    ["4", "#fb9a99"],
                    ['5', '#e31a1c'],
                    ['6', '#fdbf6f'],
                    ['7', '#ff7f00'],
                    ["8", "#cab2d6"],
                    ["9", "#6a3d9a"],
                    ['10', '#ffff99'],
                    ['11', '#b15928'],
                    ['12', '#8dd3c7'],
                    ["13", "#ffffb3"],
                    ["14", "#bebada"],
                    ['15', '#fb8072'],
                    ['16', '#80b1d3'],
                    ['17', '#fdb462'],
                    ["18", "#b3de69"],
                    ["19", "#fccde5"],
                    ['20', '#d9d9d9'],
                    ['21', '#bc80bd'],
                    ['22', '#ccebc5'],
                    ["23", "#ffed6f"],
                    ['91', '#ffff99'],
                    ['93', '#b15928'],
                    ['98', '#8dd3c7'],
                    ["99", "#ffffb3"]
                ],
                default: "#088"
                },
                'fill-opacity': 0.5
            }

    });

    map.on('click', n.value, function (e) {
    currentpop = e;
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML("\nid: " + currentpop.features[0].properties.id
            + "\n<br>vlabel: " + e.features[0].properties.vlabel
            + "\n<br>clabel: " + e.features[0].properties.clabel
            + "\n<br>flabel: " + e.features[0].properties.flabel
            + "\n<br><button onclick=\"addToArrayPop()\">Track</button>")
            .addTo(map);
    document.getElementById('left').innerHTML = String("\n<b>Area Info</b><br><br><br>id: " + currentpop.features[0].properties.id
            + "\n<br>vlabel: <div class=\"tooltip\">" + e.features[0].properties.vlabel + "<span class=\"tooltiptext\">" + veglabelName[+e.features[0].properties.vlabel] +"</span></div>"
            + "\n<br>clabel: " + e.features[0].properties.clabel
            + "\n<br>flabel: <div class=\"tooltip\">" + e.features[0].properties.flabel + "<span class=\"tooltiptext\">" + fuellabelName[+e.features[0].properties.flabel] +"</span></div>");
    document.getElementById('right').innerHTML = String("\ncoastal: " + specData[+e.features[0].properties.id][0].toFixed(5)
            + "\n<br>blue: " + specData[+e.features[0].properties.id][1].toFixed(5)
            + "\n<br>green: " + specData[+e.features[0].properties.id][2].toFixed(5)
            + "\n<br>red: " + specData[+e.features[0].properties.id][3].toFixed(5)
            + "\n<br>nir: " + specData[+e.features[0].properties.id][4].toFixed(5)
            + "\n<br>swirone: " + specData[+e.features[0].properties.id][5].toFixed(5)
            + "\n<br>swirtwo: " + specData[+e.features[0].properties.id][6].toFixed(5)
            + "\n<br>cirrus: " + specData[+e.features[0].properties.id][7].toFixed(5)
            + "\n<br>ndvi: " + specData[+e.features[0].properties.id][8].toFixed(5)
             );

        drawHist(e.features[0].properties.vlabel,specData[+e.features[0].properties.id]);
    });

    layertracker.push(n.value)
    drawPie();
}

document.getElementById('open-popup').onclick = function(e) {
    for(var [key, value] of objectpop) {
        value.reference.addTo(map);
    }
}

document.getElementById('close-popup').onclick = function(e) {
    for(var [key, value] of objectpop) {
        value.reference.remove();
    }
}


