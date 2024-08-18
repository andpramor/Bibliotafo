from django.urls import path

from social.views import FriendshipRequestResponseView, FriendshipRequestView, FriendshipView, MyFriendshipsView, RatingView, ReviewView

#____API____
urlpatterns = [
    path('reviews/<int:pk>/', ReviewView.as_view(), name='get_one_review'),
    path('reviews/', ReviewView.as_view(), name='get_reviews'),
    path('ratings/<int:pk>/', RatingView.as_view(), name='get_one_rating'),
    path('ratings/', RatingView.as_view(), name='get_ratings'),
    path('friendships/<int:friendship_pk>/', FriendshipView.as_view(), name='get_or_delete_friendship'),
    path('friendships/', FriendshipView.as_view(), name='get_friendships'),
    path('friendship_request/<int:future_friend_pk>/', FriendshipRequestView.as_view(), name='friendship_request'),
    path('friendship_request_response/<int:friendship_pk>/', FriendshipRequestResponseView.as_view(), name='friendship_request_response'),
    path('myfriendships/', MyFriendshipsView.as_view(), name='myfriendships')
]