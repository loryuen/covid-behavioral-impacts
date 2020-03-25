// Create a map object
var myMap = L.map("map", {
    center: [51.850033, -97.6500523],
    zoom: 4
  });
  
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);


// console.log(states.forEach(d=> console.log(d.Latitude)))

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(casesCount) {
    return casesCount;
    };

// load api coronavirus cases data
var url = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs"
d3.json(url).then(function(data) {
    var locations = data.locations
    console.log(locations)
    console.log(locations.length)

    

    for (var i=0; i < locations.length; i++) {
        // var state = locations[i].province
        var state = locations[i]
        var coordinates = state.coordinates
        var casesCount = state.latest.confirmed
        var location = []
        location.push(coordinates.latitude, coordinates.longitude)        
        console.log(location)

    // circles
    L.circle(location, {
        fillOpacity: 0.75,
        color: "red",
        fillColor: "purple",
        radius: markerSize(locations[i].latest.confirmed)
        })
        .bindPopup("<h4>" + state.county + ", " + state.province + "</h4> <hr> <h5>Positive Cases: " + casesCount + "</h5>")
        .addTo(myMap);

    // Markers
    // L.marker(location)
    //     .bindPopup("<h4>" + state.county + ", " + state.province + "</h4> <hr> <h5>Positive Cases: " + state.latest.confirmed + "</h5>")
    //     .addTo(myMap);
    }

});