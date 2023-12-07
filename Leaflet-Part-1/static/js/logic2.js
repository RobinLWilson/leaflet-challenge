// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data);

});
// 2.
function changeRadius(x) {
    if (x == 0) {
      return 1;
    }
    return x * 2;
}

function changeColor(depth) {
    switch (true) {
        case depth > 90: 
            return '#BA1E08';
        case depth > 70:
            return "#F26D11";
        case depth > 50: 
            return '#F28211';
        case depth > 30:
            return "#DEF423";
        case depth > 10: 
            return "#B0F058";
        default: 
            return "#58F058";
    }
}

function createStyle(feature) {
    return {
      fillColor: changeColor(feature.geometry.coordinates[2]),
      color: "#000000",
      weight: 1,
      radius: changeRadius(feature.properties.mag)
    }
}

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer){
      layer.bindPopup(`<h3>${feature.properties.place}</h3> <hr>
      <p>Depth: ${feature.geometry.coordinates[2]}km</p>  
      <p>Magnitude: ${feature.properties.mag}</p>`)
    }

    // Save the earthquake data in a variable.
    let earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature,latlng) {
        return L.circleMarker(latlng);
      },
      onEachFeature: onEachFeature,
      style: createStyle
    })
    // Pass the earthquake data to a createMap() function.
    createMap(earthquakes);
    }

// 3.
// createMap() takes the earthquake data and incorporates it into the visualization:
function createMap(earthquakes) {
    // Create the base layer.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a new map.
    // Edit the code to add the earthquake data to the layers.
    let myMap = L.map("map", {
        center: [55.35, 1.38],
        zoom: 1.5,
        layers: [street, earthquakes]
    });

    // 4.
    // Create a legend control.
    let legend = L.control({ position: 'bottomright' });

    // 5.
    // Create content for the legend based on your depth categories and colors.
    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'legend');
        const depthCategories = [0, 10, 30, 50, 70, 90];
        const colors = ['#58F058', '#B0F058', '#DEF423', '#F28211', '#F26D11', '#BA1E08'];

        // Add a white background to the legend
        //div.style.backgroundColor = 'white';

        for (let i = 0; i < depthCategories.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depthCategories[i] + (depthCategories[i + 1] ? '&ndash;' + depthCategories[i + 1] + '<br>' : '+');
        }

        return div;
    };

    // 6.
    // Add the legend control to the map.
    legend.addTo(myMap);
}

 