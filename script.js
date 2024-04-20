d3.csv("indian_agriculture_dataset.csv").then(function(data) {
    // Filter data for a specific crop (e.g., RICE)
    var riceData = data.filter(function(d) {
        return d["Dist Name"] === "Durg" && d["State Name"] === "Chhattisgarh";
    });

    // Convert string values to numbers
    riceData.forEach(function(d) {
        d.Year = +d.Year;
        d["RICE PRODUCTION (1000 tons)"] = +d["RICE PRODUCTION (1000 tons)"];
    });

    // Set up the dimensions for the chart
    var margin = { top: 20, right: 30, bottom: 30, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain(d3.extent(riceData, function(d) { return d.Year; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(riceData, function(d) { return d["RICE PRODUCTION (1000 tons)"]; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add line
    svg.append("path")
        .datum(riceData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(d["RICE PRODUCTION (1000 tons)"]); })
        );
    
    // Add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Rice Production in Chhattisgarh (1966-1969)");

    // Add X axis label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Rice Production (1000 tons)");

});
