// Define SVG area dimensions
var svgWidth = 400;
var svgHeight = 600;

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
  var bottomAxis = d3.axisBottom(xTimeScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Configure a drawLine function which will use our scales to plot the line's points
  var drawLine = d3
    .line()
    .x(data => xTimeScale(data.date))
    .y(data => yLinearScale(data.total));

  // Append an SVG path and plot its points using the line function
  chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for milesData
    .attr("d", drawLine(nationalData))
    .classed("line", true);

  // Append an SVG group element to the SVG area, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

  // Append an SVG group element to the SVG area, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis);

  //////////////
  // tool tip //
  //////////////
  var focus = chartGroup.append("g")
    .attr("class", "focus")
    .style("display", "none");

  // add circle and rectangle box to focus point on line
  focus.append("circle")
    .attr("r", 4);

  focus.append("rect")
    .attr("class", "toolip")
    .attr("width", 100)
    .attr("height", 50)
    .attr("x", 10)
    .attr("y", -22)
    .attr("rx", 4)
    .attr("ry", 4);

  // append text to tooltip
  focus.append("text")
    .attr("class", "tooltip-date")
    .attr("x", 18)
    .attr("y", -2);

  focus.append("text")
    .attr("x", 18)
    .attr("y", 18)
    .text("Number of positive cases:");

  focus.append("text")
    .attr("class", "tooltip-total")
    .attr("x", 60)
    .attr("y", 18);
    
    function mousemove() {
        var x0 = xTimeScale.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data  [i-1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1:d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.total) + ")");
        focus.select(".tooltip-date").text(dateFormatter(d.date));
        focus.select(".tooltip-total").text(formatValue(d.total));
    }
  chartGroup.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() {
        focus.style("display", null);
    })
    .on("mouseout", function() {
        focus.style("display", "none");
    })
    .on("mousemove", mousemove);

  







}).catch(function(error) {
  console.log(error);
});
