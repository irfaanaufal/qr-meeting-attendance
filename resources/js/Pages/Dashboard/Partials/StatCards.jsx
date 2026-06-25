import React from 'react';

export default function StatCards({ stats }) {
    const statCards = [
        {
            label: 'Total Rapat',
            value: stats.totalMeetings,
            sub: 'semua rapat terdaftar',
            icon: (
                <svg className="w-5 h-5 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            )
        },
        {
            label: 'Rapat Aktif',
            value: stats.activeMeetings,
            sub: 'sedang dibuka',
            dark: stats.activeMeetings > 0,
            icon: (
                <svg className={`w-5 h-5 ${stats.activeMeetings > 0 ? 'text-zinc-900 dark:text-white animate-pulse' : 'text-zinc-400 dark:text-zinc-500'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
                </svg>
            )
        },
        {
            label: 'Rapat Ditutup',
            value: stats.closedMeetings,
            sub: 'sudah selesai',
            icon: (
                <svg className="w-5 h-5 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18M10 16l2 2 4-4" />
                </svg>
            )
        },
        {
            label: 'Total Absensi',
            value: stats.totalAttendees,
            sub: 'kehadiran tercatat',
            icon: (
                <svg className="w-5 h-5 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16 11 2 2 4-4" />
                </svg>
            )
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
                <div
                    key={card.label}
                    className={`bg-white border rounded-2xl shadow-sm p-5 flex flex-col gap-2 ${card.dark ? 'border-zinc-900 dark:border-white' : 'border-zinc-200 dark:border-zinc-800'} dark:bg-zinc-900`}
                >
                    <div className="flex items-start justify-between w-full">
                        <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-[0.15em] leading-tight dark:text-zinc-500">{card.label}</p>
                        <div className="flex-shrink-0">
                            {card.icon}
                        </div>
                    </div>
                    <p className="text-4xl font-black leading-none text-zinc-900 dark:text-white">{card.value}</p>
                    <p className="text-[11px] text-zinc-400 font-medium dark:text-zinc-500">{card.sub}</p>
                </div>
            ))}
        </div>
    );
}

