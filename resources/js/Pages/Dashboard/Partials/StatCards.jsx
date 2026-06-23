import React from 'react';

export default function StatCards({ stats }) {
    const statCards = [
        { label: 'Total Rapat',    value: stats.totalMeetings,  sub: 'semua rapat terdaftar' },
        { label: 'Rapat Aktif',    value: stats.activeMeetings, sub: 'sedang dibuka',  dark: stats.activeMeetings > 0 },
        { label: 'Rapat Ditutup',  value: stats.closedMeetings, sub: 'sudah selesai' },
        { label: 'Total Absensi',  value: stats.totalAttendees, sub: 'kehadiran tercatat' },
        { label: 'Rata-rata Hadir',value: stats.avgAttendees,   sub: 'per rapat' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map((card) => (
                <div
                    key={card.label}
                    className={`bg-white border rounded-2xl shadow-sm p-5 flex flex-col gap-2 ${card.dark ? 'border-zinc-900 dark:border-white' : 'border-zinc-200 dark:border-zinc-800'} dark:bg-zinc-900`}
                >
                    <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-[0.15em] leading-tight dark:text-zinc-500">{card.label}</p>
                    <p className="text-4xl font-black leading-none text-zinc-900 dark:text-white">{card.value}</p>
                    <p className="text-[11px] text-zinc-400 font-medium dark:text-zinc-500">{card.sub}</p>
                </div>
            ))}
        </div>
    );
}
