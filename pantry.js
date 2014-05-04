if (Meteor.isClient) { 
  var resetAll = function() {
  Session.set('isHome', false);
	Session.set('isAdd', false);
	Session.set('isCamera', false);
	Session.set('isInventory', false);
	Session.set('isTrends', false);
 };
 
 resetAll();
 Session.set('isHome', true);

 Template.navbar.events({
   'click .homeLink': function () {
     if (typeof console !== 'undefined')
			 resetAll();
			 Session.set('isHome', true);
   },
   'click .addLink': function () {
     if (typeof console !== 'undefined')
			 resetAll();
			 Session.set('isAdd', true);
   },
   'click .inventoryLink': function () {
     if (typeof console !== 'undefined')
			 resetAll();
			 Session.set('isInventory', true);
   },
   'click .trendsLink': function () {
     if (typeof console !== 'undefined')
			 resetAll();
			 Session.set('isTrends', true);
   }
 });
 
 Template.main.isHome = function () {
  return Session.get('isHome');
	}
	Template.main.isAdd = function () {
		return Session.get('isAdd');
	}
	Template.main.isCamera = function () {
		return Session.get('isCamera');
	}
	Template.main.isInventory = function () {
		return Session.get('isInventory');
	}
	Template.main.isTrends = function () {
		return Session.get('isTrends');
	}
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}