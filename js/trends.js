
$(document).ready(function () {
	var dropdown = $("#timeSelectDropdown");
	$("#timeSelectDropdownMenu").offset({left: dropdown.offset().left});
});



// goes here so that all the on-click methods can get the canvas references
var interestContext = $("#chart").get(0).getContext("2d");
var ChartObject = new Chart(interestContext);

$("#navbar").load("./navbar.html");
$("#nav_add").addClass("active"); // TODO: make this line work
$(document).ready(function() {
$('#spending').click(function (e) {
	e.preventDefault()
	$(this).tab('show')
})
$('#stock').click(function (e) {
	e.preventDefault()
	$(this).tab('show')
})
$('#waste').click(function (e) {
	e.preventDefault()
	$(this).tab('show')
})
$('#weekSelect').click(function (e) {
	e.preventDefault()
    // generate graph data here
    var data = {
    	labels : ["6 days","","","","2 days","","today"],
    	datasets : [
    	{
    		fillColor : "rgba(151,187,205,0.5)",
    		strokeColor : "rgba(151,187,205,1)",
    		pointColor : "rgba(151,187,205,1)",
    		pointStrokeColor : "#fff",
    		data : [28,48,40,19,96,27,100]
    	}
    	]
    }

    $("#chart").attr('width', '300px');
    $("#chart").attr('height', '300px');

    ChartObject.Line(data);

    $("#spendingLabel").html("Spent $43");
    $("#stockLabel").html("Had 17 items");
    $("#wasteLabel").html("Lost $43");
    $("#dropdown_title").html("Past week");


})
$('#monthSelect').click(function (e) {
	e.preventDefault()
                    // generate graph data here
                    var data = {
                    	labels : ["1 month","3 weeks","2 weeks","1 week","today"],
                    	datasets : [
                    	{
                    		fillColor : "rgba(151,187,205,0.5)",
                    		strokeColor : "rgba(151,187,205,1)",
                    		pointColor : "rgba(151,187,205,1)",
                    		pointStrokeColor : "#fff",
                    		data : [80,50,23,11,43]
                    	}
                    	]
                    }
                    ChartObject.Line(data);

                    $("#spendingLabel").html("Spent $163");
                    $("#stockLabel").html("Had 33 items");
                    $("#wasteLabel").html("Lost $45");
                    $("#dropdown_title").html("Past month");

                })
$('#threeMonthSelect').click(function (e) {
	e.preventDefault()
                    // generate graph data here
                    var data = {
                    	labels : ["3 months","2 months","1 month","today"],
                    	datasets : [
                    	{
                    		fillColor : "rgba(151,187,205,0.5)",
                    		strokeColor : "rgba(151,187,205,1)",
                    		pointColor : "rgba(151,187,205,1)",
                    		pointStrokeColor : "#fff",
                    		data : [80,70,95,44,12]
                    	}
                    	]
                    }
                    ChartObject.Line(data);

                    $("#spendingLabel").html("Spent $344");
                    $("#stockLabel").html("Had 65 items");
                    $("#wasteLabel").html("Lost $99");
                    $("#dropdown_title").html("Past 3 months");
                })
$('#timeOptions li').on('click', function() {
	$('#dropdown_title').html("Last ".concat($(this).find('a').html()));
});

var data = {
	labels : ["6 days","","","","2 days","","today"],
	datasets : [
	{
		fillColor : "rgba(151,187,205,0.5)",
		strokeColor : "rgba(151,187,205,1)",
		pointColor : "rgba(151,187,205,1)",
		pointStrokeColor : "#fff",
		data : [28,48,40,19,96,27,100]
	}
	]
}

$("#chart").attr('width', '300px');
$("#chart").attr('height', '300px');

ChartObject.Line(data);

$("#spendingLabel").html("Spent $43")
$("#stockLabel").html("Had 17 items")
$("#wasteLabel").html("Lost $43")
$("#dropdown_title").html("Past week");
});