import React from 'react';
import {
    Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';

function EmptyChart() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-3">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <p className="text-[10px] font-bold text-zinc-400">Belum ada data</p>
        </div>
    );
}

export default function DashboardCharts({ stats, dailyData, divisiData, briefingDailyData, briefingDivisiData }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Bar: Rapat 7 Hari Terakhir */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-3 flex flex-col dark:bg-zinc-900 dark:border-zinc-800">
                <div className="mb-2 flex-shrink-0">
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-xs tracking-tight">Rapat per Hari</h3>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">7 hari terakhir</p>
                </div>
                <div className="flex-1 min-h-0">
                    {stats.totalMeetings === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData} barSize={24} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, border: '1px solid var(--chart-tooltip-border)', backgroundColor: 'var(--chart-tooltip-bg)', color: 'var(--chart-text)', fontSize: 11 }}
                                    formatter={(v) => [`${v} rapat`, 'Jumlah']}
                                />
                                <Bar dataKey="rapat" fill="var(--chart-fill)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Bar: Briefing 7 Hari Terakhir */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-3 flex flex-col dark:bg-zinc-900 dark:border-zinc-800">
                <div className="mb-2 flex-shrink-0">
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-xs tracking-tight">Briefing per Hari</h3>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">7 hari terakhir</p>
                </div>
                <div className="flex-1 min-h-0">
                    {(briefingDailyData?.every(d => d.briefing === 0) || !briefingDailyData?.length) ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={briefingDailyData} barSize={24} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, border: '1px solid var(--chart-tooltip-border)', backgroundColor: 'var(--chart-tooltip-bg)', color: 'var(--chart-text)', fontSize: 11 }}
                                    formatter={(v) => [`${v} briefing`, 'Jumlah']}
                                />
                                <Bar dataKey="briefing" fill="var(--chart-fill)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Line: Absensi per Divisi */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-3 flex flex-col dark:bg-zinc-900 dark:border-zinc-800">
                <div className="mb-2 flex-shrink-0">
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-xs tracking-tight">Absensi per Divisi</h3>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Total kehadiran per divisi karyawan</p>
                </div>
                <div className="flex-1 min-h-0">
                    {divisiData.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={divisiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 10, border: '1px solid var(--chart-tooltip-border)', backgroundColor: 'var(--chart-tooltip-bg)', color: 'var(--chart-text)', fontSize: 11 }}
                                    formatter={(v) => [`${v} hadir`, 'Jumlah']}
                                />
                                <Line type="monotone" dataKey="value" stroke="var(--chart-fill)" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 2, fill: 'var(--chart-tooltip-bg)' }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
