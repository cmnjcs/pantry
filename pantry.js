Items = new Meteor.Collection("items");
currentItem = [];

var daysUntil = function(day) {
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var today = new Date();
	var exp = new Date(day);

	var diffDays = Math.round((exp.getTime() - today.getTime())/oneDay);
	return diffDays + 1; // off by one?
}

if (Meteor.isClient) {
	Meteor.startup(function(){
		Session.set('alertItemName', "");
		Session.set('alertAction', "");
	});
	
	/* HOME */
	Template.home.expired = function() {
		date = new Date();
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();
		today = '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
		all = Items.find({status:'in_stock', exp_date: { $lt: today }}).fetch();
		console.log('today', today, all);
		tot = 0;
		for (i = 0; i < all.length; i++) {
			tot += all[i].quantity;
		}
		return tot;
	}
	Template.home.almostExpired = function() {
		return Template.home.total() - (Template.home.expired() + Template.home.good());
	}
	
	Template.home.good = function() {
		date = new Date();
		date.setDate(date.getDate() + 2);
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();
		goodDate = '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
		all = Items.find({status:'in_stock', exp_date: { $gt: goodDate }}).fetch();
		console.log('goodDate', goodDate, all);
		tot = 0;
		for (i = 0; i < all.length; i++) {
			tot += all[i].quantity;
		}
		return tot;
	}
	Template.home.total = function() {
		all = Items.find({status:'in_stock'}).fetch();
		tot = 0;
		for (i = 0; i < all.length; i++) {
			tot += all[i].quantity;
		}
		return tot;
	}

    Template.home.totalSpent = function() {
        // TODO: limit to a month
        var all = Items.find().fetch();
		var tot = 0;
		for (i = 0; i < all.length; i++) {
			tot += all[i].ppi * all[i].quantity;
		}
		return tot.toFixed(2);
    }

    Template.home.numItems = function() {
        // TODO: limit to a month
        var all = Items.find().fetch();
		var tot = 0;
		for (i = 0; i < all.length; i++) {
			tot += all[i].quantity;
		}
		return tot;
    }
    Template.home.numWaste = function() {
        // TODO: limit to a month
        var all = Items.find({status:'trashed'}).fetch();
		var tot = 0;
		for (i = 0; i < all.length; i++) {
			tot += all[i].quantity;
		}
		return tot;
    }

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
		var today = moment();
		var exp = moment(exp_date);

		var diffDays = exp.diff(today, 'days');
		if (diffDays < 0) {
			return "bad";
		} else if (diffDays < 3) {
			return "okay";
		} else {
			return "good";
		}
  };
	
	Template.item.daysTilExp = function (exp_date) {
		days = daysUntil(exp_date);
		if (days == 1) {
			return "tomorrow";
		} else if (days == -1) {
			return "yesterday";
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

			// create a new item and mark as deleted
            Items.insert({
                uid: this.userId,
                name: this.name,
                date_acquired: this.date_acquired,
                exp_date: this.exp_date,
                quantity: 1,
                ppi: this.ppi,
                status: 'deleted',
                date_removed: new Date(),
                img_src: this.img_src
            });
			if (this.quantity <= 1) {
				Items.update(this._id, {$set: {status: 'deleted'}});
			}
			Template.alert.showAlert(this.name, "consumed");
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
				Items.update(currentItem._id, {$set: {date_removed: moment().format("YYYY-MM-DD"), status: 'trashed'}});
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
					date_removed: moment().format("YYYY-MM-DD"),
					img_src: currentItem.img_src
				});				
			}
		},
		'click #trashAll': function(event) {
			Template.alert.showAlert(currentItem.name, "trashed");
			Items.update(currentItem._id, {$set: {date_removed: moment().format("YYYY-MM-DD"), status: 'trashed'}});
		},
		'click .close': function(event) {
			$('.alert').hide();
			//$('alert').slideToggle('slow');
		},
		'click .toggleExpand': function(event) {
			text = $('.toggleExpand').html();
			toggable = $('.toggable');
			if (text == "Expand all"){
				text = "Collapse all";
				for (i = 0; i < toggable.length; i++) {
					$(toggable[i]).slideDown();
				}
			} else {
				text = "Expand all";
				for (i = 0; i < toggable.length; i++) {
					$(toggable[i]).slideUp();
				}
			}
			$('.toggleExpand').html(text);
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

    Template.add.recentAdds = function () {
        return Session.get("recentAdds");
    };

    Template.add.rendered = function () {
        Session.set("recentAdds", []);
        $('#expDate').val(moment().add('days', 7).format("YYYY-MM-DD"));
    }

	Template.add.events({
			'click #btnSave': function () {
				if (validateAddForm()) {
					var name = $('#itemName').val();
					var quantity = parseInt($('#txtQuantity').val());
					var cost = $('#txtCost').val();
					var expDate = $('#expDate').val();
					// lols. it's almost like looking up images.
					availableImgs = ["apple", "banana", "bread", "cheese", "chicken", "lettuce", "milk", "orange", "peach", "avocado"];
					var img_src = "";
					if (availableImgs.indexOf(name) >= 0) {
						img_src = "images/" + name + ".jpg";
					}
					item = {
                        uid: this.userId,
                        name: name,
                        date_acquired: moment().format("YYYY-MM-DD"),
                        exp_date: expDate,
                        quantity: quantity,
                        ppi: cost / quantity,
                        status: 'in_stock',
                        img_src: img_src
                    };
					Items.insert(item);
                    var ra = Session.get("recentAdds");
                    ra.push(item);
                    Session.set("recentAdds", ra);

                    // reset inputs
                    $('#itemName').val("");
					$('#txtQuantity').val("1");
                    $('#txtCost').val("");
					$('#expDate').val(moment().add('days', 7).format("YYYY-MM-DD"));
                    return false;
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
				exp_date: "2014-05-13",
				quantity: 1, 
				ppi: .9, 
				status: "in_stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-05-08",
				img_src: "images/apple.jpg"});
			Items.insert({
				uid: this.userId,
				name: "banana", 
				exp_date: "2014-05-13",
				quantity: 2, 
				ppi: .9, 
				status: "in_stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-05-08",
				img_src: "images/banana.jpg"});
			Items.insert({
				uid: this.userId,
				name: "milk", 
				exp_date: "2014-05-12",
				quantity: 1, 
				ppi: .9, 
				status: "in_stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-05-08",
				img_src: "images/milk.jpg"});
			Items.insert({
				uid: this.userId,
				name: "avocado", 
				exp_date: "2014-05-08",
				quantity: 3, 
				ppi: .9, 
				status: "in_stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-05-07",
				img_src: "images/avocado.jpg"});
			Items.insert({
				uid: this.userId,
				name: "avocado", 
				exp_date: "2014-05-01",
				quantity: 1, 
				ppi: .9, 
				status: "in_stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-05-07",
				img_src: "images/avocado.jpg"});
			Items.insert({
				uid: this.userId,
				name: "orange", 
				exp_date: "2014-05-16",
				quantity: 1, 
				ppi: .9, 
				status: "in_stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-05-08",
				img_src: "images/orange.jpg"});
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