import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function HistoryIndex({ meetings }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [searchQuery, setSearchQuery] = useState('');
    const [searchDivisi, setSearchDivisi] = useState('All');
    const [entriesPerPage, setEntriesPerPage] = useState('10');
    const [currentPage, setCurrentPage] = useState(1);

    // Format Date & Time
    const formatDate = (dateStr) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        };
        return new Date(dateStr).toLocaleDateString('id-ID', options) + ' WIB';
    };

    // Get unique list of divisions for filter dropdown
    const divisions = ['All', ...new Set(meetings.map(m => m.divisi_pemateri).filter(Boolean))];

    // Filter logic
    const filteredMeetings = meetings.filter(m => {
        const matchesSearch = 
            m.judul_rapat.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.divisi_pemateri || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesDivisi = searchDivisi === 'All' || m.divisi_pemateri === searchDivisi;

        return matchesSearch && matchesDivisi;
    });

    // Pagination calculations
    const totalEntries = filteredMeetings.length;
    const isAllEntries = entriesPerPage === 'Semua';
    const limit = isAllEntries ? totalEntries : parseInt(entriesPerPage);
    const totalPages = isAllEntries ? 1 : Math.ceil(totalEntries / limit);
    const activePage = Math.min(currentPage, totalPages || 1);
    const startIndex = (activePage - 1) * limit;
    const endIndex = isAllEntries ? totalEntries : Math.min(startIndex + limit, totalEntries);
    const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex);

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
            <Head title="Riwayat Rapat" />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Riwayat Rapat</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Daftar rapat yang telah selesai dan diakhiri secara permanen (Read-Only)</p>
                        </div>
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

                    {/* Main section: search, filters and table */}
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
                                        Daftar Riwayat
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-850 dark:bg-zinc-800 dark:text-zinc-200 text-[9px] font-extrabold uppercase tracking-wider">
                                            {filteredMeetings.length} Rapat
                                        </span>
                                    </h3>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Semua rapat yang telah berakhir di sistem</p>
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

                                        {/* Division Filter */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Divisi:</span>
                                            <select
                                                value={searchDivisi}
                                                onChange={(e) => { setSearchDivisi(e.target.value); setCurrentPage(1); }}
                                                className="w-full sm:w-40 rounded-xl border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-xs shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:bg-zinc-950 dark:border-zinc-750 dark:text-white"
                                            >
                                                {divisions.map(div => (
                                                    <option key={div} value={div}>
                                                        {div === 'All' ? 'Semua' : div}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Search Box */}
                                    <input
                                        type="text"
                                        placeholder="Cari judul, host, divisi..."
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        className="rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-2 text-xs shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-all dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:focus:border-zinc-100 dark:focus:ring-zinc-100 w-full sm:w-56"
                                    />
                                </div>
                            </div>

                            {filteredMeetings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                    <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Tidak ada riwayat rapat ditemukan</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-550 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                                        <thead className="bg-zinc-50 dark:bg-zinc-950">
                                            <tr>
                                                <th scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">No.</th>
                                                <th scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Info Rapat</th>
                                                <th scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Penyelenggara / Host</th>
                                                <th scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Waktu Pelaksanaan</th>
                                                <th scope="col" className="px-5 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Hadir</th>
                                                <th scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Notulensi / Berkas</th>
                                                <th scope="col" className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-white dark:bg-zinc-900">
                                            {paginatedMeetings.map((meeting, index) => (
                                                <tr 
                                                    key={meeting.id} 
                                                    className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition"
                                                >
                                                    {/* No. */}
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                                                        {startIndex + index + 1}
                                                    </td>

                                                    {/* Info Rapat */}
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                        <div className="space-y-1 max-w-xs md:max-w-md">
                                                            <div className="flex items-center gap-2">
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-500 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
                                                                    Selesai
                                                                </span>
                                                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                                                    {meeting.divisi_pemateri}
                                                                </span>
                                                            </div>
                                                            <Link 
                                                                href={route('meetings.show', meeting.id)}
                                                                className="block font-bold text-zinc-950 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition text-sm tracking-tight truncate"
                                                            >
                                                                {meeting.judul_rapat}
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    {/* Penyelenggara / Host */}
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {meeting.user?.name || 'Unknown User'}
                                                        </div>
                                                        {user.role === 'superadmin' && (
                                                            <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
                                                                ID Host: {meeting.user_id}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Waktu Pelaksanaan */}
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                                                        {formatDate(meeting.tanggal_jam)}
                                                    </td>

                                                    {/* Hadir */}
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-center">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-extrabold text-[10px] uppercase tracking-wider border bg-zinc-50 border-zinc-200 text-zinc-750 dark:bg-zinc-800/40 dark:border-zinc-700 dark:text-zinc-300">
                                                            {meeting.absensi_count} Orang
                                                        </span>
                                                    </td>

                                                    {/* Notulensi / Berkas */}
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                        {meeting.berkas ? (
                                                            <a 
                                                                href={`/storage/${meeting.berkas}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 font-bold text-zinc-855 hover:text-zinc-955 dark:text-zinc-300 dark:hover:text-white transition group/file text-xs"
                                                            >
                                                                <svg className="w-4 h-4 text-zinc-400 group-hover/file:text-zinc-900 dark:group-hover/file:text-white transition" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                                </svg>
                                                                <span className="underline decoration-zinc-300 dark:decoration-zinc-700 truncate max-w-[120px] inline-block" title={meeting.berkas.split('/').pop()}>
                                                                    {meeting.berkas.split('/').pop()}
                                                                </span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-zinc-400 dark:text-zinc-650 italic">
                                                                Tidak ada berkas
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Aksi */}
                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-right space-x-2">
                                                        <Link
                                                            href={route('meetings.show', meeting.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider transition border border-zinc-200 dark:border-zinc-700"
                                                            title="Detail Notulen"
                                                        >
                                                            Detail
                                                        </Link>
                                                        <a
                                                            href={route('meetings.print', meeting.id)}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-bold text-xs uppercase tracking-wider transition border border-zinc-900 dark:border-white shadow-sm"
                                                            title="Cetak Daftar Absen"
                                                        >
                                                            Cetak
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
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
                                        {getPageRange().map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`inline-flex justify-center items-center h-8 w-8 rounded-lg text-xs font-bold transition ${activePage === page
                                                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                                                    : 'border border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850'}`}
                                            >
                                                {page}
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
        </AuthenticatedLayout>
    );
}
