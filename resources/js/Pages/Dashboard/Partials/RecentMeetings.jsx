import React from 'react';
import { Link } from '@inertiajs/react';

export default function RecentMeetings({ recentMeetings, user }) {
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:h-full h-auto dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-200">
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">Rapat Terbaru</h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">6 rapat paling terakhir</p>
                </div>
                <Link
                    href={route('meetings.index')}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white uppercase tracking-widest flex items-center gap-1 transition"
                >
                    Lihat Semua
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>

            {recentMeetings.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-14 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                        <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Belum ada rapat</p>
                    <p className="text-xs text-zinc-400 mt-1">
                        Buat di halaman{' '}
                        <Link href={route('meetings.index')} className="font-bold text-zinc-900 dark:text-white underline underline-offset-2">Rapat</Link>.
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
                    {recentMeetings.map((meeting) => (
                        <div key={meeting.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${meeting.status === 'On-Progress' ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                                <div className="min-w-0">
                                    <Link
                                        href={route('meetings.show', meeting.id)}
                                        className="block font-extrabold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition tracking-tight text-sm truncate"
                                    >
                                        {meeting.judul_rapat}
                                    </Link>
                                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                                        {formatDate(meeting.tanggal_jam)}
                                        {user.role === 'superadmin' && meeting.user && (
                                            <> &bull; <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{meeting.user.name}</span></>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-zinc-500">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {meeting.absensi_count}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${meeting.status === 'On-Progress'
                                        ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                                        : 'bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700'
                                    }`}>
                                    {meeting.status === 'On-Progress' && (
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75 dark:bg-zinc-900" />
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white dark:bg-zinc-900" />
                                        </span>
                                    )}
                                    {meeting.status === 'On-Progress' ? 'Aktif' : 'Tutup'}
                                </span>
                                <Link
                                    href={route('meetings.show', meeting.id)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 text-zinc-500 dark:text-zinc-400 transition"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
