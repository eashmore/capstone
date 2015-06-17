GoodgamesApp.Views.CollectionFeedItem = Backbone.View.extend({

  template: JST['collections/feed_item'],

  initialize: function () {
    this.users = new GoodgamesApp.Collections.Users();
    this.user = this.users.getOrFetch(this.model.escape('user_id'));

    this.listenTo(this.user, 'sync', this.render);
  },

  events: {
    "click #feed-username": "toUser",
    "click #feed-gamename": "toGame"
  },

  render: function () {
    var content = this.template({ recommendation: this.model, image: this.user.image() });
    this.$el.html(content);

    return this;
  },

  toUser: function(event) {
    event.preventDefault();
    Backbone.history.navigate("/users/" + this.model.escape('user_id'),
      { trigger: true }
    );
  },

  toGame: function (event) {
    event.preventDefault();
    Backbone.history.navigate("/games/" + this.model.escape('game_id'),
      { trigger: true }
    );

  }
});