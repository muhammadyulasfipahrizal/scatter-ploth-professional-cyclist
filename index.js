const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

let values = [];

let xScale;
let yScale;

const width = 800;
const height = 600;
const padding = 80;

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

function drawCanvas() {
  svg.attr("width", width).attr("height", height);
}

function generateScales() {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(values, (d) => d["Year"] - 1),
      d3.max(values, (d) => d["Year"] + 1),
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(values, (d) => new Date(d["Seconds"] * 1000 - 10000)),
      d3.max(values, (d) => new Date(d["Seconds"] * 1000 + 10000)),
    ])
    .range([padding, height - padding]);
}

function drawPoint() {
  svg
    .selectAll("circle")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d["Year"])
    .attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000))
    .attr("cx", (d) => xScale(d["Year"]))
    .attr("cy", (d) => yScale(new Date(d["Seconds"] * 1000)))
    .attr("r", 5)
    .attr("fill", (d) => {
      if (d["Doping"]) {
        return "lightblue";
      } else {
        return "orange";
      }
    })
    .on("mouseover", (d) => {
      tooltip
        .attr("data-year", d["Year"])
        .style("left", d3.event.pageX + 15 + "px")
        .style("top", d3.event.pageY - 30 + "px")
        .style("visibility", "visible");
      if (d["Doping"]) {
        tooltip.text(
          `${d["Name"]}: ${d["Nationality"]} | Year: ${d["Year"]} | Time: ${d["Time"]} | ${d["Doping"]}`
        );
      } else {
        tooltip.text(
          `${d["Name"]}: ${d["Nationality"]} | Year: ${d["Year"]} | Time: ${d["Time"]} | No doping allegations!`
        );
      }
    })
    .on("mouseout", (d) => tooltip.transition().style("visibility", "hidden"));
}

function generateAxes() {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("text")
    .attr("id", "x-axis-label")
    .attr("y", height - 25)
    .attr("x", width / 2)
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Year");

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);

  svg
    .append("text")
    .attr("id", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - height / 2)
    .attr("dy", "0.9em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Time in Minutes");
}

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    values = data;
    console.log(values);
    drawCanvas();
    generateScales();
    drawPoint();
    generateAxes();
  });