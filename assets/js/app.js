// Define SVG area dimensions
var svgWidth = 530;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 80,
  bottom: 60,
  left: 80
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#plot-cases")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins (for national plot)
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%Y%m%d");

// json url
var urlNat = "https://covidtracking.com/api/us/daily"; // to see national plot by day (aggregate)
var urlState = "https://covidtracking.com/api/states/daily"; // to filter states and see cases by day

///////////////////////////////
// init view (national data) //
///////////////////////////////
function init() {
    nationalView();
};
init();

///////////////////////////////////////
// function for drop down of states //
//////////////////////////////////////
function buildDropdown() {
    d3.json(urlState).then(function(stateData) {
        
        // map only unique state abbreviations
        var stateAbbr = d3.map(stateData, function(d) {
            return (d.state)
        }).keys()
        // print state abbreviations
        // console.log(stateAbbr)

        // add options to the button
        d3.select("#selState")
            .selectAll('myOptions')
                .data(stateAbbr)
            .enter()
                .append('option')
            .text(function(d) {
                return (d)
            })
            .attr("value", function(d) {
                return d;
            })
    });
};
buildDropdown();

//////////////////////////////////////////////////////////////
//function for line plot of covid cases by state (diff api) //
//////////////////////////////////////////////////////////////
function statePlots() {
    d3.json(urlState).then(function(stateData) {

        var chartGroup2 = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Format the date and cast the total cases value to a number
        stateData.forEach(function(data) {
            data.date = parseTime(data.date);
            data.positive = +data.positive;
        });

        // configure x scale
        var xTimeScale = d3.scaleTime()
        .range([0, chartWidth])
        .domain(d3.extent(stateData, data => data.date));

        // Configure a linear scale with a range between the chartHeight and 0
        // Set the domain for the xLinearScale function
        var yLinearScale = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, d3.max(stateData, data => data.positive)+100000]);
            // .domain([0, 100000]);

        // Create two new functions passing the scales in as arguments
        var rightAxis = d3.axisRight(yLinearScale);

        // Configure a drawLine function which will use our scales to plot the line's points
        var drawLine = d3
            .line()
            .x(data => xTimeScale(data.date))
            .y(data => yLinearScale(data.positive));

        // Append an SVG group element to the SVG area, create the left axis inside of it
        chartGroup2.append("g")
            .classed("axis-blue", true)
            .attr("transform", "translate(370,0)")
            .call(rightAxis);
            

        // label y right axis
        chartGroup2.append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 + svgWidth - 110)
            .attr("x", 0 - (chartHeight/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "steelblue")
            .text("Number of Cases - State level")

        // Append an SVG path and plot its points using the line function
        var line = chartGroup2.append("path")
            .attr("d", drawLine (stateData[0]) )
            .classed("line", true)
            .style("stroke", "steelblue")
            .attr("stroke-width", 2)

        ///////////////////////////////
        // function to update chart //
        ///////////////////////////////
        function update(selectedGroup) {
            var dataFilter = stateData.filter(function(d) {
                return d.state == selectedGroup
            })

            // give new data to update line
            line.datum(dataFilter)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(data => xTimeScale(data.date))
                    .y(data => yLinearScale(data.positive))
                )
            updateCircles(selectedGroup)
        }
            
        function updateCircles(selectedGroup) {
            var dataFilter = stateData.filter(function(d) {
                return d.state == selectedGroup
            })
            //test
            var chartGroup2 = svg.append("g")
             .attr("transform", `translate(${margin.left}, ${margin.top})`);

            var circlesGroup2 = chartGroup2.selectAll("circle")
                .data(dataFilter)
                .enter()
                .append("circle")
                .attr("cx", data => xTimeScale(data.date))
                .attr("cy", data => yLinearScale(data.positive))
                .attr("r", "2")
                .attr("fill", "darkgrey")
                .attr("stroke-width", "1")
                .attr("stroke", "black");

            //////////////
            // tool tip //
            //////////////

            // Date formatter to display dates nicely
            var dateFormatter = d3.timeFormat("%d %B %Y");

            // number formatter for commas
            var numberFormat = function(d) {
                return d3.format(",")(d);
            }

            // Step 1: Initialize Tooltip
            var toolTip = d3.tip()
                .attr("class", "tooltip")
                .offset([80, -60])
                .html(function(data) {
                    return (`<h7><strong>${data.state}</strong></h7> | <h7><strong>${dateFormatter(data.date)}</strong></h7><br>
                    <h7>Confirmed cases: ${numberFormat(data.positive)}</h7><br>
                    <h7>New cases: ${numberFormat(data.positiveIncrease)}</h7><br>
                    <h7>Deaths: ${numberFormat(data.death)}</h7>`);
                });

            // Step 2: Create the tooltip in chartGroup.
            chartGroup2.call(toolTip);

            // Step 3: Create "mouseover" event listener to display tooltip
            circlesGroup2.on("mouseover", function(data) {
            toolTip.show(data, this);
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });
        }
            
        ///////////////////////////////////////////////////////////////////////
        // Event Listener - when button is changed, run updateChart function //
        ///////////////////////////////////////////////////////////////////////

        d3.select("#selState").on("change", function(d) {

            var selectedOption = d3.select(this).property("value")
            update(selectedOption);

        });
    });
};

///////////////////////////////////////////////
// click handler for filter states dropdown //
///////////////////////////////////////////////
d3.select("#selState").on("click", statePlots)

// function to clear plots
function clearPlots() {
    d3.selectAll(".line").remove();
    d3.selectAll("circle").remove();

}

///////////////////////////////////////////
// click handler for clear plots button //
//////////////////////////////////////////
d3.select("#selClear").on("click", clearPlots)

//////////////////////////////////
// national view button handler //
//////////////////////////////////
function handleButtonSelect() {
    d3.event.preventDefault();

    // // remove tick labels and y-label so it doesn't pile on top of each other making text hard to read
    // d3.selectAll(".tick").remove();
    // d3.selectAll(".y-label").remove();

    var national = d3.select('#selButton').node().value;
    console.log(national);

    nationalButtonSelected();
};

///////////////////////////////////////////////
// function to render graph of national view //
///////////////////////////////////////////////
function nationalButtonSelected() {
    d3.json(urlNat).then(function(nationalData) {
        nationalView();
    })
};

//////////////////////////////////////////////////////
// button handler to show national plot upon click //
//////////////////////////////////////////////////////
d3.select("#selButton").on("click", handleButtonSelect)

//////////////////////////////////////////////////////
//function for line plot of covid cases nationally //
//////////////////////////////////////////////////////
function nationalView() {
    // Load data from api covid cases national view
    d3.json(urlNat).then(function(nationalData) {

        // Print the data
        // console.log(nationalData);

        // Format the date and cast the total cases value to a number
        nationalData.forEach(function(data) {
            data.date = parseTime(data.date);
            data.positive = +data.positive;
        });

        // Configure a time scale with a range between 0 and the chartWidth
        var xTimeScale = d3.scaleTime()
            .range([0, chartWidth])
            .domain(d3.extent(nationalData, data => data.date));

        // Configure a linear scale with a range between the chartHeight and 0
        var yLinearScale = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, d3.max(nationalData, data => data.positive)]);

        // Create two new functions passing the scales in as arguments
        var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b"));
        var leftAxis = d3.axisLeft(yLinearScale);

        // Configure a drawLine function which will use our scales to plot the line's points
        var drawLine = d3
            .line()
            .x(data => xTimeScale(data.date))
            .y(data => yLinearScale(data.positive));

        // Append an SVG group element to the SVG area, create the left axis inside of it
        chartGroup.append("g")
            .attr("class", "axis-red")	
            .call(leftAxis)
            .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.3em")
                .attr("dy", ".01em")
                .attr("transform", "rotate(-40)")
            .call(leftAxis);
        
        // label y left axis
        chartGroup.append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chartHeight/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "rgb(255, 153, 0)")
            .text("Number of Cases - National level")

        // Append an SVG group element to the SVG area, create the bottom axis inside of it
        // Translate the bottom axis to the bottom of the page
        chartGroup.append("g")
            .classed("axis", true)
            .attr("transform", "translate(0, " + chartHeight + ")")
            .call(bottomAxis)
            .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

        // Append an SVG path and plot its points using the line function
        chartGroup.append("path")
            // The drawLine function returns the instructions for creating the line for milesData
            .attr("d", drawLine(nationalData))
            .classed("line", true)
            .attr("stroke", "rgb(255, 153, 0)")
            .attr("stroke-width", 2);

        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(nationalData)
            .enter()
            .append("circle")
            .attr("cx", data => xTimeScale(data.date))
            .attr("cy", data => yLinearScale(data.positive))
            .attr("r", "2")
            .attr("fill", "darkgrey")
            .attr("stroke-width", "1")
            .attr("stroke", "black");

    //////////////
    // tool tip //
    //////////////

    // Date formatter to display dates nicely
    var dateFormatter = d3.timeFormat("%d %B %Y");

    // number formatter for commas
    var numberFormat = function(d) {
        return d3.format(",")(d);
    }

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
        return (`<h7><strong>USA</strong></h7> | <h7><strong>${dateFormatter(data.date)}</strong></h7><br>
        <h7><strong>Confirmed cases:</strong> ${numberFormat(data.positive)}</h7><br>
        <h7><strong>New cases:</strong> ${numberFormat(data.positiveIncrease)}</h7><br>
        <h7><strong>Deaths:</strong> ${numberFormat(data.death)}</h7>`);
    });

    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });

    }).catch(function(error) {
        console.log(error);
        });
};