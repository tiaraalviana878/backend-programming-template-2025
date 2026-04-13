# Gacha API

API ini digunakan untuk sistem undian (gacha) dimana user bisa mendapatkan hadiah secara acak.

---

## Base URL
http://localhost:4000/api

---

## Endpoints

### 1.  Gacha
**POST /gacha**

Melakukan gacha untuk mendapatkan hadiah secara acak.

#### Request Body:
```json
{
  "userId": "user1"
}
Succes Response:
{
  "message": "Berhasil gacha",
  "reward": "Smartphone X"
}

Error Response:
{
  "message": "Limit gacha hari ini sudah habis"
}
---

### 2. Gacha History
**GET /gacha/history/userId**

Melihat history gacha dari user tertentu

**Response**
{
  "userId": "user1",
  "total": 5,
  "data": []
}

### 3. Reward List
**Get /gacha/rewards**

Menampilkan daftar hadiah beserta sisa kuota

**Response**
[
  {
    "name": "Emas 10 gram",
    "quota": 1,
    "remaining": 1
  }
]

## 4. Winner List
** Get/gacha/winners

Menampilkan daftar pemenang dengan nama yang sudah disamarkan.

**Response**
[
  {
    "userId": "u***1",
    "reward": "Smartphone X"
  }
]
---

## Rules
- Setiap user hanya bisa gacha maksimal 5 kali per hari
- Hadiah memiliki kuota terbatas
- Semua hasil gacha disimpan ke mongoDB

--

## Tech Stack

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB + Mongoose

**Tools:**
- Postman (API testing)
- Nodemon (auto restart server)
- Git & GitHub (version control)




