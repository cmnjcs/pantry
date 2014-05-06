Items = new Meteor.Collection("items");

if (Meteor.isClient) {
  Template.inventory.items = function () {
    return Items.find({});
  };
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