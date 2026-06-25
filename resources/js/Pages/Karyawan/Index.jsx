import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function KaryawanIndex({ karyawans }) {
    const { flash } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJabatan, setSelectedJabatan] = useState('Semua Jabatan');
    const [entriesPerPage, setEntriesPerPage] = useState('10');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingKaryawan, setEditingKaryawan] = useState(null);

    // Form for Adding Karyawan
    const addForm = useForm({
        fid: '',
        nama_karyawan: '',
        divisi: '',
        jabatan: '',
    });

    // Form for Editing Karyawan
    const editForm = useForm({
        nama_karyawan: '',
        divisi: '',
        jabatan: '',
        status: 'Active',
    });

    const divisionOptions = [
        'IT',
        'HRD',
        'QC',
        'Admin',
        'Kelistrikan',
        'Ekspedisi',
        'Produksi',
        'Supir',
        'Keamanan',
    ];

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('karyawan.store'), {
            onSuccess: () => {
                addForm.reset();
                setIsAddModalOpen(false);
            },
        });
    };

    const handleEditClick = (karyawan) => {
        setEditingKaryawan(karyawan);
        editForm.setData({
            nama_karyawan: karyawan.nama_karyawan,
            divisi: karyawan.divisi || '',
            jabatan: karyawan.jabatan || '',
            status: karyawan.status || 'Active',
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.patch(route('karyawan.update', editingKaryawan.fid), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingKaryawan(null);
            },
        });
    };

    const uniqueJabatans = ['Semua Jabatan', ...new Set(karyawans.map(k => k.jabatan).filter(Boolean))];

    const filteredKaryawan = karyawans.filter(k => {
        const term = searchQuery.toLowerCase();
        const matchesSearch = (
            k.nama_karyawan.toLowerCase().includes(term) ||
            (k.divisi || '').toLowerCase().includes(term) ||
            (k.jabatan || '').toLowerCase().includes(term) ||
            k.fid.toString().includes(term)
        );

        const matchesJabatan = selectedJabatan === 'Semua Jabatan' || k.jabatan === selectedJabatan;

        return matchesSearch && matchesJabatan;
    });

    const totalEntries = filteredKaryawan.length;
    const isAllEntries = entriesPerPage === 'Semua';
    const limit = isAllEntries ? totalEntries : parseInt(entriesPerPage);
    const totalPages = isAllEntries ? 1 : Math.ceil(totalEntries / limit);
    const activePage = Math.min(currentPage, totalPages || 1);
    const startIndex = (activePage - 1) * limit;
    const endIndex = isAllEntries ? totalEntries : Math.min(startIndex + limit, totalEntries);
    const paginatedKaryawan = filteredKaryawan.slice(startIndex, endIndex);

    const getPageRange = () => {
        const range = [];
        const start = Math.max(1, activePage - 2);
        const end = Math.min(totalPages, activePage + 2);
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Database Karyawan" />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Header title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Database Karyawan</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Kelola data karyawan & sidik jari (Fingerprint ID) untuk absensi rapat</p>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex justify-center items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest py-3 px-5 transition shadow-sm self-start sm:self-auto"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Karyawan
                        </button>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="rounded-xl bg-white border border-zinc-200 p-4 flex items-center gap-3 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-xl bg-white border border-red-200 p-4 flex items-center gap-3 shadow-sm dark:bg-zinc-900 dark:border-red-950/30">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{flash.error}</span>
                        </div>
                    )}

                    {/* Main section: search and table */}
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
                                        Daftar Karyawan
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 text-[9px] font-extrabold uppercase tracking-wider">
                                            {filteredKaryawan.length} Orang
                                        </span>
                                    </h3>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Semua karyawan yang terdaftar di sistem</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                    <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-3">
                                        {/* Entries Filter */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Tampilkan:</span>
                                            <select
                                                value={entriesPerPage}
                                                onChange={(e) => { setEntriesPerPage(e.target.value); setCurrentPage(1); }}
                                                className="w-full sm:w-auto rounded-xl border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-xs shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:bg-zinc-950 dark:border-zinc-750 dark:text-white"
                                            >
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="Semua">Semua</option>
                                            </select>
                                        </div>

                                        {/* Position Filter */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Jabatan:</span>
                                            <select
                                                value={selectedJabatan}
                                                onChange={(e) => { setSelectedJabatan(e.target.value); setCurrentPage(1); }}
                                                className="w-full sm:w-40 rounded-xl border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-xs shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:bg-zinc-950 dark:border-zinc-750 dark:text-white"
                                            >
                                                {uniqueJabatans.map(j => (
                                                    <option key={j} value={j}>{j}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Search Box */}
                                    <input
                                        type="text"
                                        placeholder="Cari nama, divisi, FID..."
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        className="rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-2 text-xs shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-all dark:bg-zinc-950 dark:border-zinc-750 dark:text-white dark:focus:border-zinc-100 dark:focus:ring-zinc-100 w-full sm:w-56"
                                    />
                                </div>
                            </div>

                            {filteredKaryawan.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                    <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Tidak ada data karyawan ditemukan</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-550 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                                        <thead className="bg-zinc-50 dark:bg-zinc-950">
                                            <tr>
                                                {['No.', 'FID', 'Nama Karyawan', 'Divisi', 'Jabatan', 'Status', 'Aksi'].map(h => (
                                                    <th key={h} scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-white dark:bg-zinc-900">
                                            {paginatedKaryawan.map((karyawan, index) => (
                                                <tr key={karyawan.fid} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition">
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                                                        {startIndex + index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                                        #{karyawan.fid}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {karyawan.nama_karyawan}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                                                        {karyawan.divisi || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400 dark:text-zinc-500">
                                                        {karyawan.jabatan || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-extrabold text-[10px] uppercase tracking-wider border ${karyawan.status === 'Active'
                                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
                                                                : 'bg-zinc-100 border-zinc-200 text-zinc-650 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'
                                                            }`}>
                                                            {karyawan.status === 'Active' ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm space-x-2">
                                                        <button
                                                            onClick={() => handleEditClick(karyawan)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider transition border border-zinc-200 dark:border-zinc-700"
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {totalEntries > 0 && !isAllEntries && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                        Menampilkan <span className="font-bold text-zinc-800 dark:text-white">{startIndex + 1}</span> sampai{' '}
                                        <span className="font-bold text-zinc-800 dark:text-white">{endIndex}</span> dari{' '}
                                        <span className="font-bold text-zinc-800 dark:text-white">{totalEntries}</span> data
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={activePage === 1}
                                            className="inline-flex justify-center items-center h-8 px-3 rounded-lg border border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white text-xs font-bold transition dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
                                        >
                                            Sebelumnya
                                        </button>

                                        {getPageRange().map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p)}
                                                className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold border transition ${p === activePage
                                                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 shadow-sm'
                                                        : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={activePage === totalPages}
                                            className="inline-flex justify-center items-center h-8 px-3 rounded-lg border border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white text-xs font-bold transition dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
                                        >
                                            Selanjutnya
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Add Karyawan Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-200">
                        <div className="px-6 py-4 bg-zinc-900 text-white dark:bg-zinc-950 flex items-center justify-between">
                            <h3 className="font-extrabold text-sm tracking-wide uppercase">Tambah Karyawan Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">
                                    Fingerprint ID (FID) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: 154"
                                    value={addForm.data.fid}
                                    onChange={e => addForm.setData('fid', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                                />
                                {addForm.errors.fid && <p className="text-xs text-red-550 font-semibold mt-1">{addForm.errors.fid}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: John Doe"
                                    value={addForm.data.nama_karyawan}
                                    onChange={e => addForm.setData('nama_karyawan', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                                />
                                {addForm.errors.nama_karyawan && <p className="text-xs text-red-550 font-semibold mt-1">{addForm.errors.nama_karyawan}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">Divisi</label>
                                <select
                                    value={addForm.data.divisi}
                                    onChange={e => addForm.setData('divisi', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                                >
                                    <option value="">Pilih Divisi...</option>
                                    {divisionOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">Jabatan</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Staff / Karyawan"
                                    value={addForm.data.jabatan}
                                    onChange={e => addForm.setData('jabatan', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-350 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-750 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 transition flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    {addForm.processing ? 'Menyimpan...' : 'Simpan Karyawan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Karyawan Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-200">
                        <div className="px-6 py-4 bg-zinc-900 text-white dark:bg-zinc-950 flex items-center justify-between">
                            <div>
                                <h3 className="font-extrabold text-sm tracking-wide uppercase">Edit Karyawan</h3>
                                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">FID: #{editingKaryawan?.fid}</p>
                            </div>
                            <button onClick={() => { setIsEditModalOpen(false); setEditingKaryawan(null); }} className="text-zinc-400 hover:text-white transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: John Doe"
                                    value={editForm.data.nama_karyawan}
                                    onChange={e => editForm.setData('nama_karyawan', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                                />
                                {editForm.errors.nama_karyawan && <p className="text-xs text-red-550 font-semibold mt-1">{editForm.errors.nama_karyawan}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">Divisi</label>
                                <select
                                    value={editForm.data.divisi}
                                    onChange={e => editForm.setData('divisi', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                                >
                                    <option value="">Pilih Divisi...</option>
                                    {divisionOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">Jabatan</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Staff / Karyawan"
                                    value={editForm.data.jabatan}
                                    onChange={e => editForm.setData('jabatan', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">Status Keaktifan</label>
                                <select
                                    value={editForm.data.status}
                                    onChange={e => editForm.setData('status', e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditModalOpen(false); setEditingKaryawan(null); }}
                                    className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-350 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-750 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 transition flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
