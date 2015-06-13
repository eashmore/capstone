GoodgamesApp.Views.GameShow = Backbone.CompositeView.extend({

  template: JST['games/show'],

  initialize: function (options) {
    this.currentUser = options.user;
    this.reviews = this.model.reviews();
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.reviews(), 'add', this.render);
  },

  events: {
    'click #collection-button': 'addToCollection'
  },

  render: function () {
    this.setScore();
    var content = this.template({
      game: this.model,
      currentUser: this.currentUser
    });
    this.$el.html(content);
    var reviewView = new GoodgamesApp.Views.ReviewsIndex({
      collection: this.reviews,
      game: this.model
    });
    var reviewIndex = this.$el.find('#review-index');
    reviewIndex.html(reviewView.render().$el);

    this.$el.find("#average-score").rating();

    return this;
  },

  setScore: function () {
    var reviewCount = 0;
    var totalPoints = 0;
    this.model.reviews().each(function (review) {
      totalPoints += review.get('score');
      reviewCount += 1;
    });

    var averageScore = Math.round(totalPoints/reviewCount * 100) / 100;
    if (!averageScore) {
      averageScore = 0;
    }
    this.model.set({ score: averageScore });
  },

  addToCollection: function (event) {
    event.preventDefault();
    var collection = new GoodgamesApp.Models.Collection();
    collection.set({
      user_id: this.currentUser.id,
      game_id: this.model.id
    });
    collection.save({},{
      success: function () {
        this.currentUser.ownedGames().add(this.model);
        this.render();
      }.bind(this)
    });
  }
});