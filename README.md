# Biro Umum BE

Project web service API untuk Biro Umum.

## Quick Start

Copy .env.example to be .env and do some adjusments
```
cp .env.example .env
```

Copy yarn.stable.lock into yarn.lock
```
cp yarn.stable.lock yarn.lock
```

Install all packages
```
yarn install
```

Run the service
```
yarn dev
```

## Migrasi Database

Format file pada folder migrations adalah;
```
$tahun$bulan$hari$jam$menit$detik-aksi-namatable.js
```

Contoh;
```
20230901133603-create-file.js
```

- Untuk membuat file baru tricknya adalah, mengcopy file migrations yang paling bawah (paling baru) dan mengganti detiknya secara incremental.
- Lalu buka file yg sudah dibuat dan sesuaikan nama tablenya di method up dan down, juga sesuaikan nama-nama fieldnya di method up.
- Jika sudah sesuai lakukan ekseksusi perintah `yarn db:migrate` pada terminal
- Cek table yang telah berhasil dibuat di SQL Client, nama table yang telah terdaftar di table sequelizemeta tidak akan dibuat/dieksekusi lagi jika nantinya melakukan migrate lagi.
load data di seeder = `yarn db:seed:all`