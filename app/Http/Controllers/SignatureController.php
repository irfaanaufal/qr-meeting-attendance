<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\Signature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SignatureController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'karyawan_fid' => 'required|string|exists:karyawans,fid',
            'signature' => 'required|string',
        ]);

        $user = Auth::user();
        $karyawan = Karyawan::findOrFail($request->karyawan_fid);

        if ($user->fid !== $karyawan->fid) {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk mengubah tanda tangan karyawan lain.');
        }

        $imageData = $request->signature;

        if (preg_match('/^data:image\/(\w+);base64,/', $imageData)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
        }

        $imageData = base64_decode($imageData);
        if ($imageData === false) {
            return back()->with('error', 'Data gambar tanda tangan tidak valid.');
        }

        $filename = 'signatures/' . $karyawan->fid . '_' . time() . '.png';

        Storage::disk('public')->put($filename, $imageData);

        $existingSignature = Signature::where('signable_type', Karyawan::class)
            ->where('signable_id', $karyawan->fid)
            ->first();

        if ($existingSignature) {
            Storage::disk('public')->delete($existingSignature->signature_path);
            $existingSignature->update(['signature_path' => $filename]);
        } else {
            Signature::create([
                'signable_type' => Karyawan::class,
                'signable_id' => $karyawan->fid,
                'signature_path' => $filename,
            ]);
        }

        return back()->with('success', 'Tanda tangan berhasil disimpan untuk ' . $karyawan->nama_karyawan . '.');
    }

    public function show($karyawanFid)
    {
        $karyawan = Karyawan::findOrFail($karyawanFid);

        $signature = Signature::where('signable_type', Karyawan::class)
            ->where('signable_id', $karyawan->fid)
            ->first();

        if (!$signature) {
            return response()->json(['signature_url' => null]);
        }

        $baseUrl = request()->getBaseUrl();
        if (env('STORAGE_URL')) {
            $storageUrl = env('STORAGE_URL');
        } elseif (str_ends_with($baseUrl, '/public')) {
            $storageUrl = request()->getSchemeAndHttpHost() . substr($baseUrl, 0, -7) . '/storage/app/public';
        } else {
            $storageUrl = asset('storage');
        }

        return response()->json([
            'signature_url' => rtrim($storageUrl, '/') . '/' . $signature->signature_path,
        ]);
    }

    public function destroy($karyawanFid)
    {
        $user = Auth::user();
        $karyawan = Karyawan::findOrFail($karyawanFid);

        if ($user->fid !== $karyawan->fid) {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk menghapus tanda tangan ini.');
        }

        $signature = Signature::where('signable_type', Karyawan::class)
            ->where('signable_id', $karyawan->fid)
            ->first();

        if (!$signature) {
            return back()->with('error', 'Tidak ada tanda tangan untuk karyawan ini.');
        }

        Storage::disk('public')->delete($signature->signature_path);
        $signature->delete();

        return back()->with('success', 'Tanda tangan berhasil dihapus untuk ' . $karyawan->nama_karyawan . '.');
    }
}
