var values = []; //hold all the data
var result = []; //hold the filtered data
var colors = ['red', 'green', 'blue', 'orange', 'yellow']; //Random array of colors
var url = "https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf&limit=100";
var x = '2020';
var y;
var svg;
var height;

  fetchCrimeData = async () => {
  await fetch(url)
  .then(result => result.json())
  .then((dataset) => {
    values = [];
    CrimeData = dataset.result.records;
    for (var i = 0; i < CrimeData.length; i++){
      values.push({offence: CrimeData[i].level_2, 
        value: CrimeData[i].value, 
        year: CrimeData[i].year});
      }
      return values;
    })    
    .catch(function(error) {
      console.log(error);
    });
  }
  
  // set the dimensions and margins of the graph
  async function DrawAxes(){
    await fetchCrimeData();

    svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

    var margin = {top: 10, right: 20, bottom: 20, left: 60},
    width = 1700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  
    // append the svg object to the body of the page
    svg = d3.select("#myChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
  
    // X axis
    x = d3.scaleBand()
    .range([ 0, width ])
    .domain(values.map(function(d) { return d.offence; }))
    .padding(0.1);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    
    // Add Y axis
   y = d3.scaleLinear()
   .domain([0, 17000])
   .range([ height, 0]);
   svg.append("g")
   .attr("class", "myYaxis")
   .call(d3.axisLeft(y));
  }
  
  // A function that create / update the plot for a given variable:
  async function update(year) {
    await fetchCrimeData();
    result = values.filter(x => x.year == year);

    //Remove the old bar when updating
    d3.selectAll(".bar").remove();

    var u = svg.selectAll("rect")
    .data(result)

  u
    .enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
    .attr("x", function(d) { return x(d.offence) +40; })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", "65")
    .attr("height", function(d) { return 570 - y(d.value); })
    .attr("fill", "black")


   // Add interaction
   svg.selectAll("rect")
   .on("mouseover", function (d) {
     //Return a random color during mouseover
    d3.select(this).attr("fill", colors[Math.floor(Math.random() * colors.length)]);
  })
  .on("mouseout", function () {
    d3.select(this).attr("fill", "black");
  });


    //Add text to the bars
    svg.selectAll("text.bar")
    .data(result)
    .enter()
    .append("text")
    .attr("class", "bar")
    .attr("text-anchor", "middle")
    .attr("x", function(d) { return x(d.offence) + 65; })
    .attr("y", function(d) { return y(d.value) - 10; })
    .text(function(d) { return d.value; })
    .style("fill", "black")
    .style("font-size", "150%")
}

//For the first time when the page loads
DrawAxes();
update(x);


function UpdateChart() {
var x = document.getElementById("year").value;
update(x);
} 