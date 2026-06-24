import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';
import LightPullThemeSwitcher from '@/Components/LightPullThemeSwitcher';

export default function FormAbsenPublik({ meeting, flash, errors, alreadyAttendedOnDevice }) {
    const { auth } = usePage().props;
    const isHost = auth?.user !== null && auth?.user !== undefined;

    const { data, setData, post, processing, reset } = useForm({ fid: '' });

    if (flash?.error && typeof window !== 'undefined') {
        localStorage.removeItem('has_attended_' + meeting.id);
    }

    const localCheck = typeof window !== 'undefined' ? localStorage.getItem('has_attended_' + meeting.id) === 'true' : false;
    const isBlocked = !isHost && (alreadyAttendedOnDevice || localCheck) && !flash?.success;
    const isDone = flash?.success || isBlocked;
    const isActive = meeting.status === 'On-Progress';

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'light';
    });

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        setTheme(nextTheme);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('absen.meeting.submit', meeting.id), {
            onSuccess: (page) => {
                if (page.props.flash?.success && !isHost) {
                    localStorage.setItem('has_attended_' + meeting.id, 'true');
                }
                reset('fid');
            },
            preserveScroll: true,
        });
    };

    const formatDateTime = (dateStr) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateStr).toLocaleDateString('id-ID', options);
    };

    // Smooth Spring-Loaded 3D Card Hover logic from travel card
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);
    const rotateX = useTransform(springY, [-0.5, 0.5], ["10.5deg", "-10.5deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-10.5deg", "10.5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const { width, height, left, top } = rect;
        const mouseXVal = e.clientX - left;
        const mouseYVal = e.clientY - top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 transition-colors duration-200 overflow-hidden">
            <Head title={`Konfirmasi Hadir - ${meeting.judul_rapat}`} />

            {/* Clean, professional background grid pattern (no neon colored blurs) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Top accent line */}
            <div className="fixed top-0 left-0 w-full h-1 bg-zinc-950 dark:bg-white z-40" />

            {/* Dark Mode Pull Switcher */}
            <div className="fixed top-0 right-10 z-50">
                <LightPullThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            </div>

            <div className="relative z-10 w-full max-w-md space-y-5">


                {/* 3D Glassmorphism Main Card wrapper with perspective */}
                <div className="perspective-1000 w-full relative">
                    
                    {/* Main Interactive card utilizing Framer Motion transforms */}
                    <motion.div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="relative w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl transition-colors duration-200"
                    >
                        {/* Parallax inner container */}
                        <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="w-full">
                            
                            {/* Card Header (Sleek dark translucent band with 3D translation) */}
                            <div 
                                style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}
                                className="px-6 py-5 text-white text-center bg-zinc-950 dark:bg-black border-b border-zinc-850 dark:border-zinc-950"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isDone ? (
                                        <svg className="h-5 w-5 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                    <h2 className="text-sm font-black uppercase tracking-[0.15em]">
                                        {isDone ? 'Kehadiran Terkonfirmasi' : 'Konfirmasi Kehadiran'}
                                    </h2>
                                </div>
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">
                                    {isDone ? 'Absensi Berhasil Dicatat' : 'Absensi Meeting Digital'}
                                </p>
                            </div>

                            <div className="p-6 space-y-5" style={{ transformStyle: 'preserve-3d' }}>
                                {/* Success / Blocked State */}
                                {isDone ? (
                                    <div 
                                        style={{ transform: 'translateZ(15px)', transformStyle: 'preserve-3d' }} 
                                        className="text-center py-4 space-y-5"
                                    >
                                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white shadow-sm">
                                            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Sukses!</h3>
                                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-sm text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 font-medium leading-relaxed shadow-sm">
                                                {flash?.success ? flash.success : 'Anda sudah melakukan absensi pada rapat ini.'}
                                            </div>
                                        </div>
                                        {isBlocked && (
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed px-2">
                                                Demi integritas data, sistem membatasi 1 perangkat untuk 1 kali absensi per rapat.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Meeting Info (Glass card inner layer) */}
                                        <div 
                                            style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                                            className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4 text-sm dark:bg-zinc-950/40 dark:border-zinc-800/60 shadow-sm animate-fade-in"
                                        >
                                            <div>
                                                <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em] block mb-1">Judul Rapat</span>
                                                <span className="font-extrabold text-zinc-900 dark:text-white text-base leading-snug tracking-tight">{meeting.judul_rapat}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/40">
                                                <div>
                                                    <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em] block mb-1">Pemateri (Divisi)</span>
                                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">
                                                        {meeting.user?.name || 'Host'} ({meeting.divisi_pemateri || 'Umum'})
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em] block mb-1">Status</span>
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${
                                                        isActive
                                                            ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white shadow-sm'
                                                            : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                                    }`}>
                                                        {isActive && (
                                                            <span className="relative flex h-1.5 w-1.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-zinc-950 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white dark:bg-zinc-950"></span>
                                                            </span>
                                                        )}
                                                        {isActive ? 'Dibuka' : 'Ditutup'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/40">
                                                <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em] block mb-1">Waktu Mulai</span>
                                                <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">{formatDateTime(meeting.tanggal_jam)}</span>
                                            </div>
                                        </div>

                                        {/* Error Alert */}
                                        {flash?.error && (
                                            <div 
                                                style={{ transform: 'translateZ(25px)' }}
                                                className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300 text-sm flex items-start gap-3"
                                            >
                                                <svg className="w-5 h-5 flex-shrink-0 text-red-500 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <div>
                                                    <span className="font-bold block mb-0.5">Absensi Gagal</span>
                                                    <span className="font-medium">{flash.error}</span>
                                                </div>
                                            </div>
                                        )}

                                        {isActive ? (
                                            <form onSubmit={submit} className="space-y-5" style={{ transformStyle: 'preserve-3d' }}>
                                                <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
                                                    <label htmlFor="fid" className="block text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.18em] mb-2.5">
                                                        Masukkan Fingerprint ID (FID) Anda
                                                    </label>
                                                    <input
                                                        id="fid"
                                                        type="text"
                                                        value={data.fid}
                                                        placeholder="Contoh: 81 atau 112"
                                                        className="w-full rounded-2xl border-2 border-zinc-200 bg-white text-zinc-900 placeholder-zinc-300 px-5 py-5 shadow-sm focus:border-zinc-900 focus:ring-0 focus:outline-none transition-all text-center text-4xl font-mono font-black tracking-[0.3em] dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-700 dark:focus:border-zinc-200"
                                                        onChange={(e) => setData('fid', e.target.value)}
                                                        disabled={processing}
                                                        required
                                                        autoFocus
                                                    />
                                                    {errors?.fid && (
                                                        <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.fid}</p>
                                                    )}
                                                </div>

                                                <div style={{ transform: 'translateZ(25px)' }}>
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:bg-black text-white font-bold text-sm uppercase tracking-[0.15em] py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-150 dark:active:bg-zinc-300"
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                </svg>
                                                                Mengonfirmasi...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Konfirmasi Kehadiran
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div 
                                                style={{ transform: 'translateZ(20px)' }}
                                                className="flex flex-col items-center text-center py-6 text-zinc-500 space-y-3"
                                            >
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-800/30 shadow-sm">
                                                    <svg className="h-7 w-7 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Absensi Sudah Ditutup</p>
                                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">Hubungi host/pemateri untuk membukanya kembali.</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Card Footer (Glass bottom band) */}
                            <div 
                                style={{ transform: 'translateZ(10px)' }}
                                className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-3.5 text-center bg-zinc-50 dark:bg-zinc-950"
                            >
                                <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.25em]">
                                    Absensi Meeting FID v2.0 &bull; Laravel + React
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>


            </div>
        </div>
    );
}
