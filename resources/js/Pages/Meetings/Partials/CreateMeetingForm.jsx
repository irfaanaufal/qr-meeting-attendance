import React from 'react';
import { useForm } from '@inertiajs/react';

export default function CreateMeetingForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        judul_rapat: '',
        ringkasan: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('meetings.store'), { onSuccess: () => reset() });
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 space-y-5 lg:sticky lg:top-6 self-start dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-200">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">Buat Rapat Baru</h3>
                    <p className="text-xs text-zinc-400 font-medium">Instan & otomatis aktif</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="judul_rapat" className="block text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.15em] mb-1.5">
                        Judul Rapat <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="judul_rapat"
                        type="text"
                        value={data.judul_rapat}
                        placeholder="Contoh: Evaluasi QC Line 2"
                        className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-300 dark:focus:ring-zinc-300 transition-all duration-200"
                        onChange={(e) => setData('judul_rapat', e.target.value)}
                        disabled={processing}
                        required
                    />
                    {errors.judul_rapat && (
                        <p className="mt-1 text-xs text-red-600 font-semibold">{errors.judul_rapat}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="ringkasan" className="block text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.15em] mb-1.5">
                        Ringkasan Agenda <span className="text-zinc-400">(Opsional)</span>
                    </label>
                    <textarea
                        id="ringkasan"
                        value={data.ringkasan}
                        placeholder="Deskripsikan agenda singkat rapat..."
                        rows="3"
                        className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-300 dark:focus:ring-zinc-300 transition-all duration-200 resize-none"
                        onChange={(e) => setData('ringkasan', e.target.value)}
                        disabled={processing}
                    />
                </div>

                <button
                    type="submit"
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
                            Buat Rapat & Generate QR
                        </>
                    )}
                </button>
            </form>

            {/* Info checklist */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                {[
                    'Host & divisi dikunci otomatis',
                    'Waktu mulai = saat dibuat',
                    'Status langsung aktif (On-Progress)',
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
