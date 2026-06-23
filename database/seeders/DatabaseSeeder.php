<?php

namespace Database\Seeders;

use App\Models\User;
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
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Irfaanaufal',
            'username' => 'irfaanaufal',
            'email' => 'irfaanaufal04@gmail.com',
            'divisi' => 'IT',
            'role' => 'host',
            'password' => bcrypt('password'),
        ]);

        User::factory()->create([
            'name' => 'Super Admin',
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'divisi' => 'All',
            'role' => 'superadmin',
            'password' => bcrypt('password'),
        ]);

        $this->call([
            KaryawanSeeder::class,
        ]);
    }
}
