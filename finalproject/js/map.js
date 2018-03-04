var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json',
    center: [-117.0864, 33.1192],
    zoom: 10
});

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

    for (var key in mapData) {
        //console.log(key)
        map.addLayer({
            'id': key,
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': mapData[key]
            },
            'layout': {'visibility': 'none'},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.2
            }

         });
        map.on('click', key, function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("vlabel: " + e.features[0].properties.vlabel
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
    } 

});

function toggleLayer(n) {
    var visibility = map.getLayoutProperty(String(n.value), 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty(String(n.value), 'visibility', 'none');
    } else {
        map.setLayoutProperty(String(n.value), 'visibility', 'visible');
    }
}