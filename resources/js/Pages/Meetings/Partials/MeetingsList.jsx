import React from 'react';
import { Link } from '@inertiajs/react';

export default function MeetingsList({ meetings, filtered, searchQuery, setSearchQuery, user }) {
    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateStr).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm lg:col-span-2 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-200">
            {/* List Header + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">
                            {user.role === 'superadmin' ? 'Semua Rapat Sistem' : 'Daftar Rapat Anda'}
                        </h3>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                            {filtered.length} dari {meetings.length} rapat
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari rapat..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 pl-10 pr-4 py-2.5 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-300 dark:focus:ring-zinc-300 dark:focus:bg-zinc-900 transition-all"
                    />
                </div>
            </div>

            {/* List Body */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                        <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                        {searchQuery ? 'Rapat tidak ditemukan' : 'Belum ada rapat terdaftar'}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
                        {searchQuery
                            ? 'Coba kata kunci lain atau hapus filter.'
                            : 'Gunakan form di sebelah kiri untuk membuat rapat pertama.'}
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto">
                    {filtered.map((meeting) => (
                        <div
                            key={meeting.id}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition duration-200"
                        >
                            <div className="flex items-start gap-4 min-w-0">
                                {/* Status indicator */}
                                <div className={`mt-1 flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                                    meeting.status === 'On-Progress' ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'
                                }`} />
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${
                                            meeting.status === 'On-Progress'
                                                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                                                : 'bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700'
                                        }`}>
                                            {meeting.status === 'On-Progress' && (
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75 dark:bg-zinc-900" />
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white dark:bg-zinc-900" />
                                                </span>
                                            )}
                                            {meeting.status === 'On-Progress' ? 'Aktif' : 'Ditutup'}
                                        </span>
                                        <span className="text-[9px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em]">
                                            {meeting.divisi_pemateri}
                                        </span>
                                    </div>
                                    <Link
                                        href={route('meetings.show', meeting.id)}
                                        className="block font-extrabold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition tracking-tight text-sm truncate"
                                    >
                                        {meeting.judul_rapat}
                                    </Link>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                                        {formatDate(meeting.tanggal_jam)}
                                        &nbsp;&bull;&nbsp;
                                        <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                                            <svg className="inline w-3 h-3 mr-0.5 -mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {meeting.absensi_count} Hadir
                                        </span>
                                        {user.role === 'superadmin' && (
                                            <> &bull; <span className="font-semibold text-zinc-700 dark:text-zinc-300">{meeting.user?.name || 'Unknown'}</span></>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={route('meetings.show', meeting.id)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-900 dark:bg-zinc-800 dark:hover:bg-white text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-900 hover:text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 transition whitespace-nowrap flex-shrink-0 shadow-sm"
                            >
                                QR & Absensi
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
