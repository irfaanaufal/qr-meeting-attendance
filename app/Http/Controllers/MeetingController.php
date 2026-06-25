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
                $query->with('karyawan')->orderBy('jam_absen', 'asc');
            }
        ])->findOrFail($id);

        // Security check: Only the creator (host), superadmin, or any host if the meeting is Ended
        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin' && $meeting->status !== 'Ended') {
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

        return Inertia::render('Meetings/FormAbsenPublik', [
            'meeting' => $meeting,
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

        // 1. Validate if the meeting is still active/open
        if ($meeting->status !== 'On-Progress') {
            return back()->with('error', 'Maaf, absensi untuk rapat ini telah ditutup.');
        }

        // 2. Validate if the FID exists in the active employee master list
        $karyawan = Karyawan::where('fid', $request->fid)->first();
        if (!$karyawan) {
            return back()->with('error', 'Nomor FID tidak terdaftar!');
        }

        // Validate if the employee account is active
        if ($karyawan->status !== 'Active') {
            return back()->with('error', 'Maaf, akun karyawan Anda sudah dinonaktifkan (Inactive).');
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

        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin' && $meeting->status !== 'Ended') {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki otoritas untuk mencetak rapat ini.');
        }

        return Inertia::render('Meetings/Print', [
            'meeting' => $meeting
        ]);
    }

    /**
     * Delete an attendance record (Absensi).
     */
    public function destroyAbsen($meetingId, $absenId)
    {
        $meeting = Meeting::findOrFail($meetingId);

        // Security check: Only the creator (host) or superadmin can delete
        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk menghapus data absensi ini.');
        }

        // Strict validation: If the meeting status is Ended, no one can delete, not even Super Admin
        if ($meeting->status === 'Ended') {
            return back()->with('error', 'Rapat sudah diakhiri. Data absensi bersifat Read-Only.');
        }

        $absen = AbsensiMeeting::where('meeting_id', $meetingId)->findOrFail($absenId);
        $absen->delete();

        return back()->with('success', 'Kehadiran karyawan berhasil dihapus.');
    }

    /**
     * Upload a document for the meeting.
     */
    public function uploadBerkas(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Security check: Only the creator (host) or superadmin can upload
        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk mengunggah berkas rapat ini.');
        }

        // Lock check: If ended
        if ($meeting->status === 'Ended') {
            return back()->with('error', 'Rapat sudah diakhiri. Berkas bersifat Read-Only.');
        }

        $request->validate([
            'berkas' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png|max:10240', // 10MB limit
        ]);

        if ($request->hasFile('berkas')) {
            // Delete old file if exists
            if ($meeting->berkas) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($meeting->berkas);
            }

            $file = $request->file('berkas');
            $originalName = $file->getClientOriginalName();
            // Store it
            $path = $file->store('meetings/berkas', 'public');
            
            $meeting->update([
                'berkas' => $path,
            ]);

            return back()->with('success', 'Berkas "' . $originalName . '" berhasil diunggah!');
        }

        return back()->with('error', 'Gagal mengunggah berkas.');
    }

    /**
     * Delete the meeting document.
     */
    public function deleteBerkas($id)
    {
        $meeting = Meeting::findOrFail($id);

        // Security check: Only the creator (host) or superadmin can delete
        if ($meeting->user_id !== Auth::id() && Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk menghapus berkas rapat ini.');
        }

        // Lock check: If ended
        if ($meeting->status === 'Ended') {
            return back()->with('error', 'Rapat sudah diakhiri. Berkas bersifat Read-Only.');
        }

        if ($meeting->berkas) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($meeting->berkas);
            $meeting->update([
                'berkas' => null,
            ]);

            return back()->with('success', 'Berkas rapat berhasil dihapus.');
        }

        return back()->with('error', 'Tidak ada berkas untuk dihapus.');
    }

    /**
     * Display a listing of completed (Ended) meetings.
     */
    public function history()
    {
        $user = Auth::user();

        $query = Meeting::withCount('absensi')
            ->with('user')
            ->where('status', 'Ended')
            ->orderBy('tanggal_jam', 'desc');

        if ($user->role !== 'superadmin') {
            $query->where('user_id', $user->id);
        }

        $meetings = $query->get();

        return Inertia::render('History/Index', [
            'meetings' => $meetings,
        ]);
    }
}

