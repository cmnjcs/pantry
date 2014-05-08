Items = new Meteor.Collection("items");

if (Meteor.isClient) {
	Meteor.startup(function(){
		console.log('start');
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
		return i.exp_date
	};
	
	// return quality (for coloring) based on expiration date
  Template.item.quality = function (exp_date) {
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		var today = new Date();
		var exp = new Date(exp_date);

		var diffDays = Math.round((exp.getTime() - today.getTime())/oneDay);
    if (diffDays < 0) {
			return "bad";
		} else if (diffDays <= 3) {
			return "okay";
		} else {
			return "good";
		}
  };
	
	Template.inventory.events({
		'click .plus': function() {
			Items.update(this._id, {$inc: {quantity: 1}});
		},
		'click .minus': function() {
			Items.update(this._id, {$inc: {quantity: -1}});

			if (this.quantity <= 0) {
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
		'click .itemHeader' : function(event){
        $('.item' + this).slideToggle('slow');
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
				status: "in_stock",
				date_removed: "",
				type: "fruit",
				date_acquired: "2014-04-10",
				img_src: "images/apple.jpg"});
			Items.insert({
				name: "banana", 
				exp_date: "2014-04-17", 
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