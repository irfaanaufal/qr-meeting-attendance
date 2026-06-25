<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Karyawan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Run KaryawanSeeder first so we have records to link
        $this->call([
            KaryawanSeeder::class,
        ]);

        // 2. Seed Roles
        $superadminRole = Role::firstOrCreate(['name' => 'superadmin']);
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);

        // 3. Ensure karyawans with FID '16' and '15' exist
        Karyawan::firstOrCreate(
            ['fid' => '309'],
            ['nama_karyawan' => 'Irfaanaufal', 'divisi' => 'IT', 'jabatan' => 'Staff', 'status' => 'Active']
        );
        Karyawan::firstOrCreate(
            ['fid' => '170'],
            ['nama_karyawan' => 'Hendi', 'divisi' => 'IT', 'jabatan' => 'Staff', 'status' => 'Active']
        );

        // 4. Seed Users
        User::factory()->create([
            'fid' => '309', // Links to Irfan (IT)
            'name' => 'Irfaanaufal',
            'username' => 'irfaanaufal',
            'email' => 'irfaanaufal04@gmail.com',
            'role_id' => $superadminRole->id,
            'password' => bcrypt('password'),
        ]);

        User::factory()->create([
            'fid' => '170', // Links to Hendi (IT)
            'name' => 'Hendi',
            'username' => 'Hendi',
            'email' => 'hendi@gmail.com',
            'role_id' => $superadminRole->id,
            'password' => bcrypt('password'),
        ]);
    }
}
