// Define SVG area dimensions
var svgWidth = 400;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#plot-cases")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%Y%m%d");

// json url
var url = "https://covidtracking.com/api/us/daily";

// Load data from miles-walked-this-month.csv
d3.json(url).then(function(nationalData) {

    // Print the milesData
    console.log(nationalData);

    
    // Format the date and cast the total cases value to a number
    nationalData.forEach(function(data) {
        data.date = parseTime(data.date);
        data.total = +data.total;
        // console.log(data.date)
        // console.log(data.total)
    });

    // Configure a time scale with a range between 0 and the chartWidth
    // Set the domain for the xTimeScale function
    // d3.extent returns the an array containing the min and max values for the property specified
    var xTimeScale = d3.scaleTime()
        .range([0, chartWidth])
        .domain(d3.extent(nationalData, data => data.date));

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the xLinearScale function
    var yLinearScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, d3.max(nationalData, data => data.total)]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b"));
    var leftAxis = d3.axisLeft(yLinearScale);

    // Configure a drawLine function which will use our scales to plot the line's points
    var drawLine = d3
        .line()
        .x(data => xTimeScale(data.date))
        .y(data => yLinearScale(data.total));

    // Append an SVG group element to the SVG area, create the left axis inside of it
    chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);

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
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(nationalData)
        .enter()
        .append("circle")
        .attr("cx", data => xTimeScale(data.date))
        .attr("cy", data => yLinearScale(data.total))
        .attr("r", "2")
        .attr("fill", "purple")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

  //////////////
  // tool tip //
  //////////////

  // Date formatter to display dates nicely
  var dateFormatter = d3.timeFormat("%d %b %Y");

  // number formatter for commas
  var numberFormat = function(d) {
    return d3.format(",")(d);
}

  // Step 1: Initialize Tooltip
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(data) {
    return (`<h7>${dateFormatter(data.date)}</h7><br><h7>Confirmed cases: ${numberFormat(data.total)}</h7>`);
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
