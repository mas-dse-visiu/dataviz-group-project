var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/positron-gl-style/style-cdn.json',
    center: [-117.0864, 33.1192],
    zoom: 10
});

var layertracker = []

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

function toggleLayer(n) {
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
                property: 'clabel',
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
                    ["23", "#ffed6f"]
                ],
                default: "#088"
                },
                'fill-opacity': 0.2
            }

    });

    map.on('click', n.value, function (e) {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML("vlabel: " + e.features[0].properties.vlabel
            + "\n<br>clabel: " + e.features[0].properties.clabel
            + "\n<br>flabel: " + e.features[0].properties.flabel
            + "\n<br>coastal: " + specData[+e.features[0].properties.id][0]
            + "\n<br>blue: " + specData[+e.features[0].properties.id][1]
            + "\n<br>green: " + specData[+e.features[0].properties.id][2]
            + "\n<br>red: " + specData[+e.features[0].properties.id][3]
            + "\n<br>nir: " + specData[+e.features[0].properties.id][4]
            + "\n<br>swirone: " + specData[+e.features[0].properties.id][5]
            + "\n<br>swirtwo: " + specData[+e.features[0].properties.id][6]
            + "\n<br>cirrus: " + specData[+e.features[0].properties.id][7]
            + "\n<br>ndvi: " + specData[+e.features[0].properties.id][8]  )
        .addTo(map);
    document.getElementById('point-info').innerHTML = String("vlabel: " + e.features[0].properties.vlabel
            + "\n<br>clabel: " + e.features[0].properties.clabel
            + "\n<br>flabel: " + e.features[0].properties.flabel
            + "\n<br>coastal: " + specData[+e.features[0].properties.id][0]
            + "\n<br>blue: " + specData[+e.features[0].properties.id][1]
            + "\n<br>green: " + specData[+e.features[0].properties.id][2]
            + "\n<br>red: " + specData[+e.features[0].properties.id][3]
            + "\n<br>nir: " + specData[+e.features[0].properties.id][4]
            + "\n<br>swirone: " + specData[+e.features[0].properties.id][5]
            + "\n<br>swirtwo: " + specData[+e.features[0].properties.id][6]
            + "\n<br>cirrus: " + specData[+e.features[0].properties.id][7]
            + "\n<br>ndvi: " + specData[+e.features[0].properties.id][8] );
    });

    layertracker.push(n.value)
}