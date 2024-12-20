<p align="center"><img src="./ANGULAR_FRONT/src/favicon.ico" alt="Project Logo" width="150px"></p>

<h1>Bibliótafo</h1>

Bibliótafo is a mockup e-commerce site for a library, serving both as an online shop, and as a webapp for the employers of the library to keep track of sales and validate them.

I used Angular for the front end and Django with Django Rest Framework to develop the backend's REST API.

## Features

<b>Anon users</b>

- [x] Access to Home / Welcome page.
- [x] Access to books and authors lists and detail pages.
- [x] Ability to register as a client.

<b>Clients</b>

- [x] User profile.
- [x] Make purchases (I didn't mockup a payment gateway, purchases get auto validated if there's enough stock for them to go through).
- [x] Mark books as favourites.
- [x] Rate books 1-5 stars.
- [x] Review books.
- [x] Make friendship requests, cancel them, accept friend requests and decline them, delete friends.
- [x] See friends favs list and a list of their reviews.

<b>Staff members</b>

- [x] Make sales (intended for a physical store).
- [x] Add the client's mail to a sale so it appears in the client's purchases list.

<b>Managers</b>

- [x] Everything a staff user can do.
- [x] CRUD operations: books, authors, genres, themes.
- [x] Ability to create new manager / staff accounts.
