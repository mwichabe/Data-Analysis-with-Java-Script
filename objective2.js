d3.csv("indian_agriculture_dataset.csv").then(function (agricultureData) {
    agricultureData.forEach(function (d) {
      d.Year = +d.Year;
    });
  
    // Load global inflation dataset
    d3.csv("global_inflation_data.csv").then(function (inflationData) {
      // Convert year and inflation rate to numbers
      inflationData.forEach(function (d) {
        Object.keys(d).forEach(function (key) {
          if (key !== "country_name" && key !== "indicator_name") {
            d[key] = +d[key];
          }
        });
      });
  
      // Merge datasets based on the common attribute (Year)
      var mergedData = [];
      agricultureData.forEach(function (agriItem) {
        var correspondingInflation = inflationData.find(function (inflationItem) {
          return inflationItem.country_name === agriItem.Country && inflationItem.indicator_name === "Annual average inflation (consumer prices) rate";
        });
        if (correspondingInflation) {
          // Merge the data
          var mergedItem = Object.assign({}, agriItem, correspondingInflation);
          mergedData.push(mergedItem);
        }
      });
  
      // Perform analysis
      // Calculate correlation coefficients
      function calculateCorrelation(dataX, dataY) {
        const meanX = d3.mean(dataX);
        const meanY = d3.mean(dataY);
        const deviationX = d3.deviation(dataX);
        const deviationY = d3.deviation(dataY);
        
        const covariance = d3.mean(dataX.map((d, i) => (d - meanX) * (dataY[i] - meanY)));
        
        return covariance / (deviationX * deviationY);
      }
  
      // Compute correlation coefficients
      var correlationProduction = calculateCorrelation(
        mergedData.map((d) => d["Annual average inflation (consumer prices) rate"]),
        mergedData.map((d) => d.Production)
      );
      var correlationInputCosts = calculateCorrelation(
        mergedData.map((d) => d["Annual average inflation (consumer prices) rate"]),
        mergedData.map((d) => d.InputCosts)
      );
      var correlationProfits = calculateCorrelation(
        mergedData.map((d) => d["Annual average inflation (consumer prices) rate"]),
        mergedData.map((d) => d.Profits)
      );
  
      console.log(
        "Correlation coefficient between inflation rate and crop production:",
        correlationProduction
      );
      console.log(
        "Correlation coefficient between inflation rate and input costs:",
        correlationInputCosts
      );
      console.log(
        "Correlation coefficient between inflation rate and profits:",
        correlationProfits
      );
    // Scatter plot for crop production vs. inflation rate
    var margin = { top: 20, right: 30, bottom: 30, left: 60 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3
      .scaleLinear()
      .domain([
        d3.min(mergedData, (d) => d.InflationRate),
        d3.max(mergedData, (d) => d.InflationRate),
      ])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3
      .scaleLinear()
      .domain([
        d3.min(mergedData, (d) => d.Production),
        d3.max(mergedData, (d) => d.Production),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("g")
      .selectAll("dot")
      .data(mergedData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.InflationRate);
      })
      .attr("cy", function (d) {
        return y(d.Production);
      })
      .attr("r", 3)
      .style("fill", "#69b3a2");
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 10)
      .text("Inflation Rate");
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -margin.top)
      .text("Crop Production");
  });
});
