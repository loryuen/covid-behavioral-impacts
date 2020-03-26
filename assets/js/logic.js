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

// // Define a markerSize function that will give each city a different radius based on its population
function markerSize(casesCount) {
    return casesCount * 30;

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
    var nyTot = [];
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

        // console.log(`current x value: ${x}`)

        // test if statement by state
        if (locations[x].province === locations[i].province) {
            nyTot.push(state.latest.confirmed)
            // nyTot[currentStateName]=state.latest.confirmed;
        }
        else {
            var sumNY = nyTot.reduce((a,b)=>a+b,0)
            console.log(locations[x].province, sumNY)

            x=i
            nyTot=[]
            if (locations[x].province === locations[i].province) {
                nyTot.push(state.latest.confirmed)
            }
            else {
                var sumNY = nyTot.reduce((a,b)=>a+b,0)
                console.log(locations[x].province, sumNY)
            }
        }
        
        // console.log(nyTot)
        // else if (state.province === "North Carolina") {
        //     ncTot.push(state.latest.confirmed)
        // }

        // //add up NY cases
        // var sumNY = nyTot.reduce((a,b)=>a+b,0)
        // console.log(sumNY)
        
        // increase counter by 1 
        // console.log(`current x value: ${x}`)
        // x+=1
        // nyTot = []
        // console.log(`updated x value: ${x}`)

    // circles
    L.circle(location, {
        fillOpacity: 0.75,
        color: "red",
        fillColor: "purple",
        radius: markerSize(state.latest.confirmed)
        })
        .bindPopup("<h5>" + state.county + ", " + state.province + "</h5> <hr> <h6>Confirmed Cases: " + casesCount + "</h6><br><h6>Deaths: " + state.latest.deaths + "</h6><br><h7>Last Updated: " +  state.last_updated + "</h7>")
        .addTo(myMap);
    }

    // print totals
    // console.log(locations[x].province, sumNY)
    console.log(sumNY)
    console.log(`Total cases: ${sumCases}`)

});