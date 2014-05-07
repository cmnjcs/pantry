Items = new Meteor.Collection("items");

if (Meteor.isClient) {
  /* INVENTORY */
  Template.inventory.items = function () {
    return Items.find({}, {sort: { exp_date: 1}});
  };
	
  Template.inventory.quality = function (exp_date) {
	  console.log(exp_date);
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		var today = new Date();
		var exp = new Date(exp_date);

		var diffDays = Math.round((exp.getTime() - today.getTime())/oneDay);
		console.log(diffDays);
    if (diffDays <= 0) {
			return "bad";
		} else if (diffDays <= 3) {
			return "okay";
		} else {
			return "good";
		}
  };
	
	/* ADD */
	Template.add.events({
			'submit': function () {
					var name = $('#itemName').val();
					var quantity = $('#txtQuantity').val();
					var cost = $('#txtCost').val();
					var expDate = $('#expDate').val();
					console.log(expDate);
					item = {uid: this.userId,
                            name: name,
                            date_acquired: new Date(),
                            exp_date: expDate,
                            quantity: quantity,
                            ppi: cost / quantity,
                            status: 'in_stock'
                         };
					Items.insert(item);
			}
	})
	
	/* COMMON */
	Handlebars.registerHelper('some_helper', function() {
     // code
	});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
		if (Items.find().count() === 0) {
			Items.insert({
				name: "apple", 
				exp_date: "2014-04-16", 
				quantity: 1, 
				ppi: .9, 
				status: "stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-04-10",
				img_src: "images/apple.jpg"});
			Items.insert({
				name: "banana", 
				exp_date: "2014-04-17", 
				quantity: 2, 
				ppi: .9, 
				status: "stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-04-10",
				img_src: "images/banana.jpg"});
		}
  });
}

Router.map(function() {
    this.route('home', {path: '/'});
    this.route('add');
    this.route('inventory');
    this.route('camera');
    this.route('trends');
})