PAWFECT SHELTER

## Built With

![Node.js](https://img.shields.io/badge/Node.js-v18.16.0-green?logo=node.js) ![Express.js](https://img.shields.io/badge/Express.js-v4.21.1-lightgrey?logo=express) ![Sequelize](https://img.shields.io/badge/Sequelize-v6.37.5-blue?logo=sequelize)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14.0-blue?logo=postgresql)
![body-parser](https://img.shields.io/badge/body--parser-v1.20.3-yellowgreen) ![cors](https://img.shields.io/badge/cors-v2.8.5-yellowgreen) ![dotenv](https://img.shields.io/badge/dotenv-v16.4.7-lightblue) ![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-v9.0.2-orange) ![morgan](https://img.shields.io/badge/morgan-v1.10.0-lightgrey) ![multer](https://img.shields.io/badge/multer-v1.4.5--lts.1-brightgreen)
![bcryptjs](https://img.shields.io/badge/bcryptjs-v2.4.3-green) ![fs](https://img.shields.io/badge/fs-native-red) ![joi](https://img.shields.io/badge/joi-v17.13.3-purple) ![path](https://img.shields.io/badge/path-native-red) ![pg](https://img.shields.io/badge/pg-v8.13.1-blue) ![pg-hstore](https://img.shields.io/badge/pg--hstore-v2.3.4-lightblue
![nodemon](https://img.shields.io/badge/nodemon-v3.1.7-brightgreen?logo=nodemon) ![sequelize-cli](https://img.shields.io/badge/sequelize--cli-v6.6.2-blue)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Postman](https://www.postman.com/)

## Installation Guide

### Getting Started

Follow the steps below to set up the project on your local environment.

### Clone the Repository

```bash
git clone https://github.com/zakyyl/backend_kucing.git
cd backend_kucing
```

### Install Dependencies

Install the required packages:

```bash
npm install
```

### Environment Variables

Configure environment variables by creating a `.env` file in the root directory with the following content:

```env
NODE_ENV=development
PORT=3001

DB_USERNAME=postgres
DB_PASSWORD=123
DB_DATABASE=kucingbe
DB_HOST=127.0.0.1
DB_DIALECT=postgres

JWT_SECRET=koderahasia
```

### Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [DBeaver](https://dbeaver.io/) (Optional for database management)

### Setup the Database

1. Start PostgreSQL and create a new database named `kucingbe`.
2. Apply the Sequelize migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```
3. Seed initial data (if available):
   ```bash
   npx sequelize-cli db:seed:all
   ```

### Run the Application

Start the development server:

```bash
npm run dev
```

Access the application at [http://localhost:3001](http://localhost:3001).

---

## HTTP Requests

All API requests are made using one of the following HTTP methods:

- **GET**: Retrieve a resource or list of resources
- **POST**: Create a resource
- **PUT**: Update a resource
- **DELETE**: Delete a resource

### HTTP Response Codes

| Code | Status  | Description                          |
| ---- | ------- | ------------------------------------ |
| 200  | Success | The request was successful           |
| 400  | Error   | There was a problem with the request |

---

## Database Schema

### Create Database

```sql
CREATE DATABASE kucingbe;
```

### Tables

```sql
-- Tabel ADMIN
CREATE TABLE admin (
    id_admin SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    no_telepon VARCHAR(15),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    level_akses VARCHAR(20) NOT NULL
);
```

```sql
CREATE TABLE pengguna (
    id_pengguna SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    no_telepon VARCHAR(15),
    alamat TEXT,
    rekening_bank VARCHAR(50),
    tanggal_registrasi DATE DEFAULT CURRENT_DATE,
    status_verifikasi VARCHAR(20) DEFAULT 'belum_terverifikasi'
);
``` 

```sql
CREATE TABLE kucing (
    id_kucing SERIAL PRIMARY KEY,
    id_penjual INT REFERENCES pengguna(id_pengguna),
    nama VARCHAR(100) NOT NULL,
    ras VARCHAR(50),
    jenis_kelamin VARCHAR(10),
    umur INT,
    kondisi_kesehatan VARCHAR(50),
    deskripsi TEXT,
    foto VARCHAR(255),
    status_kucing VARCHAR(20) DEFAULT 'tersedia'
);
```


```sql
CREATE TABLE pengajuan (
    id_pengajuan SERIAL PRIMARY KEY,
    id_pengguna INT REFERENCES pengguna(id_pengguna),
    id_kucing INT REFERENCES kucing(id_kucing),
    tanggal_pengajuan DATE DEFAULT CURRENT_DATE,
    status_pengajuan VARCHAR(20) DEFAULT 'menunggu',
    motivasi TEXT,
    kondisi_rumah TEXT,
    pengalaman_peliharaan TEXT
);
```

```sql
-- Tabel ADOPSI
CREATE TABLE adopsi (
    id_adopsi SERIAL PRIMARY KEY,
    id_pengguna INT REFERENCES pengguna(id_pengguna),
    id_kucing INT REFERENCES kucing(id_kucing),
    tanggal_adopsi DATE DEFAULT CURRENT_DATE,
    status_adopsi VARCHAR(20) DEFAULT 'proses',
);
```
---

## API Documentation

[Postman Documentation]([https://documenter.getpostman.com/view/39892424/2sAYHwH4HE](https://documenter.getpostman.com/view/32330223/2sAYHxojQv))
