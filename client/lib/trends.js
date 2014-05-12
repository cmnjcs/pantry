
// global variables galore
var current_tab = "spending";
var interestContext = null;
var ChartObject = null;

// creates an array of length len populated with value value
function fillArray(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

// week select function
function week_select (e) {
    e.preventDefault()

    // need to calculate how far back to look
    // get current date and subtract 7 days (604800000 ms)
    var today = new Date();
    var today_ms = Date.parse(today); // get today in ms since sometime in 1970
    var past_ms = today_ms - 604800000;
    var past = new Date(past_ms);
    past.setHours(0)    // set them all to 0 to make comparisons easier
    past.setMinutes(0)
    past.setSeconds(0)
    past.setMilliseconds(0)
    // based on currently selected tab, selector is going to vary
    var data_pointer = null;
    var data_prep = fillArray(0, 7); // variable that will become the data field in the computed_data structure
    if(current_tab == "spending") {
        data_pointer = Items.find()
        data_pointer.forEach(function (item) {
            // console.log(item)
            // console.log("item name is " + item.date_acquired)
            var year_acq = item.date_acquired.substring(0,4)
            var month_acq = parseInt(item.date_acquired.substring(5,7)) - 1
            var day_acq = item.date_acquired.substring(8,10)
            var item_date = new Date(year_acq, month_acq, day_acq)
            // console.log(item_date)
            if(item_date > past) {  // if the item was acquired recently enough to be of interest
                var difference = Math.floor(((new Date()) - item_date) / 86400000)  // difference is the number of days in the past
                // console.log(difference);
                data_prep[difference] = data_prep[difference] + item.ppi * item.quantity
            }
            // console.log(data_prep)
            
        })
    } else if (current_tab == "stock") {

    } else if (current_tab == "waste") {

    } else {
        alert("error! error! D: wahhh")
    }

    data_prep.reverse()

    var data = {
        labels : ["6 days","5 days","4 days","3 days","2 days","1 day","today"],
        datasets : [
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : data_prep
        }
        ]
    }

    var total_spent = data_prep.reduce(function(a, b) {
        return a + b;
    });

    $("#chart").attr('width', '300px');
    $("#chart").attr('height', '300px');

    ChartObject.Line(data);

    $("#spendingLabel").html("Spent $".concat(total_spent.toFixed(2)));
    $("#stockLabel").html("Had 17 items");
    $("#wasteLabel").html("Lost $43");
    $("#dropdown_title").html("Past week");

}

// month select function
function month_select (e) {
    e.preventDefault()

    // need to calculate how far back to look
    // get current date and subtract 28 days (2419000000 ms)
    var today = new Date();
    var today_ms = Date.parse(today); // get today in ms since sometime in 1970
    var past_ms = today_ms - 2419000000;
    var past = new Date(past_ms);
    past.setHours(0)    // set them all to 0 to make comparisons easier
    past.setMinutes(0)
    past.setSeconds(0)
    past.setMilliseconds(0)
    // based on currently selected tab, selector is going to vary
    var data_pointer = null;
    var data_prep = fillArray(0, 29); // variable that will become the data field in the computed_data structure
    if(current_tab == "spending") {
        data_pointer = Items.find()
        data_pointer.forEach(function (item) {
            console.log(item)
            // console.log("item name is " + item.date_acquired)
            var year_acq = item.date_acquired.substring(0,4)
            var month_acq = parseInt(item.date_acquired.substring(5,7)) - 1
            var day_acq = item.date_acquired.substring(8,10)
            var item_date = new Date(year_acq, month_acq, day_acq)
            console.log(item_date)
            if(item_date > past) {  // if the item was acquired recently enough to be of interest
                var difference = Math.floor(((new Date()) - item_date) / 86400000)  // difference is the number of days in the past
                console.log(difference);
                data_prep[difference] = data_prep[difference] + item.ppi * item.quantity
            }
            console.log(data_prep)
            
        })
    } else if (current_tab == "stock") {

    } else if (current_tab == "waste") {

    } else {
        alert("error! error! D: wahhh")
    }

    var data = {
        labels : ['4 weeks','','','','','','','3 weeks','','','','','','','2 weeks','','','','','','','1 week','','','','','','','today'],
        datasets : [
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : data_prep
        }
        ]
    }

    data_prep.reverse()
    console.log(data.labels.length)

    var total_spent = data_prep.reduce(function(a, b) {
        return a + b;
    });

    $("#chart").attr('width', '300px');
    $("#chart").attr('height', '300px');

    ChartObject.Line(data);

    $("#spendingLabel").html("Spent $".concat(total_spent.toFixed(2)));
    $("#stockLabel").html("Had 17 items");
    $("#wasteLabel").html("Lost $43");
    $("#dropdown_title").html("Past week");

}

// three month select function
function threeMonth_select (e) {
    e.preventDefault()

    // need to calculate how far back to look
    // get current date and subtract 84 days (7258000000 ms)
    var today = new Date();
    var today_ms = Date.parse(today); // get today in ms since sometime in 1970
    var past_ms = today_ms - 7258000000;
    var past = new Date(past_ms);
    past.setHours(0)    // set them all to 0 to make comparisons easier
    past.setMinutes(0)
    past.setSeconds(0)
    past.setMilliseconds(0)
    // based on currently selected tab, selector is going to vary
    var data_pointer = null;
    var data_prep = fillArray(0, 3); // variable that will become the data field in the computed_data structure
    if(current_tab == "spending") {
        data_pointer = Items.find()
        data_pointer.forEach(function (item) {
            console.log(item)
            // console.log("item name is " + item.date_acquired)
            var year_acq = item.date_acquired.substring(0,4)
            var month_acq = parseInt(item.date_acquired.substring(5,7)) - 1
            var day_acq = item.date_acquired.substring(8,10)
            var item_date = new Date(year_acq, month_acq, day_acq)
            console.log(item_date)
            if(item_date > past) {  // if the item was acquired recently enough to be of interest
                var difference = Math.floor(((new Date()) - item_date) / 86400000)  // difference is the number of days in the past
                difference = Math.floor(difference/28)
                console.log(difference)
                data_prep[difference] = data_prep[difference] + item.ppi * item.quantity
            }
            console.log(data_prep)
            
        })
    } else if (current_tab == "stock") {

    } else if (current_tab == "waste") {

    } else {
        alert("error! error! D: wahhh")
    }

    var data = {
        labels : ['2 months','1 month','this month'],
        datasets : [
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : data_prep
        }
        ]
    }

    data_prep.reverse()
    console.log(data.labels.length)

    var total_spent = data_prep.reduce(function(a, b) {
        return a + b;
    });

    $("#chart").attr('width', '300px');
    $("#chart").attr('height', '300px');

    ChartObject.Line(data);

    $("#spendingLabel").html("Spent $".concat(total_spent.toFixed(2)));
    $("#stockLabel").html("Had 17 items");
    $("#wasteLabel").html("Lost $43");
    $("#dropdown_title").html("Past week");

}


//$(document).ready(function () {
Template.trends.rendered = function () {
    interestContext = $("#chart").get(0).getContext("2d");
    ChartObject = new Chart(interestContext);

    // all the odds and ends
	var dropdown = $("#timeSelectDropdown");
	//$("#timeSelectDropdownMenu").offset({left: dropdown.offset().left});
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
    $('#weekSelect').click(week_select)
    $('#monthSelect').click(month_select)
    $('#threeMonthSelect').click(threeMonth_select)
    /*
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
    */
    //ChartObject.Line(data);

    $("#spendingLabel").html("Spent $43")
    $("#stockLabel").html("Had 17 items")
    $("#wasteLabel").html("Lost $43")
    $("#dropdown_title").html("Past week");


    var data = {
        labels : ["6 days","5 days","4 days","3 days","2 days","1 day","today"],
        datasets : [
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : [7,6,5,4,3,2,1]
        }
        ]
    }

    $("#chart").attr('width', '300px');
    $("#chart").attr('height', '300px');

    ChartObject.Line(data);
};