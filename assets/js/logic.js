// Create a map object
var myMap = L.map("map", {
    center: [38.850033, -97.6500523],
    zoom: 4
  });
  
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);

// // Define a markerSize function that will give each city a different radius based on its population
function markerSize(casesCount) {
    var size = 0;
    if (casesCount > 10000) {
        size = 400000
    }
    else if (casesCount > 400) {
        size = 90000;
    }
    else if (casesCount >200) {
        size = 30000
    }
    else if (casesCount > 100) {
        size = 20000
    }
    else {
        size = 10000
    }

    return size
};

// number formatter for commas
var numberFormat = function(d) {
    return d3.format(",")(d);
}

// load api coronavirus cases data
var url = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs"
d3.json(url).then(function(data) {
    var locations = data.locations
    console.log(locations)
    console.log(locations.length)

    // empty lists
    var casesTot = [];
    var eachCountyTot = [];
    statesTot={};
    // counter
    var x=0

    for (var i=0; i < locations.length; i++) {

        // define variables
        var state = locations[i]
        var coordinates = state.coordinates
        var casesCount = numberFormat(state.latest.confirmed)
        // format location to be read properly in layer
        var location = []
        location.push(coordinates.latitude, coordinates.longitude)        
        currentStateName = locations[x].province;
        // sum up cases (push to empty list and then add) 
        casesTot.push(state.latest.confirmed)
        var sumCases = casesTot.reduce((a, b) => a + b,0)

        // number of cases by state
        if (locations[x].province === locations[i].province) {
            eachCountyTot.push(state.latest.confirmed)
        }
        else {
            console.log(eachCountyTot)
            // add up cases by state and print
            var sumCasesState = eachCountyTot.reduce((a,b)=>a+b,0)
            console.log(locations[x].province, sumCasesState)
            // push sumNY to dictionary as value
            statesTot[currentStateName] = sumCasesState

            // reset counter and empty list
            x=i
            eachCountyTot=[]

            if (locations[x].province === locations[i].province) {
                eachCountyTot.push(state.latest.confirmed)
            }
        }

    // circles by county
    L.circle(location, {
        fillOpacity: 0.75,
        color: "red",
        fillColor: "purple",
        radius: markerSize(state.latest.confirmed)
        })
        .bindPopup("<h5>" + state.county + ", " + state.province + "</h5> <hr> <h6>Confirmed Cases: " + casesCount + "</h6><br><h6>Deaths: " + state.latest.deaths + "</h6><br><h7>Last Updated: " +  state.last_updated + "</h7>")
        .addTo(myMap);

    }

    // print total cases
    console.log(`Total cases: ${sumCases}`)
    // print total cases by state in dictionary
    console.log(statesTot)

});