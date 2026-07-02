<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Karyawan;
use App\Models\Application;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            KaryawanSeeder::class,
        ]);

        $superadminRole = Role::firstOrCreate(['name' => 'superadmin']);
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);

        Karyawan::firstOrCreate(
            ['fid' => '309'],
            ['nama_karyawan' => 'Irfaanaufal', 'divisi' => 'IT', 'jabatan' => 'Staff', 'status' => 'Active']
        );
        Karyawan::firstOrCreate(
            ['fid' => '170'],
            ['nama_karyawan' => 'Hendi', 'divisi' => 'IT', 'jabatan' => 'Staff', 'status' => 'Active']
        );

        User::factory()->create([
            'fid' => '309',
            'name' => 'Irfaanaufal',
            'username' => 'irfaanaufal',
            'email' => 'irfaanaufal04@gmail.com',
            'role_id' => $superadminRole->id,
            'password' => bcrypt('password'),
        ]);

        User::factory()->create([
            'fid' => '170',
            'name' => 'Hendi',
            'username' => 'Hendi',
            'email' => 'hendi@gmail.com',
            'role_id' => $superadminRole->id,
            'password' => bcrypt('password'),
        ]);

        Application::firstOrCreate(
            ['slug' => 'absensi-meeting'],
            ['name' => 'Absensi Meeting', 'description' => 'Aplikasi Absensi Meeting Digital']
        );
    }
}
