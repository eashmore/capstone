GoodgamesApp.Views.SearchItem = Backbone.View.extend({

  template: JST['search_results/item'],

  events: {
    'click #game-box': 'toShow'
  },

  render: function () {
    var content = this.template({ game: this.model });
    this.$el.html(content);

    return this;
  },

  toShow: function (event) {
    event.preventDefault();
    var game = new GoodgamesApp.Models.Game();
    if (GoodgamesApp.games.where({ id: this.model.id }).length) {
      game.set({ id: this.model.id });
    }
    var attrs = { game: {
      id: this.model.get('id'),
      name: this.model.get('name'),
      deck: this.model.get('deck'),
      boxart_url: this.model.get('image').small_url
    }};
    game.set(attrs);
    game.save([], {
      success: function () {
        GoodgamesApp.games.add(game, { merge: true });
        Backbone.history.navigate('games/' + game.id, { trigger: true });
      }
    });
  }
});
