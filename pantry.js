Items = new Meteor.Collection("items");

if (Meteor.isClient) {
    Template.add.events({
        'submit': function () {
            var name = $('#itemName').val();
            var quantity = $('#txtQuantity').val();
            var cost = $('#txtCost').val();
            var expDate = $('#expDate').val();
            item = {uid: this.userId,
                    name: name,
                    exp_date: expDate,
                    quantity: quantity,
                    ppi: cost / quantity,
                    status: 'in_stock'
                   };
            Items.insert(item);
        }
    })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Router.map(function() {
    this.route('home', {path: '/'});
    this.route('add');
    this.route('inventory');
    this.route('camera');
    this.route('trends');
})