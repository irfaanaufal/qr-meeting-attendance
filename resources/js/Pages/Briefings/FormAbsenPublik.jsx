import React, { useEffect, useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

export default function FormAbsenPublik({ briefing, flash }) {
    const [fid, setFid] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    const isDone = !!flash?.success;
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const toggleDark = () => {
        const next = !isDark;
        if (next) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        setIsDark(next);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!fid.trim()) return;
        setIsSubmitting(true);
        router.post(route('absen.briefing.submit', briefing.id), { fid }, {
            onSuccess: () => { setFid(''); setIsSubmitting(false); if (inputRef.current) inputRef.current.focus(); },
            onError: () => { setIsSubmitting(false); },
            onFinish: () => { setIsSubmitting(false); },
        });
    };

    const formatDateTime = (dateStr) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateStr).toLocaleDateString('id-ID', options);
    };

    const isOpen = briefing.status === 'Draft' && briefing.absensi_dibuka;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'}`}>
            <Head title={`Absen Briefing - ${briefing.judul_briefing}`} />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>

            <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8">
                <button
                    onClick={toggleDark}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all z-10"
                    title="Toggle Dark Mode"
                >
                    {isDark ? (
                        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>

                {!isOpen && briefing.status === 'Draft' && !briefing.absensi_dibuka && (
                    <div className="w-full max-w-lg mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-sm font-semibold text-center">
                        Absensi untuk briefing ini sedang ditutup oleh host.
                    </div>
                )}

                {!isOpen && briefing.status !== 'Draft' && (
                    <div className="w-full max-w-lg mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm font-semibold text-center">
                        Briefing ini sudah selesai. Absensi tidak tersedia.
                    </div>
                )}

                <div
                    className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden transition-all duration-500 ${
                        isDark
                            ? 'bg-zinc-900 border-zinc-800 shadow-zinc-950/50'
                            : 'bg-white border-zinc-200/70 shadow-zinc-900/10'
                    } ${isOpen ? 'hover:shadow-3xl' : 'opacity-90'}`}
                    style={isOpen ? { animation: 'float 4s ease-in-out infinite' } : {}}
                >
                    <div className={`px-8 py-5 text-center border-b ${
                        isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-zinc-100 bg-zinc-50/50'
                    }`}>
                        <div className={`text-[10px] font-extrabold uppercase tracking-[0.2em] mb-1 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                            {isDone ? 'Kehadiran Terkonfirmasi' : isOpen ? 'Absensi Sedang Dibuka' : 'Absensi Ditutup'}
                        </div>
                        <h1 className={`text-xl font-black tracking-tight ${
                            isDark ? 'text-white' : 'text-zinc-900'
                        }`}>
                            {briefing.judul_briefing}
                        </h1>
                        <div className={`mt-2 flex items-center justify-center gap-4 text-xs font-medium ${
                            isDark ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>
                            <span>{briefing.user?.name}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                            <span>{briefing.divisi_pemateri || 'Umum'}</span>
                        </div>
                        <p className={`text-[11px] mt-1.5 font-medium ${
                            isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                            {isDone ? 'Absensi Berhasil Dicatat' : formatDateTime(briefing.tanggal_jam)}
                        </p>
                    </div>

                    {isDone ? (
                        <div className="p-8 space-y-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white shadow-sm">
                                <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Sukses!</h3>
                                <div className={`p-5 rounded-2xl border text-sm font-bold leading-relaxed ${
                                    isDark
                                        ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300'
                                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                }`}>
                                    {flash.success}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={submit} className="p-8 space-y-6">
                                <div className="text-center space-y-1.5">
                                    <label htmlFor="fid" className={`text-xs font-bold uppercase tracking-widest ${
                                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                                    }`}>
                                        Masukkan Fingerprint ID (FID)
                                    </label>
                                    <p className={`text-[10px] ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                        Scan sidik jari atau ketik nomor FID Anda
                                    </p>
                                </div>

                                <input
                                    ref={inputRef}
                                    id="fid"
                                    type="text"
                                    inputMode="numeric"
                                    value={fid}
                                    onChange={(e) => setFid(e.target.value)}
                                    placeholder="0123456789"
                                    disabled={!isOpen || isSubmitting}
                                    autoComplete="off"
                                    className={`w-full text-center text-4xl font-mono font-extrabold tracking-[0.15em] px-6 py-6 rounded-2xl border-2 outline-none transition-all duration-200 ${
                                        isDark
                                            ? 'bg-zinc-950 text-white border-zinc-700 placeholder-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
                                            : 'bg-zinc-50 text-zinc-900 border-zinc-200 placeholder-zinc-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20'
                                    } ${!isOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />

                                <button
                                    type="submit"
                                    disabled={!isOpen || isSubmitting || !fid.trim()}
                                    className={`w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all duration-200 shadow-lg ${
                                        isDark
                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-zinc-800 disabled:text-zinc-600'
                                            : 'bg-zinc-900 hover:bg-zinc-700 text-white disabled:bg-zinc-200 disabled:text-zinc-400'
                                    } disabled:shadow-none disabled:cursor-not-allowed`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Memproses...
                                        </span>
                                    ) : (
                                        'Absen Sekarang'
                                    )}
                                </button>
                            </form>

                            {flash?.error && (
                                <div className={`mx-8 mb-6 p-4 rounded-2xl border text-sm font-bold text-center transition-all ${
                                    isDark
                                        ? 'bg-red-950/40 border-red-900/50 text-red-300'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                    {flash.error}
                                </div>
                            )}
                        </>
                    )}

                    <div className={`px-8 py-4 border-t text-center text-[10px] font-bold uppercase tracking-[0.25em] ${
                        isDark ? 'border-zinc-800 text-zinc-700' : 'border-zinc-100 text-zinc-300'
                    }`}>
                        FID Absensi v2.0 &bull; Briefing
                    </div>
                </div>

                <p className={`mt-6 text-[11px] font-medium text-center ${
                    isDark ? 'text-zinc-600' : 'text-zinc-400'
                }`}>
                    &copy; {new Date().getFullYear()} PT. Sindang Asih Makmur
                </p>
            </div>
        </div>
    );
}
