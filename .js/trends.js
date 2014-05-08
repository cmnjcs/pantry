
// global variables galore
var current_tab = null;
var interestContext = $("#chart").get(0).getContext("2d");
var ChartObject = new Chart(interestContext);

// week select function
function week_select (e) {
    e.preventDefault()
    // generate graph data here
    var computed_data = []
    // need to calculate how far back to look
    // get current date and subtract 7 days (604800000 ms)
    var today = new Date();
    var today_ms = Date.parse(today); // get today in ms since sometime in 1970
    var past_ms = today_ms - 604800000;
    var past = new Date(past_ms);
    // based on currently selected tab, selector is going to vary
    var data_pointer = items.find({});
    if(current_tab == "spending") {
        
    } else if (current_tab == "stock") {

    } else if (current_tab == "waste") {

    } else {
        alert("error! error! D: wahhh")
    }

    var data = {
        labels : ["6 days","5 days","4 days","3 days","2 days","1 day","today"],
        datasets : [
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : computed_data
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


}


$(document).ready(function () {
    // all the odds and ends
	var dropdown = $("#timeSelectDropdown");
	$("#timeSelectDropdownMenu").offset({left: dropdown.offset().left});
    $('#timeOptions li').on('click', function() {
        $('#dropdown_title').html("Last ".concat($(this).find('a').html()));
    });
    $("#chart").attr('width', '300px');
    $("#chart").attr('height', '300px');

    // code for handling tab switches
    // needs to call timeframe select method upon switch
    $('#spending').click(function (e) {
    	e.preventDefault()
        current_tab = "spending"
    	$(this).tab('show')
    })
    $('#stock').click(function (e) {
    	e.preventDefault()
        current_tab = "stock"
    	$(this).tab('show')
    })
    $('#waste').click(function (e) {
    	e.preventDefault()
        current_tab = "waste"
    	$(this).tab('show')
    })
    $('#weekSelect').click()
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

    ChartObject.Line(data);

    $("#spendingLabel").html("Spent $43")
    $("#stockLabel").html("Had 17 items")
    $("#wasteLabel").html("Lost $43")
    $("#dropdown_title").html("Past week");
});