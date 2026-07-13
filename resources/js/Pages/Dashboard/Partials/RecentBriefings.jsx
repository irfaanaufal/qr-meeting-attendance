import React from 'react';
import { Link } from '@inertiajs/react';

export default function RecentBriefings({ recentBriefings, user }) {
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-200">
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-extrabold text-zinc-900 dark:text-white text-[11px] tracking-tight">Briefing Terbaru</h3>
                <Link
                    href={route('briefings.index')}
                    className="text-[9px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white uppercase tracking-widest flex items-center gap-1 transition"
                >
                    Semua
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>

            {recentBriefings.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                    <p className="font-bold text-zinc-700 dark:text-zinc-300 text-[11px]">Belum ada briefing</p>
                </div>
            ) : (
                <div className="flex-1 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {recentBriefings.map((briefing) => (
                        <div key={briefing.id} className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className={`flex-shrink-0 h-1.5 w-1.5 rounded-full ${briefing.status === 'Draft' ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                                <div className="min-w-0">
                                    <Link
                                        href={route('briefings.show', briefing.id)}
                                        className="block font-extrabold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition tracking-tight text-[11px] truncate"
                                    >
                                        {briefing.judul_briefing || '(Belum diisi)'}
                                    </Link>
                                    <p className="text-[9px] text-zinc-400 font-medium">
                                        {formatDate(briefing.tanggal_jam)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="items-center gap-0.5 text-[9px] font-bold text-zinc-500 hidden sm:inline-flex">
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {briefing.absensi_count}
                                </span>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase tracking-wider border ${briefing.status === 'Draft'
                                        ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                                        : 'bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700'
                                    }`}>
                                    {briefing.status === 'Draft' ? 'Draft' : 'Selesai'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
