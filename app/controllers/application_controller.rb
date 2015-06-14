require "nokogiri"
require "open-uri"

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :signed_in?, :fill_game_database

  def fill_game_database # TA: seeds or rake task  seed_dump
    # Game.all.delete_all
    id_list = [
      #popular
      36765, 36113, 46569, 35573, 24024, 33394,
      #new releases
      41484, 45577, 46582, 47342, 49073, 46447,
      #highest rated,
      26839, 22420, 1539, 15473, 2600, 17280,
      #classics
      12572, 10299, 18115, 9463, 8307, 8870,
      ]

    # offset = 0;
    # while offset < 1
      # file_handle = open("http://www.giantbomb.com/api/games/?api_key=" + ENV['giantbomb_api_key'] + "&offset=" + offset.to_s)
      #
      # file_handle = open("http://www.giantbomb.com/api/games/?api_key=" + ENV['giantbomb_api_key'] + "&sort=number_of_user_reviews&limit=50")
      # doc = Nokogiri::XML(file_handle)
      #
      # # doc.css('game').each do |node|
      # doc.css('game').each do |node|
      #   id_list << node.css('id').first.inner_text
      # end
      # offset += 100
    # end

    id_list.each do |id|
      file_handle = open("http://www.giantbomb.com/api/game/3030-" + id.to_s + "/?api_key=" + ENV['giantbomb_api_key'])
      doc = Nokogiri::XML(file_handle)
      doc.css('results').each do |node|
        Game.create({
          name: node.css('name').first.inner_text,
          deck: node.css('deck').first.inner_text,
          id: node.css('id').first.inner_text,
          # thumbnail_url: node.css('thumb_url').first ? node.css('thumb_url').first.inner_text() : "",
          boxart_url: node.css('small_url').first ? node.css('small_url').first.inner_text() : ""
        })
      end
    end
  end

  private
  def current_user
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  def signed_in?
    !!current_user
  end

  def login(user)
    @current_user = user
    session[:session_token] = user.reset_token!
  end

  def logout
    current_user.try(:reset_token!)
    session[:session_token] = nil
  end

  def require_signed_in!
    redirect_to new_session_url unless signed_in?
  end
end
