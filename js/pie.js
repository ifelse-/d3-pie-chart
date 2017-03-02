// margin
const margin = {top: 20, right: 20, bottom: 20, left: 20},
	  width = 500 - margin.right - margin.left,
	  height = 500 - margin.top - margin.bottom,
	  radius = width/2;

// color range
let color = d3.scaleOrdinal()
    .range(["#C0504E", "#90CAF9", "#9ABA56","#FF9900", "#694E82", "#A84542"]);

// pie chart arc. Need to create arcs before generating pie
let arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

// donut chart arc
let arc2 = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

// arc for the labels position
let labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

// generate pie chart and donut chart
let pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.users; });
	

let donut = d3.pie()
    .sort(null)
    .value(function(d) { return d.usage; });	

// define the svg for pie chart
let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// define the svg donut chart
let svg2 = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// import data 
d3.csv("devices.csv", function(error, data) {
  if (error) throw error;
    
    // parse data
    data.forEach(function(d) {
		
        d.users = +d.users;
        d.devices = d.devices;
				
    })

  // "g element is a container used to group other SVG elements"
  let g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  // append path 
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.devices); })
    // transition 
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attrTween("d", tweenPie);
        
  // append text
  g.append("text")
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.devices + ' '+ d.data.users + '%'; });
    
    
})

// import data 
d3.csv("usage.csv", function(error, data) {
  if (error) throw error;
    
    // parse data
    data.forEach(function(d) {
		
		d.browsers = d.browsers;
        d.usage = +d.usage;
		
    })

    

    // "g element is a container used to group other SVG elements"
  let g2 = svg2.selectAll(".arc2")
      .data(donut(data))
    .enter().append("g")
      .attr("class", "arc2");

   // append path 
  g2.append("path")
      .attr("d", arc2)
      .style("fill", function(d) { return color(d.data.browsers); })
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attrTween("d", tweenDonut);
        
   // append text
  g2.append("text")
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.browsers + ' '+ d.data.usage+ '%'; });
    
});


// Helper function for animation of pie chart and donut chart
function tweenPie(b) {
  b.innerRadius = 0;
  let i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc(i(t)); };
}

function tweenDonut(b) {
  b.innerRadius = 0;
  let i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc2(i(t)); };
}
