# LostPetFinder

A web-based platform for reporting lost pets and found animals, searching reports by locality, and finding possible matches.

## Features

- Report lost pets
- Report found animals
- Search by locality
- Find possible matches
- Update, resolve and delete reports
- Validation and error handling

## Matching

Matches are based on:

- Species
- Color
- Locality
- Active status

Resolved reports are excluded from matching.

## Technology Stack

- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- HTML, CSS, JavaScript
- Swagger UI
- Maven

## Architecture

```text
Frontend
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL
```

## Project Structure

```text
src/
├── main/
│   ├── java/com/example/lostpetfinder/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   └── service/
│   └── resources/
│       └── static/
│           ├── index.html
│           ├── style.css
│           └── script.js
└── test/
```

## REST APIs

### Users

- `POST /users`
- `GET /users`
- `GET /users/{id}`

### Lost Pets

- `POST /lost-pets`
- `GET /lost-pets`
- `GET /lost-pets/{id}`
- `GET /lost-pets/search`
- `PUT /lost-pets/{id}`
- `PUT /lost-pets/{id}/resolve`
- `DELETE /lost-pets/{id}`

### Found Animals

- `POST /found-animals`
- `GET /found-animals`
- `GET /found-animals/{id}`
- `GET /found-animals/search`
- `PUT /found-animals/{id}`
- `PUT /found-animals/{id}/resolve`
- `DELETE /found-animals/{id}`

### Matching

- `GET /matches/{lostPetId}`

## Run

Create the database:

```sql
CREATE DATABASE lostpetfinder;
```

Configure your MySQL credentials in `application.properties`.

Run:

```bash
mvn spring-boot:run
```

Open:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

## Author

**Sakthi Sreya S**

B.E. CSE (Cybersecurity)
