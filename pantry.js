Items = new Meteor.Collection("items");
currentItem = [];

var daysUntil = function(day) {
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var today = new Date();
	var exp = new Date(day);

	var diffDays = Math.round((exp.getTime() - today.getTime())/oneDay);
	return diffDays;
}

if (Meteor.isClient) {

	
	Meteor.startup(function(){
		Session.set('alertItemName', "");
		Session.set('alertAction', "");
	});
	
  /* INVENTORY */

	// get item names sorted by their expiration (item with earliest expiration is first)
  Template.inventory.itemNames = function () {
    inStock = Items.find({status:'in_stock'}, {sort: { exp_date: 1}}).fetch(); //array
		var list = [];
		var itemNames = [];
		for (i = 0; i < inStock.length; i++) {
			// add all item names to set
			if (itemNames.indexOf(inStock[i].name) < 0) {
				itemNames.push(inStock[i].name);
			}
		}
		
		return itemNames;
  };
	
	// get in stock items with given name, sorted by expiration date
	Template.inventory.getItem = function (name) {
		inStock = Items.find({status:'in_stock', name:name}, {sort: { exp_date: 1}}).fetch(); //array
		return inStock;
  };
	
	Template.itemHeader.worstQuality = function (name) {
		i = Items.findOne({status:'in_stock', name:name}, {sort: { exp_date: 1}});
		return Template.item.quality(i.exp_date);
	};
	
	Template.itemHeader.totalQuantity = function (name) {
		list = Items.find({status:'in_stock', name:name}, {sort: { exp_date: 1}}).fetch();
		total = 0;
		for (i = 0; i < list.length; i++) {
			total += list[i].quantity;
		}
		return total;
	};
	
	Template.itemHeader.soonestExp = function (name) {
		i = Items.findOne({status:'in_stock', name:name}, {sort: { exp_date: 1}});
		return i.exp_date;
	};
	
	Template.itemHeader.daysTilExp = function (name) {
		i = Items.findOne({status:'in_stock', name:name}, {sort: { exp_date: 1}});
		return Template.item.daysTilExp(i.exp_date);
	}
	
	// return quality (for coloring) based on expiration date
	Template.item.quality = function (exp_date) {
		diffDays = daysUntil(exp_date);
		if (diffDays < 0) {
			return "bad";
		} else if (diffDays <= 3) {
			return "okay";
		} else {
			return "good";
		}
  };
	
	Template.item.daysTilExp = function (exp_date) {
		days = daysUntil(exp_date);
		if (days == 1 || days == -1) {
			return days + " day";
		} else if (days == 0) {
			return "today";
		} else {
			return days + " days";
		}
	}
	
	Template.alert.getAlertItemName = function() {
		return Session.get("alertItemName");
	};
	
	Template.alert.getAlertAction = function() {
		return Session.get("alertAction");
	};
	
	Template.alert.showAlert = function(name, status) {
		Session.set('alertItemName', name);
		Session.set('alertAction', status);
		// TODO: make smoother. and place above (z index) everything else
		$('.alert').fadeIn(1000);
		//$('alert').slideToggle('slow');
		Meteor.setTimeout(function() {
			$(".alert").fadeOut(1000);
			//$('alert').slideToggle('slow');
		}, 3000);
	};
	
	Template.inventory.events({
		'click .plus': function() {
			Items.update(this._id, {$inc: {quantity: 1}});
		},
		'click .minus': function() {
			Items.update(this._id, {$inc: {quantity: -1}});

			// TODO: create a new item and mark as deleted? idk
			if (this.quantity <= 1) {
				Template.alert.showAlert(this.name, "consumed");
				Items.update(this._id, {$set: {status: 'deleted'}});
			}
		},
		'change .expDate': function() {
			if ($('.' + this._id).val() != '') {
				Items.update(this._id, {$set: {exp_date: $('.' + this._id).val()}});
			} else {
				// reset to valid date
				$('.' + this._id).val(this.exp_date);
			}
		},
		'click .item': function(event) {
			currentItem = this;
		},
		'click .itemHeader': function(event) {
			$('.item' + this).slideToggle('slow');
		},
		'click #btnDecrement': function(event) {
			quantity = parseInt($("#quantity").val());
			if (quantity > 1) {
				$("#quantity").val(quantity - 1);
			}
		}, 
		'click #btnIncrement': function(event) {
			quantity = parseInt($("#quantity").val());
			if (quantity < currentItem.quantity) {
				$("#quantity").val(quantity + 1);
			}
		},
		'click #trashSelected': function(event) {
			quantity = parseInt($("#quantity").val());
			if (quantity == currentItem.quantity) {
				Template.alert.showAlert(currentItem.name, 'trashed');
				Items.update(currentItem._id, {$set: {date_removed: new Date(), status: 'trashed'}});
			} else {
				Items.update(currentItem._id, {$inc: {quantity: -quantity}});
				
				Template.alert.showAlert(currentItem.name, "trashed");
				
				// create trashed items
				Items.insert({
					uid: this.userId,
					name: currentItem.name,
					date_acquired: currentItem.date_acquired,
					exp_date: currentItem.exp_date,
					quantity: quantity,
					ppi: currentItem.ppi,
					status: 'trashed',
					date_removed: new Date(),
					img_src: currentItem.img_src
				});				
			}
		},
		'click #trashAll': function(event) {
			Template.alert.showAlert(currentItem.name, "trashed");
			Items.update(currentItem._id, {$set: {date_removed: new Date(), status: 'trashed'}});
		},
		'click .close': function(event) {
			$('.alert').hide();
			//$('alert').slideToggle('slow');
		}
	})

	/* ADD */
    function validateAddForm () {
        var name = $('#itemName').val();
        var quantity = parseInt($('#txtQuantity').val());
        var cost = $('#txtCost').val();
        var expDate = $('#expDate').val();

        var empty = name == '' || cost == '' || expDate == '';
        return !empty;
    }

	Template.add.events({
			'click #btnSave': function () {
                if (validateAddForm()) {
					var name = $('#itemName').val();
					var quantity = parseInt($('#txtQuantity').val());
					var cost = $('#txtCost').val();
					var expDate = $('#expDate').val();
					item = {uid: this.userId,
                            name: name,
                            date_acquired: new Date(),
                            exp_date: expDate,
                            quantity: quantity,
                            ppi: cost / quantity,
                            status: 'in_stock'
                         };
					Items.insert(item);
                    return true;
                } else {
                    alert("Please enter missing information");
                    return false;
                }
			},

        'keyup input#itemName': function () {
            AutoCompletion.autocomplete({
                element: 'input#itemName',
                collection: Items,
                field: 'name',
                limit: 5,
                sort: {name:1}
            });
        }
	})
	
	/* NAVBAR */
	Template.navbar.events({
		'click a': function(event) {
			// simulate a click to collapse the mobile menu
			if (event.currentTarget.className != "navbar-brand") {
				$('.navbar-toggle').click();
			}
		}
	})
	
	/* COMMON */
	Handlebars.registerHelper('helper', function() {
	});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
		if (Items.find().count() === 0) {
			Items.insert({
				uid: this.userId,
				name: "apple", 
				exp_date: "2014-04-16",
				date_acquired: new Date(),
				quantity: 1, 
				ppi: .9, 
				status: "in_stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-04-10",
				img_src: "images/apple.jpg"});
			Items.insert({
				uid: this.userId,
				name: "banana", 
				exp_date: "2014-04-17", 
				date_acquired: new Date(),
				quantity: 2, 
				ppi: .9, 
				status: "in_stock",
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