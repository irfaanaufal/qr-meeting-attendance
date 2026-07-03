# Arsitektur Child System - Integrasi dengan IT System

## Arsitektur

```
SOURCE CODE/
├── it-system/              ← SISTEM PUSAT
├── qr-attendance/          ← Child: Absensi Meeting
├── document-reminder-app-new/  ← Child: Reminder
└── shortly-app/                 ← Child: Shortly
```

**Semua project menggunakan database yang sama** (`main_db`).

---

## IT System (Pusat)

### Tabel `applications`

| Kolom | Tipe | Contoh |
|---|---|---|
| `id` | PK | 1 |
| `name` | varchar | Absensi Meeting |
| `slug` | varchar, unique | absensi-meeting |
| `description` | text, nullable | Aplikasi absensi meeting... |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### Tabel `user_applications`

| Kolom | Tipe | Contoh |
|---|---|---|
| `id` | PK | 1 |
| `user_id` | FK -> users | 5 |
| `application_id` | FK -> applications | 1 |
| `is_active` | boolean | false |
| `approved_by` | FK -> users, nullable | 1 |
| `approved_at` | timestamp, nullable | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

---

## Child System

### Yang dibutuhkan

| Komponen | Keterangan |
|---|---|
| `Application` model | Untuk query `Application::find(...)` |
| `UserApplication` model | Untuk cek & create akses user |
| `CheckITWorkflowAccess` middleware | Filter akses user ke halaman internal |
| `UserApplication` table | Satu tabel dengan IT System |

### Yang TIDAK dibutuhkan

| Komponen | Alasan |
|---|---|
| `ApplicationController` | Semua dari IT System |
| `AksesSaya.jsx` | Tidak berguna di child |
| `KelolaPermintaan.jsx` | Approval hanya di IT System |
| `KelolaAplikasi.jsx` | Manajemen hanya di IT System |
| Route `/applications*` | Tidak dipakai |
| Route `/admin/applications*` | Tidak dipakai |

---

### Konfigurasi

Di `.env` child system:

```ini
APP_APPLICATION_ID=1
```

Atau gunakan slug:

```ini
APP_APPLICATION_SLUG=absensi-meeting
```

---

### Flow Register

```
User daftar di child-system.com/register
  ↓
RegisteredUserController@store
  ↓
Cari aplikasi: Application::find(config('app.application_id'))
  ↓
Jika app ditemukan:
  - UserApplication::updateOrCreate(is_active = false)
  - Kirim LogNotifikasi ke semua admin IT (action: new_access_request)
  ↓
User login otomatis → redirect ke dashboard
  ↓
Middleware CheckITWorkflowAccess cek user_applications.is_active
  ↓
Jika belum aktif → redirect ke login
```

### Flow Login

```
User login di child-system.com/login
  ↓
AuthenticatedSessionController@store
  ↓
Jika user bukan admin:
  - Cari aplikasi: Application::find(config('app.application_id'))
  - Cek UserApplication (user_id + application_id)
  ↓
Jika belum punya record sama sekali:
  - UserApplication::create(is_active = false)
  - Kirim LogNotifikasi ke admin IT
  ↓
Jika record ada tapi is_active = false:
  - Logout
  - Redirect ke login + error: "Akun Anda belum diaktifkan. Silakan hubungi tim IT."
  ↓
Jika is_active = true:
  - Login sukses → dashboard
```

---

## Alur Tambah Sistem Baru

1. **IT System** — Admin buka **Kelola Aplikasi** → **Tambah Aplikasi**
2. Isi nama, slug, deskripsi → tersimpan di `applications`
3. **Child System** — Clone project, set `APP_APPLICATION_ID` di `.env`
4. Hapus file duplikasi (ApplicationController, AksesSaya, dll)
5. Auth controllers sudah sesuai pola di atas

---

## Aktivasi Akses

1. Admin IT buka **Kelola Permintaan**
2. Lihat daftar request (pending)
3. Klik **Setujui** → `user_applications.is_active = true`
4. User bisa login ke child system ✅

---

## Catatan Penting

- **JANGAN** gunakan `firstOrCreate` untuk mencari aplikasi — gunakan `find()` atau `where('slug')->first()`
- **JANGAN** buat record `applications` baru di child system
- **SEMUA** manajemen aplikasi & aktivasi hanya dari IT System
- Slug kolom bebas diedit (tidak ada validasi blokir)
- **JANGAN** edit kolom `slug` jika child system masih menggunakan `where('slug')->first()` — ganti ke `find()` terlebih dahulu
