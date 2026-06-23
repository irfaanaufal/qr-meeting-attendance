import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import StatCards from './Dashboard/Partials/StatCards';
import DashboardCharts from './Dashboard/Partials/DashboardCharts';
import RecentMeetings from './Dashboard/Partials/RecentMeetings';

export default function Dashboard({ stats, divisiData, dailyData, recentMeetings }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-6 bg-zinc-50 dark:bg-zinc-950 lg:h-[calc(100vh-84px)] lg:overflow-hidden flex flex-col transition-colors duration-200">
                <div className="w-full lg:h-full px-4 sm:px-6 lg:px-8 space-y-6 flex flex-col">

                    {/* Flash */}
                    {flash?.success && (
                        <div className="rounded-xl bg-white border border-zinc-200 p-4 flex items-center gap-3 shadow-sm flex-shrink-0 dark:bg-zinc-900 dark:border-zinc-800">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-xl bg-white border border-red-200 p-4 flex items-center gap-3 shadow-sm flex-shrink-0 dark:bg-zinc-900 dark:border-red-950/30">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{flash.error}</span>
                        </div>
                    )}

                    <div className="flex-shrink-0">
                        <StatCards stats={stats} />
                    </div>

                    <div className="flex-shrink-0">
                        <DashboardCharts 
                            stats={stats} 
                            dailyData={dailyData} 
                            divisiData={divisiData} 
                        />
                    </div>

                    <div className="flex-1 min-h-0">
                        <RecentMeetings 
                            recentMeetings={recentMeetings} 
                            user={user} 
                        />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
