// set the dimensions and margins of the graph
const margin = {top: 130, right: 20, bottom: 50, left: 40};
const width = 450 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#viz_container")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 450 350")
    .attr("preserveAspectRatio", "xMinYMin")
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// parse the Data
d3.csv("https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/change_over_time/streamgraph_d3.csv", function(d) {
    const parseTime = d3.timeParse("%Y")
    return{
        year: parseTime(d.year),
        ["Refugees"]: +d.REF,
        ["Asylum-seekers"]: +d.ASY,
        ["IDPs"]: +d.IDPs,
        ["Stateless persons"]: +d.STA,
        ["Others of concern"]: +d.OOC,
        ["Venezuelans displaced abroad"]: +d.VDA
    }
})
.then(function(data){

// list of value keys
const typeKeys = ["Refugees", "Asylum-seekers", "IDPs", "Stateless persons", "Others of concern", "Venezuelans displaced abroad"]

// stack the data
const stack = d3.stack()
   .keys(typeKeys)
   .order(d3.stackOrderNone)
   .offset(d3.stackOffsetSilhouette)
const stackedData = stack(data)

// X scale and Axis
const xScale = d3.scaleTime()
  .domain(d3.extent(data, d => d.year)).nice()
  .range([0, width])
svg
  .append('g')
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScale).tickSize(0).tickPadding(8))
  .call(d => d.select(".domain").remove());

// Y scale and Axis
const formatter =  d3.format("~s")
const yScale = d3.scaleLinear()
    .domain([-60000000, 60000000])
    .range([height, 0]);
svg
  .append('g')
  .call(d3.axisLeft(yScale).ticks(9).ticks(7).tickSize(0).tickPadding(6).tickFormat(formatter))
  .call(d => d.select(".domain").remove());


// color palette
const color = d3.scaleOrdinal()
  .domain(typeKeys)
  .range(["#0072BC", "#18375F", "#00B398", "#E1CC0D","#999999","#EF4A60"])

// set vertical grid line
const GridLine = function() { return d3.axisBottom().scale(xScale)};
svg
  .append("g")
    .attr("class", "grid")
  .call(GridLine()
    .tickSize(height,0,0)
    .tickFormat("")
    .ticks(7)
);

const tooltip = svg
.append("text")
.attr("x", 3)
.attr("y", 10)
.style("opacity", 0)
.style("font-size", 11)

const mouseover = function(event,d) {
  tooltip.style("opacity", 1)
  d3.selectAll(".stackedArea").style("opacity", .2)
  d3.select(this)
    .style("opacity", 1)
}
const mousemove = function(event,d,i) {
  grp = d.key
  tooltip.text(grp)
}
const mouseleave = function(event,d) {
  tooltip.style("opacity", 0)
  d3.selectAll(".stackedArea").style("opacity", 1).style("stroke", "none")
 }

// create the areas
svg
  .selectAll("alllayer")
  .data(stackedData)
  .join("path")
    .attr("class", "stackedArea")
    .style("fill", d => color(d.key))
    .attr("d", d3.area()
       .x(d => xScale(d.data.year))
       .y0(d => yScale(d[0]))
       .y1(d => yScale(d[1]))
    )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

// set title
svg
  .append("text")
    .attr("class", "chart-title")
    .attr("x", -(margin.left)*0.65)
    .attr("y", -(margin.top)/1.5)
    .attr("text-anchor", "start")
  .text("Evolution of people of concern to UNHCR | 1991-2020")

// set Y axis label
svg
  .append("text")
    .attr("class", "chart-label")
    .attr("x", -(margin.left)*0.65)
    .attr("y", -(margin.top/8))
    .attr("text-anchor", "start")
  .text("Number of people (millions)")

// set source
svg
  .append("text")
    .attr("class", "chart-source")
    .attr("x", -(margin.left)*0.65)
    .attr("y", height + margin.bottom*0.7)
    .attr("text-anchor", "start")
  .text("Source: UNHCR Refugee Data Finder")

// set copyright
svg
  .append("text")
    .attr("class", "copyright")
    .attr("x", -(margin.left)*0.65)
    .attr("y", height + margin.bottom*0.9)
    .attr("text-anchor", "start")
  .text("©UNHCR, The UN Refugee Agency")

//set legend
svg
    .append("rect")
        .attr("x", -(margin.left)*0.6)
        .attr("y", -(margin.top/2))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#0072BC")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", -(margin.left)*0.6+20)
        .attr("y", -(margin.top/2.4))
    .text("Refugees")
svg
    .append("rect")
        .attr("x", 100)
        .attr("y", -(margin.top/2))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#18375F")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 120)
        .attr("y", -(margin.top/2.4))
    .text("Asylum-seekers")
svg
    .append("rect")
        .attr("x", 230)
        .attr("y", -(margin.top/2))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#00B398")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 250)
        .attr("y", -(margin.top/2.4))
    .text("IDPs")
svg
    .append("rect")
        .attr("x", 100)
        .attr("y", -(margin.top/2.8))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#999999")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", -(margin.left)*0.6+20)
        .attr("y", -(margin.top/3.5))
    .text("Stateless persons")
svg
    .append("rect")
        .attr("x", -(margin.left)*0.6)
        .attr("y", -(margin.top/2.8))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#E1CC0D")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 120)
        .attr("y", -(margin.top/3.5))
    .text("Others of concern")
svg
    .append("rect")
        .attr("x", 230)
        .attr("y", -(margin.top/2.8))
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", "#EF4A60")
svg
    .append("text")
        .attr("class", "legend")
        .attr("x", 250)
        .attr("y", -(margin.top/3.5))
    .text("Venezuelans displaced abroad")
})