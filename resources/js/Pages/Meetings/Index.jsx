import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import CreateMeetingForm from './Partials/CreateMeetingForm';
import MeetingsList from './Partials/MeetingsList';

export default function MeetingsIndex({ meetings }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = meetings.filter(m => {
        const term = searchQuery.toLowerCase();
        return (
            m.judul_rapat.toLowerCase().includes(term) ||
            (m.divisi_pemateri || '').toLowerCase().includes(term) ||
            (m.user?.name || '').toLowerCase().includes(term)
        );
    });

    return (
        <AuthenticatedLayout>
            <Head title="Rapat" />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">

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

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <CreateMeetingForm />

                        <MeetingsList 
                            meetings={meetings}
                            filtered={filtered}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            user={user}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
