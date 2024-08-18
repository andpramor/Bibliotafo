from django.shortcuts import get_object_or_404
from django.db.models import Q #Q permite hacer consultas complejas, con OR o AND, para los filters.

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated

from accounts.models import MyUser
from social.models import Friendship, Rating, Review
from social.serializers import FriendsSerializer, MyFriendshipSerializer, RatingSerializer, ReviewSerializer, FriendshipSerializer

class ReviewView(APIView):
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return []
        else:
            return [permissions.IsAuthenticated()]
    
    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['user']==request.user:
                serializer.save()
                return Response(serializer.data, status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk=None):
        if pk == None: #Listado
            reviews = Review.objects.all()

            #Filtros:
            if request.query_params.get('book'):
                book = request.query_params.get('book')
                reviews = reviews.filter(book=book).order_by('-pk')

            if request.query_params.get('user'):
                user = self.request.query_params.get('user')
                reviews = reviews.filter(user=user).order_by('-pk')

            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data)
        
        else: #Detalle
            review = get_object_or_404(Review, pk=pk)
            serializer = ReviewSerializer(review)
            return Response(serializer.data)
    
    def patch(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            if serializer.validated_data['user']==request.user and review.user==request.user:
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk)
        if review.user == request.user:
            review.delete()
            return Response(status.HTTP_204_NO_CONTENT)
        else:
            return Response('No tienes permiso para eliminar una reseña que no es tuya.', status.HTTP_401_UNAUTHORIZED)

class RatingView(APIView):
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return []
        else:
            return [permissions.IsAuthenticated()]
    
    def post(self, request):
        serializer = RatingSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['user']==request.user:
                serializer.save()
                return Response(serializer.data, status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk=None):
        if pk == None: #Listado
            ratings = Rating.objects.all()

            #Filtros:
            if request.query_params.get('book'):
                book = request.query_params.get('book')
                ratings = ratings.filter(book=book)

            if request.query_params.get('user'):
                user = self.request.query_params.get('user')
                ratings = ratings.filter(user=user)

            serializer = RatingSerializer(ratings, many=True)
            return Response(serializer.data, status.HTTP_200_OK)
        
        else: #Detalle
            rating = get_object_or_404(Rating, pk=pk)
            serializer = RatingSerializer(rating)
            return Response(serializer.data, status.HTTP_200_OK)
    
    def patch(self, request, pk):
        rating = get_object_or_404(Rating, pk=pk)
        serializer = RatingSerializer(rating, data=request.data, partial=True)
        if serializer.is_valid():
            if serializer.validated_data['user']==request.user and rating.user==request.user:
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        rating = get_object_or_404(Rating, pk=pk)
        if rating.user == request.user:
            rating.delete()
            return Response(status.HTTP_204_NO_CONTENT)
        else:
            return Response('No tienes permiso para eliminar una reseña que no es tuya.', status.HTTP_401_UNAUTHORIZED)

class FriendshipView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, friendship_pk=None):
        #Listado
        if friendship_pk == None:
            if request.user.rol == 'client':
                #Peticiones enviadas:
                if request.query_params.get('enviadas'):
                    friendships = Friendship.objects.filter(friend1=request.user, state=False)
                    #friendships = friendships.filter(state=False) #Pasado al filtro anterior, revisar si funciona y eliminar esta línea
                
                #Peticiones recibidas:
                elif request.query_params.get('recibidas'):
                    friendships = Friendship.objects.filter(friend2=request.user, state=False)
                    #friendships = friendships.filter(state=False)
                
                #Amistades:
                else:
                    friendships = Friendship.objects.filter(Q(friend1=request.user) | Q(friend2=request.user), state=True)
            else:
                #Los trabajadores ven todas las amistades confirmadas
                friendships = Friendship.objects.filter(state=True)

            serializer = FriendshipSerializer(friendships, many=True)
            return Response(serializer.data, status.HTTP_200_OK)
        
        #Detalle:
        else:
            friendship = get_object_or_404(Friendship, pk=friendship_pk)
            serializer = FriendshipSerializer(friendship)
            if serializer.data['friend1'] == request.user or serializer.data['friend2'] == request.user:
                return Response(serializer.data, status.HTTP_200_OK)
            return Response({"error":"No eres parte de esta amistad"}, status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, friendship_pk):
        friendship = get_object_or_404(Friendship, pk=friendship_pk)
        if request.user.pk != friendship.friend1.pk and request.user.pk != friendship.friend2.pk:
            print("User.pk: "+request.user.pk)
            print("Amigo 1: "+friendship.friend1)
            return Response({"error":"No eres parte de la amistad que intentas eliminar."}, status.HTTP_401_UNAUTHORIZED)
        friendship.delete()
        return Response({"message":"Amistad eliminada."}, status.HTTP_204_NO_CONTENT)

class MyFriendshipsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enviadas = request.query_params.get('enviadas', None)
        recibidas = request.query_params.get('recibidas', None)

        # Peticiones enviadas:
        if enviadas is not None:
            friendships = Friendship.objects.filter(friend1=request.user, state=False)
        
        # Peticiones recibidas:
        elif recibidas is not None:
            friendships = Friendship.objects.filter(friend2=request.user, state=False)
        
        # Amistades:
        else:
            friendships = Friendship.objects.filter(Q(friend1=request.user) | Q(friend2=request.user), state=True)

        serializer = MyFriendshipSerializer(friendships, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)



class FriendshipRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, future_friend_pk):
        #Verifico que el destinatario de la petición existe:
        future_friend = get_object_or_404(MyUser, pk=future_friend_pk)

        if request.user.rol != 'client' or future_friend.rol != 'client':
            return Response({"error":"Sólo los clientes participan en las amistades"}, status.HTTP_400_BAD_REQUEST)

        if request.user.id == future_friend_pk:
            return Response({"error":"No puedes enviarte una solicitud de amistad a ti mismo."}, status.HTTP_400_BAD_REQUEST)
        
        # Verifico si ya hay una solicitud pendiente o ya son amigos:
        if Friendship.objects.filter(friend1=request.user, friend2_id=future_friend_pk).exists() or \
            Friendship.objects.filter(friend1_id=future_friend_pk, friend2=request.user).exists(): #La barra invertida permite seguir el código en la siguiente línea.
            return Response({"error":"Ya existe una solicitud de amistad pendiente o confirmada entre estos usuarios."}, status.HTTP_400_BAD_REQUEST)
        
        friendship = {
            "friend1": request.user.pk,
            "friend2": future_friend_pk,
            "state": False
        }
        serializer = FriendshipSerializer(data=friendship)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FriendshipRequestResponseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, friendship_pk):

        friendship = get_object_or_404(Friendship, pk=friendship_pk)

        if friendship.friend2 != request.user:
            return Response({"message":"No puedes responder a una petición de amistad que no es para ti."}, status.HTTP_400_BAD_REQUEST)

        friendship.state = True
        friendship.save()
        return Response(FriendshipSerializer(friendship).data, status.HTTP_200_OK)
    
    def delete(self, request, friendship_pk):

        friendship = get_object_or_404(Friendship, pk=friendship_pk)

        if friendship.friend2 != request.user:
            return Response({"message":"No puedes responder a una petición de amistad que no es para ti."}, status.HTTP_400_BAD_REQUEST)
        else:
            friendship.delete()
            return Response({"message":"Solicitud de amistad rechazada y eliminada."}, status.HTTP_204_NO_CONTENT)