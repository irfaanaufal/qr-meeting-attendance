import React from 'react';
import { useForm } from '@inertiajs/react';

export default function CreateBriefingForm() {
    const { post, processing } = useForm();

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 space-y-5 lg:sticky lg:top-6 self-start dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-200">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">Buat Briefing Baru</h3>
                    <p className="text-xs text-zinc-400 font-medium">Isi data di halaman detail nanti</p>
                </div>
            </div>

            <button
                onClick={() => post(route('briefings.store'))}
                disabled={processing}
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-700 active:bg-black text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 font-bold text-xs uppercase tracking-widest py-3.5 transition-all shadow-sm disabled:opacity-40 disabled:pointer-events-none"
            >
                {processing ? (
                    <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Memproses...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Buat Briefing
                    </>
                )}
            </button>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                {[
                    'Judul & pemateri diisi di halaman detail',
                    'Waktu mulai = saat dibuat',
                    'Status langsung Draft',
                ].map((info) => (
                    <div key={info} className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                        <svg className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {info}
                    </div>
                ))}
            </div>
        </div>
    );
}
