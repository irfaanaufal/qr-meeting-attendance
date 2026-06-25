<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_check_karyawan_returns_info_on_valid_fid(): void
    {
        $karyawan = \App\Models\Karyawan::create([
            'fid' => '999',
            'nama_karyawan' => 'Employee Test',
            'divisi' => 'IT',
            'jabatan' => 'Staff',
            'status' => 'Active',
        ]);

        $response = $this->get('/register/check-karyawan/999');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'karyawan' => [
                    'fid' => '999',
                    'nama_karyawan' => 'Employee Test',
                    'divisi' => 'IT',
                ],
            ]);
    }

    public function test_check_karyawan_returns_error_on_invalid_fid(): void
    {
        $response = $this->get('/register/check-karyawan/non-existent');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'FID Karyawan tidak ditemukan.',
            ]);
    }
}
