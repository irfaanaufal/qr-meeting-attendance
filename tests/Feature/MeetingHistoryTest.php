<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Meeting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MeetingHistoryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed basic roles
        Role::create(['name' => 'superadmin']);
        Role::create(['name' => 'user']);
    }

    public function test_guest_cannot_access_history_page(): void
    {
        $response = $this->get('/history');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_access_history_page(): void
    {
        $userRole = Role::where('name', 'user')->first();
        $user = User::factory()->create(['role_id' => $userRole->id]);

        $response = $this->actingAs($user)->get('/history');

        $response->assertOk();
    }

    public function test_standard_user_only_sees_their_own_ended_meetings(): void
    {
        $userRole = Role::where('name', 'user')->first();
        
        $user1 = User::factory()->create(['role_id' => $userRole->id]);
        $user2 = User::factory()->create(['role_id' => $userRole->id]);

        // Meetings for user1
        $ended1 = Meeting::create([
            'user_id' => $user1->id,
            'judul_rapat' => 'Meeting User 1 Ended',
            'divisi_pemateri' => 'IT',
            'tanggal_jam' => now(),
            'status' => 'Ended',
        ]);

        $active1 = Meeting::create([
            'user_id' => $user1->id,
            'judul_rapat' => 'Meeting User 1 Active',
            'divisi_pemateri' => 'IT',
            'tanggal_jam' => now(),
            'status' => 'On-Progress',
        ]);

        // Meetings for user2
        $ended2 = Meeting::create([
            'user_id' => $user2->id,
            'judul_rapat' => 'Meeting User 2 Ended',
            'divisi_pemateri' => 'HRD',
            'tanggal_jam' => now(),
            'status' => 'Ended',
        ]);

        // Get history as User 1
        $response = $this->actingAs($user1)->get('/history');

        $response->assertOk();
        
        // Assert Inertia data contains only user1's ended meetings
        $response->assertInertia(fn ($page) => $page
            ->component('History/Index')
            ->has('meetings', 1)
            ->where('meetings.0.judul_rapat', 'Meeting User 1 Ended')
        );
    }

    public function test_superadmin_can_see_all_ended_meetings(): void
    {
        $userRole = Role::where('name', 'user')->first();
        $adminRole = Role::where('name', 'superadmin')->first();

        $user1 = User::factory()->create(['role_id' => $userRole->id]);
        $user2 = User::factory()->create(['role_id' => $userRole->id]);
        $superadmin = User::factory()->create(['role_id' => $adminRole->id]);

        // Meetings for user1 and user2
        Meeting::create([
            'user_id' => $user1->id,
            'judul_rapat' => 'Meeting User 1 Ended',
            'divisi_pemateri' => 'IT',
            'tanggal_jam' => now(),
            'status' => 'Ended',
        ]);

        Meeting::create([
            'user_id' => $user2->id,
            'judul_rapat' => 'Meeting User 2 Ended',
            'divisi_pemateri' => 'HRD',
            'tanggal_jam' => now(),
            'status' => 'Ended',
        ]);

        Meeting::create([
            'user_id' => $user2->id,
            'judul_rapat' => 'Meeting User 2 Active',
            'divisi_pemateri' => 'HRD',
            'tanggal_jam' => now(),
            'status' => 'On-Progress',
        ]);

        // Get history as Superadmin
        $response = $this->actingAs($superadmin)->get('/history');

        $response->assertOk();

        // Assert Inertia data contains both ended meetings
        $response->assertInertia(fn ($page) => $page
            ->component('History/Index')
            ->has('meetings', 2)
        );
    }

    public function test_meetings_index_excludes_ended_meetings(): void
    {
        $userRole = Role::where('name', 'user')->first();
        $adminRole = Role::where('name', 'superadmin')->first();

        $user = User::factory()->create(['role_id' => $userRole->id]);
        $superadmin = User::factory()->create(['role_id' => $adminRole->id]);

        // Meeting that is Ended
        Meeting::create([
            'user_id' => $user->id,
            'judul_rapat' => 'Meeting Ended',
            'divisi_pemateri' => 'IT',
            'tanggal_jam' => now(),
            'status' => 'Ended',
        ]);

        // Meeting that is On-Progress
        Meeting::create([
            'user_id' => $user->id,
            'judul_rapat' => 'Meeting Active',
            'divisi_pemateri' => 'IT',
            'tanggal_jam' => now(),
            'status' => 'On-Progress',
        ]);

        // Access /meetings as user - should only see Active meeting
        $responseUser = $this->actingAs($user)->get('/meetings');
        $responseUser->assertOk();
        $responseUser->assertInertia(fn ($page) => $page
            ->component('Meetings/Index')
            ->has('meetings', 1)
            ->where('meetings.0.judul_rapat', 'Meeting Active')
        );

        // Access /meetings as superadmin - should only see Active meeting
        $responseAdmin = $this->actingAs($superadmin)->get('/meetings');
        $responseAdmin->assertOk();
        $responseAdmin->assertInertia(fn ($page) => $page
            ->component('Meetings/Index')
            ->has('meetings', 1)
            ->where('meetings.0.judul_rapat', 'Meeting Active')
        );
    }
}
