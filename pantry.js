if (Meteor.isClient) {
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