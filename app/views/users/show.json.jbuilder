json.partial! 'users/user', user: @user

json.reviews @user.reviews do |review|
  json.partial! 'reviews/review', review: review
end
