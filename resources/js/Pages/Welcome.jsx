import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Selamat Datang" />
            <div className="min-h-screen bg-zinc-50 selection:bg-zinc-900 selection:text-white flex flex-col">

                {/* Navbar */}
                <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 bg-zinc-50">
                    <nav className="mx-auto w-full max-w-full flex h-14 items-center justify-between rounded-full bg-white border border-zinc-200 px-3 sm:px-6 shadow-sm">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="flex h-8 w-auto shrink-0 items-center justify-center">
                                <ApplicationLogo className="h-7 w-auto object-contain" />
                            </div>

                            <div className="hidden sm:block h-5 w-px bg-zinc-200"></div>

                            <span className="hidden sm:block font-black text-zinc-900 text-sm tracking-tight uppercase">Absensi Meeting</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-5">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="flex items-center gap-1.5 justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition focus:outline-none"
                                >
                                    Dashboard <span className="text-sm sm:text-lg leading-none">&rarr;</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-zinc-900 transition focus:outline-none"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="flex items-center gap-1.5 justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition focus:outline-none shrink-0"
                                    >
                                        Daftar <span className="hidden sm:inline text-lg leading-none">&rarr;</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Hero */}
                <main className="flex-1 mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-6 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 inline-block" />
                            System v2.0
                        </span>
                        <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 tracking-tight leading-[1.1] mb-6">
                            Absensi Rapat
                            <br />
                            <span className="text-zinc-400">Digital & Modern</span>
                        </h1>
                        <p className="text-lg text-zinc-500 font-medium leading-relaxed max-w-xl mb-10">
                            Sistem absensi berbasis Fingerprint ID (FID) yang terintegrasi penuh — dari pembuatan rapat, QR Code, hingga laporan kehadiran real-time.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white uppercase tracking-widest hover:bg-zinc-700 transition shadow-sm">
                                    Buka Dashboard
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('register')} className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white uppercase tracking-widest hover:bg-zinc-700 transition shadow-sm">
                                        Mulai Sekarang
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {[
                            {
                                icon: (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                ),
                                title: 'Buat Rapat Instan',
                                desc: 'Buat rapat dalam 1 klik. Host, divisi, dan waktu dikunci otomatis.',
                            },
                            {
                                icon: (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ),
                                title: 'Absen via QR & FID',
                                desc: 'Karyawan scan QR, masukkan FID — sistem validasi otomatis.',
                            },
                            {
                                icon: (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                ),
                                title: 'Live Attendance',
                                desc: 'Pantau kehadiran real-time lengkap dengan nama, divisi, dan jam absen.',
                            },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-3 hover:shadow-md transition">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
                                    {feature.icon}
                                </div>
                                <h3 className="font-extrabold text-zinc-900 text-sm tracking-tight">{feature.title}</h3>
                                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-zinc-200 bg-zinc-50 py-8">
                    <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} Absensi Meeting FID &bull; Laravel + React + Inertia.js
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
