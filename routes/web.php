<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\KaryawanController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

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

    return Inertia::render('Dashboard', [
        'stats' => [
            'totalMeetings'  => $totalMeetings,
            'activeMeetings' => $activeMeetings,
            'closedMeetings' => $closedMeetings,
            'totalAttendees' => $totalAttendees,
            'avgAttendees'   => $totalMeetings > 0 ? round($totalAttendees / $totalMeetings, 1) : 0,
        ],
        'statusData'    => $statusData,
        'divisiData'    => $divisiData,
        'dailyData'     => $last7->values(),
        'recentMeetings' => $recentMeetings,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

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
})->middleware(['auth', 'verified'])->name('meetings.index');

// Protected routes for internal hosts
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/meetings', [MeetingController::class, 'store'])->name('meetings.store');
    Route::get('/meetings/{id}', [MeetingController::class, 'show'])->name('meetings.show');
    Route::patch('/meetings/{id}', [MeetingController::class, 'update'])->name('meetings.update');
    Route::post('/meetings/{id}/upload-berkas', [MeetingController::class, 'uploadBerkas'])->name('meetings.upload-berkas');
    Route::delete('/meetings/{id}/delete-berkas', [MeetingController::class, 'deleteBerkas'])->name('meetings.delete-berkas');
    Route::post('/meetings/{id}/toggle', [MeetingController::class, 'toggleStatus'])->name('meetings.toggle');
    Route::post('/meetings/{id}/end', [MeetingController::class, 'end'])->name('meetings.end');
    Route::get('/meetings/{id}/print', [MeetingController::class, 'print'])->name('meetings.print');
    Route::delete('/meetings/{meetingId}/absensi/{absenId}', [MeetingController::class, 'destroyAbsen'])->name('meetings.absensi.destroy');
    Route::get('/history', [MeetingController::class, 'history'])->name('meetings.history');
    Route::get('/karyawan', [KaryawanController::class, 'index'])->name('karyawan.index');
    Route::post('/karyawan', [KaryawanController::class, 'store'])->name('karyawan.store');
    Route::patch('/karyawan/{fid}', [KaryawanController::class, 'update'])->name('karyawan.update');
});

// Public routes for employees checking in via QR Code / Mobile
Route::get('/absen/meeting/{id}', [MeetingController::class, 'showAbsenForm'])->name('absen.meeting.show');
Route::post('/absen/meeting/{id}', [MeetingController::class, 'submitAbsen'])->name('absen.meeting.submit');

require __DIR__.'/auth.php';
