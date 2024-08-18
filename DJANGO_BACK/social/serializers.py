from rest_framework import serializers

from accounts.models import MyUser

from .models import Rating, Review, Friendship

class ReviewSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    cover = serializers.CharField(source='book.cover', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    photo = serializers.CharField(source='user.profile_picture', read_only=True)

    class Meta:
        model = Review
        fields = ['id','book','user','comment','book_title','cover','username','photo']
        extra_kwargs = {'book_title': {'required': False}, 'cover': {'required': False}, 'username': {'required': False}, 'photo': {'required': False}}

class RatingSerializer(serializers.ModelSerializer):
    cover = serializers.CharField(source='book.cover', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = Rating
        fields = ['id','book','user','given_rating','cover','username','book_title']
        extra_kwargs = {'cover': {'required': False}, 'username': {'required': False}, 'book_title': {'required': False}}

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = '__all__'

class MyFriendshipSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ['id', 'friend']

    def get_friend(self, obj):
        request = self.context.get('request')
        if obj.friend1 == request.user:
            return FriendsSerializer(obj.friend2).data
        else:
            return FriendsSerializer(obj.friend1).data

class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username']