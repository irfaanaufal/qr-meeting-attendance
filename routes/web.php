<?php

use App\Http\Controllers\LogNotifikasiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\BriefingController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\SignatureController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified', 'applications.access'])->group(function () {
    Route::get('/dashboard', function () {
        $user = \Illuminate\Support\Facades\Auth::user();

        $query = \App\Models\Meeting::withCount('absensi')
            ->with(['user', 'absensi.karyawan'])
            ->orderBy('created_at', 'desc');

        if ($user->role !== 'superadmin') {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('status', 'Ended');
            });
        }

        $meetings = $query->get();

        // Stats
        $totalMeetings  = $meetings->count();
        $activeMeetings = $meetings->where('status', 'On-Progress')->count();
        $closedMeetings = $meetings->where('status', 'Closed')->count();
        $totalAttendees = $meetings->sum('absensi_count');

        // Pie chart: status distribution
        $statusData = [
            ['name' => 'Aktif',   'value' => $activeMeetings],
            ['name' => 'Ditutup', 'value' => $closedMeetings],
        ];

        // Absensi per divisi karyawan (from all absensi records)
        $divisiData = $meetings->flatMap(fn($m) => $m->absensi)
            ->groupBy(fn($a) => $a->karyawan?->divisi ?? 'Umum')
            ->map(fn($group, $key) => ['name' => $key, 'value' => $group->count()])
            ->values();

        // Rapat per hari (last 7 days)
        $last7 = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date  = now()->subDays($i)->toDateString();
            $label = now()->subDays($i)->locale('id')->isoFormat('ddd D/M');
            $count = $meetings->filter(fn($m) => \Illuminate\Support\Carbon::parse($m->tanggal_jam)->toDateString() === $date)->count();
            $last7->push(['date' => $label, 'rapat' => $count]);
        }

        $recentMeetings = $meetings->take(6)->values();

        // Briefing stats
        $briefingQuery = \App\Models\Briefing::withCount('absensi');
        if ($user->role !== 'superadmin') {
            $briefingQuery->where('user_id', $user->id);
        }
        $allBriefings = $briefingQuery->get();
        $totalBriefings = $allBriefings->count();
        $draftBriefings = $allBriefings->where('status', 'Draft')->count();
        $selesaiBriefings = $allBriefings->where('status', 'Selesai')->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalMeetings'  => $totalMeetings,
                'activeMeetings' => $activeMeetings,
                'closedMeetings' => $closedMeetings,
                'totalAttendees' => $totalAttendees,
                'avgAttendees'   => $totalMeetings > 0 ? round($totalAttendees / $totalMeetings, 1) : 0,
            ],
            'briefingStats' => [
                'total'   => $totalBriefings,
                'draft'   => $draftBriefings,
                'selesai' => $selesaiBriefings,
            ],
            'statusData'    => $statusData,
            'divisiData'    => $divisiData,
            'dailyData'     => $last7->values(),
            'recentMeetings' => $recentMeetings,
        ]);
    })->name('dashboard');

    Route::get('/meetings', function () {
        $user = \Illuminate\Support\Facades\Auth::user();

        $query = \App\Models\Meeting::withCount('absensi')
            ->with('user')
            ->where('status', '!=', 'Ended')
            ->orderBy('created_at', 'desc');

        if ($user->role !== 'superadmin') {
            $query->where('user_id', $user->id);
        }

        $meetings = $query->get();

        return Inertia::render('Meetings/Index', [
            'meetings' => $meetings,
        ]);
    })->name('meetings.index');
});

// Protected routes requiring authentication only (e.g. profile edit/update)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Protected internal routes requiring both authentication and active application access
Route::middleware(['auth', 'applications.access'])->group(function () {
    Route::post('/meetings', [MeetingController::class, 'store'])->name('meetings.store');
    Route::get('/meetings/{id}', [MeetingController::class, 'show'])->name('meetings.show');
    Route::patch('/meetings/{id}', [MeetingController::class, 'update'])->name('meetings.update');
    Route::post('/meetings/{id}/upload-berkas', [MeetingController::class, 'uploadBerkas'])->name('meetings.upload-berkas');
    Route::delete('/meetings/{id}/delete-berkas', [MeetingController::class, 'deleteBerkas'])->name('meetings.delete-berkas');
    Route::post('/meetings/{id}/toggle', [MeetingController::class, 'toggleStatus'])->name('meetings.toggle');
    Route::post('/meetings/{id}/end', [MeetingController::class, 'end'])->name('meetings.end');
    Route::post('/meetings/{id}/toggle-absensi', [MeetingController::class, 'toggleAbsensi'])->name('meetings.toggle-absensi');
    Route::get('/meetings/{id}/print', [MeetingController::class, 'print'])->name('meetings.print');
    Route::delete('/meetings/{meetingId}/absensi/{absenId}', [MeetingController::class, 'destroyAbsen'])->name('meetings.absensi.destroy');
    Route::get('/history', [MeetingController::class, 'history'])->name('meetings.history');
    Route::get('/karyawan', [KaryawanController::class, 'index'])->name('karyawan.index');
    Route::post('/karyawan', [KaryawanController::class, 'store'])->name('karyawan.store');
    Route::patch('/karyawan/{fid}', [KaryawanController::class, 'update'])->name('karyawan.update');

    // Signature routes
    Route::post('/signatures', [SignatureController::class, 'store'])->name('signatures.store');
    Route::get('/signatures/{karyawanFid}', [SignatureController::class, 'show'])->name('signatures.show');
    Route::delete('/signatures/{karyawanFid}', [SignatureController::class, 'destroy'])->name('signatures.destroy');

    // Briefing routes
    Route::get('/briefings', [BriefingController::class, 'index'])->name('briefings.index');
    Route::post('/briefings', [BriefingController::class, 'store'])->name('briefings.store');
    Route::get('/briefings/{id}', [BriefingController::class, 'show'])->name('briefings.show');
    Route::patch('/briefings/{id}', [BriefingController::class, 'update'])->name('briefings.update');
    Route::post('/briefings/{id}/upload-recording', [BriefingController::class, 'uploadRecording'])->name('briefings.upload-recording');
    Route::delete('/briefings/{id}/delete-recording', [BriefingController::class, 'deleteRecording'])->name('briefings.delete-recording');
    Route::post('/briefings/{id}/toggle-absensi', [BriefingController::class, 'toggleAbsensi'])->name('briefings.toggle-absensi');
    Route::post('/briefings/{id}/end', [BriefingController::class, 'end'])->name('briefings.end');
    Route::get('/briefings/{id}/print', [BriefingController::class, 'print'])->name('briefings.print');
    Route::delete('/briefings/{briefingId}/absensi/{absenId}', [BriefingController::class, 'destroyAbsen'])->name('briefings.absensi.destroy');
    Route::get('/briefing-history', [BriefingController::class, 'history'])->name('briefings.history');
});

// API Notifikasi
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/notifications', [LogNotifikasiController::class, 'index'])->name('api.notifications');
    Route::patch('/api/notifications/read-all', [LogNotifikasiController::class, 'markAllRead'])->name('api.notifications.read-all');
});

// Public routes for employees checking in via QR Code / Mobile
Route::get('/absen/meeting/{id}', [MeetingController::class, 'showAbsenForm'])->name('absen.meeting.show');
Route::post('/absen/meeting/{id}', [MeetingController::class, 'submitAbsen'])->name('absen.meeting.submit');

Route::get('/absen/briefing/{id}', [BriefingController::class, 'showAbsenForm'])->name('absen.briefing.show');
Route::post('/absen/briefing/{id}', [BriefingController::class, 'submitAbsen'])->name('absen.briefing.submit');

require __DIR__.'/auth.php';
