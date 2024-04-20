# Data-Analysis-with-Java-Script
console.log("=== Rice Production Analysis for Chhattisgarh (1966-1969) ===");

// Calculate total rice production
var totalProduction = riceData.reduce(function(total, d) {
    return total + d["RICE PRODUCTION (1000 tons)"];
}, 0);
console.log("Total Rice Production (1966-1969):", totalProduction.toFixed(2), "thousand tons");

// Calculate average rice production per year
var averageProduction = totalProduction / riceData.length;
console.log("Average Rice Production per Year:", averageProduction.toFixed(2), "thousand tons");

// Find the year with the highest production
var maxProductionYearData = riceData.reduce(function(max, d) {
    return max["RICE PRODUCTION (1000 tons)"] > d["RICE PRODUCTION (1000 tons)"] ? max : d;
}, {});
console.log("Year with Highest Rice Production:", maxProductionYearData.Year, "(", maxProductionYearData["RICE PRODUCTION (1000 tons)"].toFixed(2), "thousand tons)");

// Find the year with the lowest production
var minProductionYearData = riceData.reduce(function(min, d) {
    return min["RICE PRODUCTION (1000 tons)"] < d["RICE PRODUCTION (1000 tons)"] ? min : d;
}, {});
console.log("Year with Lowest Rice Production:", minProductionYearData.Year, "(", minProductionYearData["RICE PRODUCTION (1000 tons)"].toFixed(2), "thousand tons)");

// Additional insights or analysis can be logged here

console.log("=== End of Analysis ===");
