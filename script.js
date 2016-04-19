var data_set = undefined;
var svg = undefined;

function output(info) {
	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
	
	if(svg == undefined) {
		 svg = d3.select('svg')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}
	
    var scale_for_x = d3.scale.linear().domain([0, 500]).range([0, width]),
    scale_for_y = d3.scale.linear().domain([0, 500]).range([height, 0]);
	
	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(scale_for_x).orient("bottom").ticks(5))
	  .append("text")
	  .attr("class", "label")
	  .attr("font-family", "Verdana")
	  .attr("font-size", "10")
	  .attr("id", "x-text")
	  .attr("x", width)
	  .attr("y", -6)
	  .style("text-anchor", "end")
      .text(d3.select('#sel-x').node().value);
	
	svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(scale_for_y).orient("left").ticks(5))
	  .append("text")
	  .attr("class", "label")
	  .attr("font-family", "Verdana")
	  .attr("font-size", "10")
	  .attr("id", "y-text")
	  .attr("dy", ".71em")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .style("text-anchor", "end")
      .text(d3.select('#sel-y').node().value);
	
	var x_value = function(d) {return d[d3.select('#sel-x').node().value];},
	y_value = function(d) {return d[d3.select('#sel-y').node().value];};
	
	var circles = svg.selectAll('circle').data(info);
	
	circles.enter().append('circle');

	circles.attr("r", 2.5)
      .attr("cx", function(d) {return scale_for_x(x_value(d));})
      .attr("cy", function(d) {return scale_for_y(y_value(d));})
	  .style("fill", "black")
	  .on('mouseover', function(d) {
		  var hovered = d3.select('#hovered').node();
		  hovered.textContent = d.name;
	  });

	circles.exit().remove();
	
}

function populateDropdownList(keys) {
	
	var name_index = keys.indexOf('name');
	keys.splice(name_index, 1);
	var origin_index = keys.indexOf('origin');
	keys.splice(origin_index, 1);
	
	var sel_x = d3.select('#sel-x');
	var sel_y = d3.select('#sel-y');
	
	var all_x_options = sel_x.selectAll('option').data(keys);
	var all_y_options = sel_y.selectAll('option').data(keys.reverse());
	
	all_x_options.enter().append('option').attr('value', function(d) { return d; }).text(function (d) { return d; });
	all_y_options.enter().append('option').attr('value', function(d) { return d; }).text(function (d) { return d; });
	
}

function changeDimension() {
	
	var sel_x = d3.select('#sel-x').node().value;
	var sel_y = d3.select('#sel-y').node().value;

	d3.select('svg').selectAll(".x.axis").selectAll("text.label").text(sel_x);
	d3.select('svg').selectAll(".y.axis").selectAll("text.label").text(sel_y);
	
	if(sel_x != sel_y) {
		if(typeof data_set == undefined) {
			renderScatterPlot('car.csv');
		} else {
			output(data_set);
		}
	} else {
		alert("Invalid input");
	}
	
}

function queryMPG() {
	
	if(data_set == undefined) {
		alert("Data required to render scatterplot is not properly loaded");
	} else {
		var sel_x = d3.select('#sel-x').node().value;
		var sel_y = d3.select('#sel-y').node().value;
		
		var mpg_min = +d3.select("#mpg-min").node().value;
		var mpg_max = +d3.select("#mpg-max").node().value;
		
		if(sel_x != "mpg" && sel_y != "mpg") {
			alert("MPG dimension is not selected")
		} else {
			var data = []
			for(var i=0; i<data_set.length; i++) {
				var value = +data_set[i]["mpg"];
				if(value >= mpg_min && value <= mpg_max) {
					data.push(data_set[i]);
				}
			}
			output(data);
		}
	}
	
}

function renderScatterPlot(file_name) {
	
	d3.csv(file_name, function(error, data) {
		data_set = data;
		populateDropdownList(Object.keys(data[0]));
		output(data);
	});
	
}

$(document).ready(function() {
	renderScatterPlot('car.csv');
	
	d3.select('#sel-x')
	.on('change', changeDimension);
	
	d3.select('#sel-y')
	.on('change', changeDimension);
	
	d3.select('#update')
	.on("click", queryMPG);
});