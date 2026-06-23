import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import LightPullThemeSwitcher from '@/Components/LightPullThemeSwitcher';

export default function GuestLayout({ children }) {
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

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 py-12 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 transition-colors duration-200">
            {/* Decorative top bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 dark:bg-white" />

            {/* Dark Mode Pull Switcher */}
            <div className="fixed top-0 right-10 z-50">
                <LightPullThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            </div>

            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="flex flex-col items-center gap-3">
                    <Link href="/" className="group flex items-center justify-center h-14 w-14 rounded-2xl bg-white border border-zinc-200 shadow-md transition hover:scale-105 dark:bg-zinc-900 dark:border-zinc-800">
                        <ApplicationLogo className="h-10 w-10 object-contain" />
                    </Link>
                    <div className="text-center">
                        <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Absensi Meeting</h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-widest uppercase mt-0.5">Digital Attendance System</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white border border-zinc-200 rounded-2xl shadow-md px-8 py-8 dark:bg-zinc-900 dark:border-zinc-800">
                    {children}
                </div>

                <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} &bull; FID Attendance v2.0
                </p>
            </div>
        </div>
    );
}
