if (Meteor.isClient) { 
 Meteor.call('resetAll');
 Session.set('isHome', true);

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

Meteor.methods({
    resetAll: function() {
        Session.set('isHome', false);
        Session.set('isAdd', false);
        Session.set('isCamera', false);
        Session.set('isInventory', false);
        Session.set('isTrends', false);
    },

    gotoAdd: function() {
        Meteor.call('resetAll');
        Session.set('isAdd', true);
    },

    gotoHome: function() {
        Meteor.call('resetAll');
        Session.set('isHome', true);
    },

     gotoCamera: function() {
        Meteor.call('resetAll');
        Session.set('isCamera', true);
    },

     gotoInventory: function() {
        Meteor.call('resetAll');
        Session.set('isInventory', true);
    },

     gotoTrends: function() {
        Meteor.call('resetAll');
        Session.set('isTrends', true);
    }
})