from django.shortcuts import get_object_or_404
from django.utils import timezone

from decimal import Decimal

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.models import MyUser
from bibliotafo.permissions import IsManager, IsManagerOrReadOnly

from shop.serializers import AuthorDetailSerializer, PublisherSerializer, GenreSerializer, SaleGetSerializer, SaleFullSerializer, SaleItemPostSerializer, SaleItemStandaloneSerializer, ThemeSerializer, AuthorSerializer, BookSerializer, SalePostSerializer, FavouriteSerializer
from shop.models import Publisher, Genre, Theme, Author, Book, Sale, SaleItem, Favourite

#ViewSets simples:
class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    permission_classes = [IsManagerOrReadOnly]

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsManagerOrReadOnly]

class ThemeViewSet(viewsets.ModelViewSet):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [IsManagerOrReadOnly]

#Bulk delete de los ViewSets:

class BulkDeletePublisherView(APIView):
    permission_classes = [IsManager]

    def delete(self, request):
        ids = request.data.get('ids')
        if not ids:
            return Response({'error': 'IDs list is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(ids, list):
            return Response({'error': 'Invalid data format, expected a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        # Compruebo que todos los ID proporcionados existan:
        existing_ids = set(Publisher.objects.filter(pk__in=ids).values_list('id', flat=True))
        requested_ids = set(ids)
        missing_ids = requested_ids - existing_ids
        if missing_ids:
            return Response({'error': f'The following IDs were not found: {list(missing_ids)}'}, status=status.HTTP_404_NOT_FOUND)
        
        # Si todos existen, elimino todos los Publisher de la lista
        Publisher.objects.filter(pk__in=ids).delete()
        return Response({'message': 'Successfully deleted the publishers list.'}, status=status.HTTP_204_NO_CONTENT)

class BulkDeleteGenreView(APIView):
    permission_classes = [IsManager]

    def delete(self, request):
        ids = request.data.get('ids')
        if not ids:
            return Response({'error': 'IDs list is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(ids, list):
            return Response({'error': 'Invalid data format, expected a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        # Compruebo que todos los ID proporcionados existan:
        existing_ids = set(Genre.objects.filter(pk__in=ids).values_list('id', flat=True))
        requested_ids = set(ids)
        missing_ids = requested_ids - existing_ids
        if missing_ids:
            return Response({'error': f'The following IDs were not found: {list(missing_ids)}'}, status=status.HTTP_404_NOT_FOUND)
        
        # Si todos existen, elimino todos los Genre de la lista
        Genre.objects.filter(pk__in=ids).delete()
        return Response({'message': 'Successfully deleted the genres list.'}, status=status.HTTP_204_NO_CONTENT)

class BulkDeleteThemeView(APIView):
    permission_classes = [IsManager]

    def delete(self, request):
        ids = request.data.get('ids')
        if not ids:
            return Response({'error': 'IDs list is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(ids, list):
            return Response({'error': 'Invalid data format, expected a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        # Compruebo que todos los ID proporcionados existan:
        existing_ids = set(Theme.objects.filter(pk__in=ids).values_list('id', flat=True))
        requested_ids = set(ids)
        missing_ids = requested_ids - existing_ids
        if missing_ids:
            return Response({'error': f'The following IDs were not found: {list(missing_ids)}'}, status=status.HTTP_404_NOT_FOUND)
        
        # Si todos existen, elimino todos los Theme de la lista
        Theme.objects.filter(pk__in=ids).delete()
        return Response({'message': 'Successfully deleted the themes list.'}, status=status.HTTP_204_NO_CONTENT)


#Resto de endpoints más complejos:

# Authors
class AuthorsView(APIView):
    # Dejo el método get público definiendo permission_classes como un array vacío, y protejo el resto sólo para managers:
    def get_permissions(self):
        if self.request.method == 'GET':
            return [] # No se aplican permisos para GET, permitiendo que sea un endpoint público
        else:
            return [IsManager()] # Aplicar IsManager para los otros métodos HTTP
    
    # Operaciones para el CRUD:
    def post(self, request):
        self.check_permissions(request)
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):
        if pk == None: #Listado
            authors = Author.objects.all()
            serializer = AuthorSerializer(authors, many=True)
            return Response(serializer.data)
        
        else: #Detalle
            author = get_object_or_404(Author, pk=pk)
            serializer = AuthorDetailSerializer(author)
            return Response(serializer.data)
        
    def patch(self, request, pk):
        self.check_permissions(request)
        author = get_object_or_404(Author, pk=pk)
        serializer = AuthorSerializer(author, data=request.data, partial=True)  # partial=True permite actualizaciones parciales
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        self.check_permissions(request)
        book = get_object_or_404(Author, pk=pk)
        book.delete()
        return Response(status.HTTP_204_NO_CONTENT)

class BulkDeleteAuthorView(APIView):
    permission_classes = [IsManager]

    def delete(self, request):
        ids = request.data.get('ids')
        if not ids:
            return Response({'error': 'IDs list is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(ids, list):
            return Response({'error': 'Invalid data format, expected a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        # Compruebo que todos los ID proporcionados existan:
        existing_ids = set(Author.objects.filter(pk__in=ids).values_list('id', flat=True))
        requested_ids = set(ids)
        missing_ids = requested_ids - existing_ids
        if missing_ids:
            return Response({'error': f'The following IDs were not found: {list(missing_ids)}'}, status=status.HTTP_404_NOT_FOUND)
        
        # Si todos existen, elimino todos los Book de la lista
        Author.objects.filter(pk__in=ids).delete()
        return Response({'message': 'Successfully deleted the authors list.'}, status=status.HTTP_204_NO_CONTENT)

# Books
class BooksView(APIView):
    # Permisos:
    def get_permissions(self):
        
        if self.request.method == 'GET':
            return []
        else:
            return [IsManager()]
    
    # CRUD:
    def post(self, request):
        self.check_permissions(request)
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None): #Toma pk de la url (por tener en urls.py <int:pk>) y si no la hay, utiliza None por defecto.
        if pk == None: #Listado
            books = Book.objects.all()
            #Filtros:
            if request.query_params.get('max_price'):
                max_price = Decimal(self.request.query_params.get('max_price'))
                books = books.filter(price__lte=max_price)
            if request.query_params.get('author'):
                author = request.query_params.get('author')
                books = books.filter(authors=author)
            if request.query_params.get('isbn'):
                isbn = self.request.query_params.get('isbn')
                books = books.filter(ISBN=isbn)
            serializer = BookSerializer(books, many=True)
            return Response(serializer.data)
        
        else: #Detalle
            book = get_object_or_404(Book, pk=pk)
            serializer = BookSerializer(book)
            return Response(serializer.data)
    
    def patch(self, request, pk):
        self.check_permissions(request)
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, data=request.data, partial=True)  # partial=True permite actualizaciones parciales
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        self.check_permissions(request)
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        self.check_permissions(request)
        book = get_object_or_404(Book, pk=pk)
        book.delete()
        return Response(status.HTTP_204_NO_CONTENT)

class BulkDeleteBookView(APIView):
    permission_classes = [IsManager]

    def delete(self, request):
        ids = request.data.get('ids')
        if not ids:
            return Response({'error': 'IDs list is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(ids, list):
            return Response({'error': 'Invalid data format, expected a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        # Compruebo que todos los ID proporcionados existan:
        existing_ids = set(Book.objects.filter(pk__in=ids).values_list('id', flat=True))
        requested_ids = set(ids)
        missing_ids = requested_ids - existing_ids
        if missing_ids:
            return Response({'error': f'The following IDs were not found: {list(missing_ids)}'}, status=status.HTTP_404_NOT_FOUND)
        
        # Si todos existen, elimino todos los Book de la lista
        Book.objects.filter(pk__in=ids).delete()
        return Response({'message': 'Successfully deleted the books list.'}, status=status.HTTP_204_NO_CONTENT)

# Sales
class SalesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SalePostSerializer(data=request.data)
        if serializer.is_valid():
            sale_data = serializer.validated_data
            sale_items_data = sale_data.pop('sale_items')

            if request.user.rol == 'client':
                sale_data['buyer'] = request.user
                sale_data['seller'] = MyUser.objects.get(pk=14) #El vendedor "web"
            else:
                sale_data['seller'] = request.user
                sale_data['buyer'] = MyUser.objects.get(pk=15) #El cliente de paso, en mi base de datos y en los datos de prueba
            
            sale_data['sale_done'] = False

            # Creo la instancia de Sale primero:
            sale = Sale.objects.create(**sale_data) #Uso ** porque sale_data es un diccionario, y el operador ** lo convierte en clave=valor, clave=valor, etc.

            # Y ahora cada SaleItem:
            for item_data in sale_items_data:
                SaleItem.objects.create(sale=sale, **item_data)

            # No puedo devolver sale directamente porque quiero que también vayan los SaleItems
            response_data = {
                'id': sale.id,
                'seller': sale.seller.id,
                'buyer': sale.buyer.id,
                'sale_date': sale.sale_date,
                'sale_items': [
                    {'id': item.id, 'book': item.book.id, 'units': item.units, 'cost': item.cost}
                    for item in sale.sale_items.all()
                ]
                #Este for aprovecha el concepto comprehensive list para crear un diccionario como el que tiene de "plantilla" para cada item de la venta.
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):
        if pk == None: #Listado
            seller = request.query_params.get('seller')
            buyer = self.request.query_params.get('buyer')

            sales = Sale.objects.filter(sale_done=True).order_by('-sale_date')
            if request.user.rol == 'client': #Un cliente sólo puede ver sus propias compras
                sales = sales.filter(buyer=request.user)

            elif request.user.rol == 'staff': #Un staff sólo puede ver sus propias ventas, y puede filtrar por comprador
                sales = sales.filter(seller=request.user)
                if buyer:
                    sales = sales.filter(buyer=buyer)

            else: #Los managers pueden ver todas las ventas y filtrar por comprador o vendedor
                if seller:
                    sales = sales.filter(seller=seller)
                if buyer:
                    sales = sales.filter(buyer=buyer)
    
            serializer = SaleFullSerializer(sales, many=True)
            return Response(serializer.data, status.HTTP_200_OK)
        
        else: #Detalle
            sale = get_object_or_404(Sale, pk=pk)
            if request.user == sale.buyer or request.user == sale.seller or request.user.rol == 'manager':
                serializer = SaleGetSerializer(sale)
                return Response(serializer.data, status.HTTP_200_OK)
            return Response('Permiso denegado', status.HTTP_401_UNAUTHORIZED)
    
    def patch(self, request, pk=None):
        if pk is None:
            return Response({'detail': 'Sale ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        sale = get_object_or_404(Sale, pk=pk)
        
        if request.user != sale.seller and request.user != sale.buyer:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_401_UNAUTHORIZED)

        if 'sale_done' in request.data and request.data['sale_done'] == True:

            # Compruebo el stock de cada SaleItem y guardo los que no tengan suficiente.
            insufficient_stock_books = []
            for item in sale.sale_items.all():
                if item.book.stock < item.units:
                    insufficient_stock_books.append(item.book.title)

            if insufficient_stock_books: #Si hay alguno sin stock suficiente, devuelvo un error indicando cuáles.
                return Response({'detail': 'Insufficient stock for books', 'books': insufficient_stock_books}, status=status.HTTP_400_BAD_REQUEST)

            # If all items have sufficient stock, deduct the stock
            for item in sale.sale_items.all():
                item.book.stock -= item.units
                item.book.save()

            sale.sale_done = True
            sale.sale_date = timezone.now()
            if 'buyer' in request.data:
                sale.buyer = get_object_or_404(MyUser, pk=request.data.get('buyer'))
            else:
                sale.buyer = MyUser.objects.get(pk=15) #El cliente de paso, en mi base de datos y en los datos de prueba
            sale.save()
            return Response({'detail': 'Sale marked as done'}, status=status.HTTP_200_OK)
        
        return Response({'detail': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

class SaleItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SaleItemStandaloneSerializer(data=request.data)
        if serializer.is_valid():
            sale = Sale.objects.get(pk=serializer.validated_data['sale'].pk)
            if request.user.rol == 'client':
                if sale.buyer.pk == request.user.pk:
                    try:
                        sale_item = SaleItem.objects.get(sale=sale, book=serializer.validated_data['book'].pk)
                        # Si existe, actualizar las unidades y el costo
                        sale_item.units += serializer.validated_data['units']
                        sale_item.cost += serializer.validated_data['cost']
                        sale_item.save()
                        return Response(SaleItemStandaloneSerializer(sale_item).data, status.HTTP_200_OK)
                    except SaleItem.DoesNotExist:
                        # Si no existe, crear un nuevo SaleItem
                        serializer.save()
                        return Response(serializer.data, status.HTTP_201_CREATED)
                else:
                   return Response('No puedes comprar en nombre de otro', status.HTTP_401_UNAUTHORIZED)
            else:
                if sale.seller.pk == request.user.pk:
                    try:
                        sale_item = SaleItem.objects.get(sale=sale, book=serializer.validated_data['book'].pk)
                        # Si existe, actualizar las unidades y el costo
                        sale_item.units += serializer.validated_data['units']
                        sale_item.cost += serializer.validated_data['cost']
                        sale_item.save()
                        return Response(SaleItemStandaloneSerializer(sale_item).data, status.HTTP_200_OK)
                    except SaleItem.DoesNotExist:
                        # Si no existe, crear un nuevo SaleItem
                        serializer.save()
                        return Response(serializer.data, status.HTTP_201_CREATED)
                else:
                   return Response('No puedes vender en nombre de otro', status.HTTP_401_UNAUTHORIZED)
        print(serializer.errors)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        item = get_object_or_404(SaleItem, pk=pk)
        serializer = SaleItemPostSerializer(item, data=request.data, partial=True)  # partial=True permite actualizaciones parciales
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        self.check_permissions(request)
        item = get_object_or_404(SaleItem, pk=pk)
        item.delete()
        return Response(status.HTTP_204_NO_CONTENT)

class BulkDeleteSaleItemView(APIView):
    def delete(self, request):
        ids = request.data.get('ids')
        if not ids:
            return Response({'error': 'IDs list is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(ids, list):
            return Response({'error': 'Invalid data format, expected a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        # Compruebo que todos los ID proporcionados existan:
        existing_ids = set(SaleItem.objects.filter(pk__in=ids).values_list('id', flat=True))
        requested_ids = set(ids)
        missing_ids = requested_ids - existing_ids
        if missing_ids:
            return Response({'error': f'The following IDs were not found: {list(missing_ids)}'}, status=status.HTTP_404_NOT_FOUND)
        
        # Si todos existen, elimino todos los Theme de la lista
        SaleItem.objects.filter(pk__in=ids).delete()
        return Response({'message': 'Successfully deleted the themes list.'}, status=status.HTTP_204_NO_CONTENT)

#Favourites
class FavouritesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FavouriteSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['user']==request.user:
                serializer.save()
                return Response(serializer.data, status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status.HTTP_401_UNAUTHORIZED)
        print(serializer.data)
        print(serializer.errors)
        return Response('No puedes añadir un favorito para otra persona.', status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        favourites = Favourite.objects.all()

        #Filtros
        if request.query_params.get('user'):
            user = request.query_params.get('user')
            favourites = favourites.filter(user=user)
        if request.query_params.get('book'):
            book = request.query_params.get('book')
            favourites = favourites.filter(book=book)
        serializer = FavouriteSerializer(favourites, many=True)
        return Response(serializer.data, status.HTTP_200_OK)
    
    def delete(self, request, pk):
        favourite = get_object_or_404(Favourite, pk=pk)
        if favourite.user == request.user:
            favourite.delete()
            return Response(status.HTTP_204_NO_CONTENT)
        else:
            return Response('No tienes permiso para eliminar un favorito que no es tuyo.', status.HTTP_401_UNAUTHORIZED)