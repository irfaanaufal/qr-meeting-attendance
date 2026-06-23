<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Karyawan;
use App\Models\AbsensiMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MeetingController extends Controller
{
    /**
     * Store a newly created meeting.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul_rapat' => 'required|string|max:255',
            'ringkasan' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Automatically assign user_id, divisi_pemateri, status, and current time (tanggal_jam)
        $meeting = Meeting::create([
            'user_id' => $user->id,
            'judul_rapat' => $validated['judul_rapat'],
            'divisi_pemateri' => $user->divisi ?? 'Umum',
            'tanggal_jam' => now(),
            'ringkasan' => $validated['ringkasan'] ?? null,
            'status' => 'On-Progress',
        ]);

        return redirect()->route('meetings.show', $meeting->id)
            ->with('success', 'Rapat berhasil dibuat secara instan!');
    }

    /**
     * Display the meeting details (Host View).
     */
    public function show($id)
    {
        // Load the meeting, creator/host, and the list of attendees sorted by newest scan
        $meeting = Meeting::with([
            'user', 
            'absensi' => function ($query) {
                $query->with('karyawan')->orderBy('jam_absen', 'desc');
            }
        ])->findOrFail($id);

        // Security check: Only the creator (host) or superadmin can view this detail page
        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin') {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki otoritas untuk melihat rincian rapat ini.');
        }

        // Construct public check-in URL dynamically
        $req = request();
        $host = $req->getHost();
        $port = $req->getPort();
        
        // If accessed via loopback, replace with local machine IP so devices on same Wi-Fi can scan it
        if (in_array($host, ['localhost', '127.0.0.1', '::1'])) {
            $localIp = gethostbyname(gethostname());
            if ($localIp && $localIp !== '127.0.0.1' && $localIp !== gethostname()) {
                $host = $localIp;
            }
        }
        
        $protocol = $req->isSecure() ? 'https://' : 'http://';
        $portSuffix = ($port && !in_array($port, [80, 443])) ? ':' . $port : '';
        $publicAbsenUrl = $protocol . $host . $portSuffix . '/absen/meeting/' . $meeting->id;
 
        return Inertia::render('Meetings/DetailMeeting', [
            'meeting' => $meeting,
            'publicAbsenUrl' => $publicAbsenUrl,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Display the public attendance check-in form for employees (Public View).
     */
    public function showAbsenForm(Request $request, $id)
    {
        $meeting = Meeting::with('user')->findOrFail($id);
        $alreadyAttendedOnDevice = $request->hasCookie('meeting_attended_' . $id);

        return Inertia::render('Meetings/FormAbsenPublik', [
            'meeting' => $meeting,
            'alreadyAttendedOnDevice' => $alreadyAttendedOnDevice,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Handle the public check-in submission.
     */
    public function submitAbsen(Request $request, $id)
    {
        $request->validate([
            'fid' => 'required|string',
        ], [
            'fid.required' => 'Fingerprint ID (FID) wajib diisi.',
        ]);

        $meeting = Meeting::findOrFail($id);

        // 0. Validate if the device has already checked in (anti-titip absen) - bypass for authenticated host/admin
        if ($request->hasCookie('meeting_attended_' . $id) && !Auth::check()) {
            return back()->with('error', 'Perangkat ini sudah digunakan untuk absensi rapat ini!');
        }

        // 1. Validate if the meeting is still active/open
        if ($meeting->status !== 'On-Progress') {
            return back()->with('error', 'Maaf, absensi untuk rapat ini telah ditutup.');
        }

        // 2. Validate if the FID exists in the active employee master list
        $karyawan = Karyawan::where('fid', $request->fid)->first();
        if (!$karyawan) {
            return back()->with('error', 'Nomor FID tidak terdaftar!');
        }

        // 3. Prevent duplicate check-in (mencegah absen ganda)
        $alreadyCheckedIn = AbsensiMeeting::where('meeting_id', $meeting->id)
            ->where('karyawan_fid', $request->fid)
            ->exists();

        if ($alreadyCheckedIn) {
            return back()->with('error', 'Anda sudah melakukan absensi untuk rapat ini!');
        }

        // 4. Record attendance
        AbsensiMeeting::create([
            'meeting_id' => $meeting->id,
            'karyawan_fid' => $karyawan->fid,
            'jam_absen' => now(),
        ]);

        $jamMenit = now()->timezone('Asia/Jakarta')->format('H:i');

        // Queue a long-lived cookie to mark this device as checked in for this meeting - skip for authenticated hosts
        if (!Auth::check()) {
            cookie()->queue(cookie()->forever('meeting_attended_' . $meeting->id, 'true'));
        }

        return back()->with('success', 'Terima kasih ' . $karyawan->nama_karyawan . ', kehadiran Anda berhasil dicatat pada ' . $jamMenit . '!');
    }

    public function toggleStatus($id)
    {
        $meeting = Meeting::findOrFail($id);

        // Authorization check - ensure only the creator or super admin can toggle status
        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk mengubah status rapat ini.');
        }

        if ($meeting->status === 'Ended') {
            return back()->with('error', 'Rapat sudah diakhiri dan bersifat Read Only.');
        }

        $meeting->status = $meeting->status === 'On-Progress' ? 'Closed' : 'On-Progress';
        $meeting->save();

        $statusMessage = $meeting->status === 'Closed' ? 'Absensi ditutup. Karyawan tidak bisa absen lagi.' : 'Absensi dibuka kembali. Karyawan bisa melakukan absensi.';

        return back()->with('success', $statusMessage);
    }

    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Authorization check - ensure only the creator or super admin can update
        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk memperbarui rapat ini.');
        }

        if ($meeting->status === 'Ended' && Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Rapat sudah diakhiri secara permanen. Notulensi hanya bisa diubah oleh Super Admin.');
        }

        $validated = $request->validate([
            'ringkasan' => 'nullable|string',
        ]);

        $meeting->update([
            'ringkasan' => $validated['ringkasan'] ?? null,
        ]);

        return back()->with('success', 'Notulensi / Ringkasan rapat berhasil diperbarui!');
    }

    /**
     * End the meeting completely (Read-only mode).
     */
    public function end($id)
    {
        $meeting = Meeting::findOrFail($id);

        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk mengakhiri rapat ini.');
        }

        if ($meeting->status === 'Ended') {
            return back()->with('error', 'Rapat sudah diakhiri sebelumnya.');
        }

        $meeting->status = 'Ended';
        $meeting->save();

        return back()->with('success', 'Rapat telah diakhiri secara permanen (Read Only).');
    }

    /**
     * Print PDF layout view for meeting.
     */
    public function print($id)
    {
        $meeting = Meeting::with([
            'user', 
            'absensi' => function ($query) {
                $query->with('karyawan')->orderBy('jam_absen', 'asc');
            }
        ])->findOrFail($id);

        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin') {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki otoritas untuk mencetak rapat ini.');
        }

        return Inertia::render('Meetings/Print', [
            'meeting' => $meeting
        ]);
    }
}
