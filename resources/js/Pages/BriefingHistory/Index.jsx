import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function BriefingHistoryIndex({ briefings }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [divisiFilter, setDivisiFilter] = useState('');

    const divisiList = [...new Set(briefings.map(b => b.divisi_pemateri).filter(Boolean))];

    const filtered = briefings.filter(b => {
        const term = searchQuery.toLowerCase();
        const matchSearch = !term || (
            b.judul_briefing.toLowerCase().includes(term) ||
            (b.user?.name || '').toLowerCase().includes(term) ||
            (b.divisi_pemateri || '').toLowerCase().includes(term)
        );
        const matchDivisi = !divisiFilter || b.divisi_pemateri === divisiFilter;
        return matchSearch && matchDivisi;
    });

    const formatDateIndonesian = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Briefing" />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">

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

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Riwayat Briefing</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                {filtered.length} briefing selesai
                            </p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-56">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari briefing..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 pl-10 pr-4 py-2.5 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-300 dark:focus:ring-zinc-300 dark:focus:bg-zinc-900 transition-all"
                                />
                            </div>
                            <select
                                value={divisiFilter}
                                onChange={(e) => setDivisiFilter(e.target.value)}
                                className="rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 px-3 py-2.5 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-300 dark:focus:ring-zinc-300 transition-all"
                            >
                                <option value="">Semua Divisi</option>
                                {divisiList.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                                    <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                                    {searchQuery || divisiFilter ? 'Briefing tidak ditemukan' : 'Belum ada briefing selesai'}
                                </p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
                                    {searchQuery || divisiFilter ? 'Coba kata kunci lain atau hapus filter.' : 'Briefing yang sudah selesai akan muncul di sini.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                                    <thead className="bg-zinc-50 dark:bg-zinc-950">
                                        <tr>
                                            {['No.', 'Info Briefing', 'Host', 'Waktu Pelaksanaan', 'Hadir', 'Notulensi/Transkrip', 'Aksi'].map(h => (
                                                <th key={h} scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-white dark:bg-zinc-900">
                                        {filtered.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition">
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-extrabold text-zinc-900 dark:text-white truncate max-w-[250px]">
                                                        {item.judul_briefing}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                                            Selesai
                                                        </span>
                                                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
                                                            {item.divisi_pemateri}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                    {item.user?.name || 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                                                    {formatDateIndonesian(item.tanggal_jam)}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                    {item.absensi_count} Orang
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    {item.transcript ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold dark:bg-emerald-950/30 dark:text-emerald-400">
                                                            Ada Transkrip
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-zinc-400 italic">-</span>
                                                    )}

                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('briefings.show', item.id)}
                                                            className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 hover:bg-zinc-900 dark:bg-zinc-800 dark:hover:bg-white text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-900 hover:text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 transition whitespace-nowrap"
                                                        >
                                                            Detail
                                                        </Link>
                                                        <a
                                                            href={route('briefings.print', item.id)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 hover:bg-zinc-900 dark:bg-zinc-800 dark:hover:bg-white text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-900 hover:text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 transition whitespace-nowrap"
                                                        >
                                                            Cetak
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
