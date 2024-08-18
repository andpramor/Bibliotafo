# Recarga de los datos de prueba
Para restablecer la base de datos, utilizo:
`python manage.py flush`
Pide confirmación y, una vez dada, se resetean las tablas, borrando todos los registros restableciendo los contadores de las claves primarias y dejando las tablas como si hubieran sido recién creadas.

Luego vuelco los datos de prueba con un solo comando, usando:
`python manage.py loaddata fixtures/testing_data/*.json`
Con él, todos los archivos json de esa carpeta se cargan ALFABÉTICAMENTE.
Para que las relaciones entre modelos no provoquen errores, los tengo que cargar en este orden:
```
1. MyUser (dependencia: ninguna)
2. Publisher (dependencia: ninguna)
3. Genre (dependencia: ninguna)
4. Theme (dependencia: ninguna)
5. Author (dependencia: ninguna)
6. Book (dependencia: Publisher, Genre, Theme, Author)
7. Sale (dependencia: MyUser)
8. SaleItem (dependencia: Sale, Book)
9. Friendship (dependencia: MyUser)
10. Favourite (dependencia: MyUser, Book)
11. Rating (dependencia: MyUser, Book)
12. Review (dependencia: MyUser, Book)
```

De ahí salen los números que añado a los nombres de los archivos fixture.

*MyUser:
Para generar una contraseña hasheada, hay que entrar en la shell de django:
`python manage.py shell`
Importar el make_password:
`from django.contrib.auth.hashers import make_password`
Y sacar por consola el hash de la contraseña:
`print(make_password("contraseña"))`