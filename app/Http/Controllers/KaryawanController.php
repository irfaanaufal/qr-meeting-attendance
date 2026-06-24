<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KaryawanController extends Controller
{
    /**
     * Display a listing of employees (Karyawan).
     */
    public function index()
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki otoritas untuk mengakses halaman ini.');
        }

        $karyawans = Karyawan::orderBy('nama_karyawan', 'asc')->get();

        return Inertia::render('Karyawan/Index', [
            'karyawans' => $karyawans,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Store a newly created employee in database.
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk menambah karyawan.');
        }

        $validated = $request->validate([
            'fid' => 'required|string|max:50|unique:karyawans,fid',
            'nama_karyawan' => 'required|string|max:255',
            'divisi' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:Active,Inactive',
        ], [
            'fid.required' => 'Fingerprint ID (FID) wajib diisi.',
            'fid.unique' => 'FID ini sudah terdaftar untuk karyawan lain.',
            'nama_karyawan.required' => 'Nama karyawan wajib diisi.',
        ]);

        // Default status is Active if not provided
        if (!isset($validated['status'])) {
            $validated['status'] = 'Active';
        }

        Karyawan::create($validated);

        return back()->with('success', 'Karyawan baru berhasil ditambahkan!');
    }

    /**
     * Update the specified employee in database.
     */
    public function update(Request $request, $fid)
    {
        if (Auth::user()->role !== 'superadmin') {
            return back()->with('error', 'Anda tidak memiliki otoritas untuk mengubah data karyawan.');
        }

        $karyawan = Karyawan::findOrFail($fid);

        $validated = $request->validate([
            'nama_karyawan' => 'required|string|max:255',
            'divisi' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'status' => 'required|string|in:Active,Inactive',
        ], [
            'nama_karyawan.required' => 'Nama karyawan wajib diisi.',
            'status.required' => 'Status karyawan wajib diisi.',
        ]);

        $karyawan->update($validated);

        return back()->with('success', 'Data karyawan berhasil diperbarui!');
    }
}
