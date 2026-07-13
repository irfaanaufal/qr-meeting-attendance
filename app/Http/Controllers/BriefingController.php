<?php

namespace App\Http\Controllers;

use App\Models\Briefing;
use App\Models\Karyawan;
use App\Models\AbsensiBriefing;
use App\Services\TranscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BriefingController extends Controller
{
    public function index()
    {
        $query = Briefing::withCount('absensi')
            ->with(['user', 'pemateri'])
            ->where('status', 'Draft')
            ->orderBy('created_at', 'desc');

        $briefings = $query->get();

        return Inertia::render('Briefings/Index', [
            'briefings' => $briefings,
        ]);
    }

    public function store(Request $request)
    {
        $briefing = Briefing::create([
            'user_id' => Auth::id(),
            'tanggal_jam' => now(),
            'status' => 'Draft',
            'absensi_dibuka' => true,
        ]);

        return redirect()->route('briefings.show', $briefing->id)
            ->with('success', 'Briefing berhasil dibuat!');
    }

    public function show(Request $request, $id)
    {
        $briefing = Briefing::with([
            'user',
            'pemateri',
            'absensi' => function ($query) {
                $query->with('karyawan')->orderBy('jam_absen', 'asc');
            }
        ])->findOrFail($id);

        $isCreator = $briefing->user_id === Auth::id();
        $isPresenter = $briefing->pemateri_fid && Auth::user()->fid === $briefing->pemateri_fid;
        if (!$isCreator && !$isPresenter && $briefing->status !== 'Selesai') {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki otoritas untuk melihat briefing ini.');
        }

        // Construct public check-in URL using DDNS domain from APP_URL
        $publicAbsenUrl = env('QR_PUBLIC_HOST') . '/qr-attendance/absen/briefing/' . $briefing->id;

        return Inertia::render('Briefings/DetailBriefing', [
            'briefing' => $briefing,
            'publicAbsenUrl' => $publicAbsenUrl,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function showAbsenForm($id)
    {
        $briefing = Briefing::with(['user', 'pemateri'])->findOrFail($id);

        return Inertia::render('Briefings/FormAbsenPublik', [
            'briefing' => $briefing,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function submitAbsen(Request $request, $id)
    {
        $request->validate([
            'fid' => 'required|string',
        ], [
            'fid.required' => 'Fingerprint ID (FID) wajib diisi.',
        ]);

        $briefing = Briefing::findOrFail($id);

        if ($briefing->status !== 'Draft') {
            return back()->with('error', 'Maaf, absensi untuk briefing ini telah ditutup.');
        }

        if (!$briefing->absensi_dibuka) {
            return back()->with('error', 'Maaf, absensi untuk briefing ini sedang ditutup.');
        }

        $karyawan = Karyawan::where('fid', $request->fid)->first();
        if (!$karyawan) {
            return back()->with('error', 'Nomor FID tidak terdaftar!');
        }

        if ($karyawan->status !== 'Active') {
            return back()->with('error', 'Maaf, akun karyawan Anda sudah dinonaktifkan (Inactive).');
        }

        $alreadyCheckedIn = AbsensiBriefing::where('briefing_id', $briefing->id)
            ->where('karyawan_fid', $request->fid)
            ->exists();

        if ($alreadyCheckedIn) {
            return back()->with('error', 'Anda sudah melakukan absensi untuk briefing ini!');
        }

        AbsensiBriefing::create([
            'briefing_id' => $briefing->id,
            'karyawan_fid' => $karyawan->fid,
            'jam_absen' => now(),
        ]);

        $jamMenit = now()->timezone('Asia/Jakarta')->format('H:i');

        return back()->with('success', 'Terima kasih ' . $karyawan->nama_karyawan . ', kehadiran Anda berhasil dicatat pada ' . $jamMenit . '!');
    }

    public function update(Request $request, $id)
    {
        $briefing = Briefing::findOrFail($id);

        $isCreator = $briefing->user_id === Auth::id();
        $isPresenter = $briefing->pemateri_fid && Auth::user()->fid === $briefing->pemateri_fid;
        if (!$isCreator && !$isPresenter) {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk memperbarui briefing ini.');
        }

        if ($briefing->status === 'Selesai') {
            return back()->with('error', 'Briefing sudah selesai. Data bersifat Read-Only.');
        }

        $validated = $request->validate([
            'judul_briefing' => 'nullable|string|max:255',
            'pemateri_fid' => 'nullable|string|exists:karyawans,fid',
            'transcript' => 'nullable|string',
        ]);

        $data = [];

        if ($request->has('judul_briefing')) {
            $data['judul_briefing'] = $validated['judul_briefing'];
        }

        if ($request->has('pemateri_fid')) {
            $data['pemateri_fid'] = $validated['pemateri_fid'];
            if ($validated['pemateri_fid']) {
                $karyawan = Karyawan::find($validated['pemateri_fid']);
                $data['divisi_pemateri'] = $karyawan?->divisi;
            } else {
                $data['divisi_pemateri'] = null;
            }
        }

        if ($request->has('transcript')) {
            $data['transcript'] = $validated['transcript'];
        }

        $briefing->update($data);

        return back()->with('success', 'Briefing berhasil diperbarui!');
    }

    public function uploadRecording(Request $request, $id)
    {
        $briefing = Briefing::findOrFail($id);

        $isCreator = $briefing->user_id === Auth::id();
        $isPresenter = $briefing->pemateri_fid && Auth::user()->fid === $briefing->pemateri_fid;
        if (!$isCreator && !$isPresenter) {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk mengunggah rekaman briefing ini.');
        }

        if ($briefing->status === 'Selesai') {
            return back()->with('error', 'Briefing sudah selesai. Rekaman bersifat Read-Only.');
        }

        $request->validate([
            'recording' => 'required|file|mimes:mp3,wav,m4a,ogg,mp4,webm,aac,flac,wma,amr,aiff,opus|max:25600',
        ]);

        if ($request->hasFile('recording')) {
            if ($briefing->recording_file) {
                Storage::disk('public')->delete($briefing->recording_file);
            }

            $file = $request->file('recording');
            $originalName = $file->getClientOriginalName();
            $path = $file->store('briefings/recordings', 'public');

            $briefing->update([
                'recording_file' => $path,
                'recording_original_name' => $originalName,
                'transcript' => null,
            ]);

            try {
                $transcript = app(TranscriptionService::class)->transcribe($path);
                $briefing->update(['transcript' => $transcript]);

                return back()->with('success', 'Rekaman "' . $originalName . '" berhasil diunggah! Transkripsi selesai.');
            } catch (\Exception $e) {
                Log::error('Transkripsi gagal', [
                    'briefing_id' => $briefing->id,
                    'error' => $e->getMessage(),
                ]);

                return back()->with('error', 'Rekaman berhasil diunggah, tetapi transkripsi gagal: ' . $e->getMessage());
            }
        }

        return back()->with('error', 'Gagal mengunggah rekaman.');
    }

    public function transcriptionStatus($id)
    {
        $briefing = Briefing::findOrFail($id);

        return response()->json([
            'transcript' => $briefing->transcript,
        ]);
    }

    public function deleteRecording($id)
    {
        $briefing = Briefing::findOrFail($id);

        $isCreator = $briefing->user_id === Auth::id();
        $isPresenter = $briefing->pemateri_fid && Auth::user()->fid === $briefing->pemateri_fid;
        if (!$isCreator && !$isPresenter) {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk menghapus rekaman briefing ini.');
        }

        if ($briefing->status === 'Selesai') {
            return back()->with('error', 'Briefing sudah selesai. Rekaman bersifat Read-Only.');
        }

        if ($briefing->recording_file) {
            Storage::disk('public')->delete($briefing->recording_file);
            $briefing->update([
                'recording_file' => null,
                'recording_original_name' => null,
                'transcript' => null,
            ]);

            return back()->with('success', 'Rekaman briefing berhasil dihapus.');
        }

        return back()->with('error', 'Tidak ada rekaman untuk dihapus.');
    }

    public function toggleAbsensi($id)
    {
        $briefing = Briefing::findOrFail($id);

        $isCreator = $briefing->user_id === Auth::id();
        $isPresenter = $briefing->pemateri_fid && Auth::user()->fid === $briefing->pemateri_fid;
        if (!$isCreator && !$isPresenter) {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk mengubah status absensi briefing ini.');
        }

        if ($briefing->status === 'Selesai') {
            return back()->with('error', 'Briefing sudah selesai.');
        }

        $briefing->absensi_dibuka = !$briefing->absensi_dibuka;
        $briefing->save();

        $statusMessage = $briefing->absensi_dibuka ? 'Absensi dibuka. Karyawan bisa melakukan absensi.' : 'Absensi ditutup. Karyawan tidak bisa absen lagi.';

        return back()->with('success', $statusMessage);
    }

    public function end($id)
    {
        $briefing = Briefing::findOrFail($id);

        $isCreator = $briefing->user_id === Auth::id();
        $isPresenter = $briefing->pemateri_fid && Auth::user()->fid === $briefing->pemateri_fid;
        if (!$isCreator && !$isPresenter) {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk mengakhiri briefing ini.');
        }

        if ($briefing->status === 'Selesai') {
            return back()->with('error', 'Briefing sudah selesai sebelumnya.');
        }

        if ($briefing->recording_file) {
            Storage::disk('public')->delete($briefing->recording_file);
        }

        $briefing->recording_file = null;
        $briefing->recording_original_name = null;
        $briefing->status = 'Selesai';
        $briefing->absensi_dibuka = false;
        $briefing->approved_by = Auth::id();
        $briefing->approved_at = now();

        $briefing->save();

        return back()->with('success', 'Briefing telah diselesaikan (Read Only).');
    }

    public function print($id)
    {
        $briefing = Briefing::with([
            'user.karyawan.signature',
            'pemateri.signature',
            'absensi' => function ($query) {
                $query->with('karyawan.signature')->orderBy('jam_absen', 'asc');
            }
        ])->findOrFail($id);

        $isCreator = $briefing->user_id === Auth::id();
        $isPresenter = $briefing->pemateri_fid && Auth::user()->fid === $briefing->pemateri_fid;
        if (!$isCreator && !$isPresenter && $briefing->status !== 'Selesai') {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki otoritas untuk mencetak briefing ini.');
        }

        return Inertia::render('Briefings/Print', [
            'briefing' => $briefing
        ]);
    }

    public function destroyAbsen($briefingId, $absenId)
    {
        $briefing = Briefing::findOrFail($briefingId);

        $isCreator = $briefing->user_id === Auth::id();
        $isPresenter = $briefing->pemateri_fid && Auth::user()->fid === $briefing->pemateri_fid;
        if (!$isCreator && !$isPresenter) {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk menghapus data absensi ini.');
        }

        if ($briefing->status === 'Selesai') {
            return back()->with('error', 'Briefing sudah selesai. Data absensi bersifat Read-Only.');
        }

        $absen = AbsensiBriefing::where('briefing_id', $briefingId)->findOrFail($absenId);
        $absen->delete();

        return back()->with('success', 'Kehadiran karyawan berhasil dihapus.');
    }

    public function history()
    {
        $query = Briefing::withCount('absensi')
            ->with(['user', 'pemateri'])
            ->where('status', 'Selesai')
            ->orderBy('tanggal_jam', 'desc');

        $briefings = $query->get();

        return Inertia::render('BriefingHistory/Index', [
            'briefings' => $briefings,
        ]);
    }
}
