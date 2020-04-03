// start of thien's code
// by state
d3.csv("assets/data/unemployment_claims_by_state.csv").then(function(data){
    console.log(data[0]);
});

// claims by date
d3.csv("assets/data/unemployment_claims.csv").then(function(data){
    //console.log(data[0]);
    var dates = [];
    var claims = [];
    for(var i = 0;i<data.length;i++){
        dates.push(data[i].WeekEnding);
        claims.push(data[i].InitialClaims);
    }
    // console.log(dates);
    // console.log(claims);

    // chart
    var trace1 = {
        x: dates,
        y: claims,
        type: 'scatter'
    };
    // layout
    var layout = {
        width: 1200,
        height: 500
    };
    var claims_data = [trace1];
    Plotly.newPlot('plot-unemp',claims_data,layout);
});
