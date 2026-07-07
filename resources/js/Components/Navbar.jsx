import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import LightPullThemeSwitcher from '@/Components/LightPullThemeSwitcher';

export default function Navbar({ user }) {
    const { props } = usePage();
    const meeting = props.meeting;
    const isEndedDetail = route().current('meetings.show') && meeting?.status === 'Ended';

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingUserDropdown, setShowingUserDropdown] = useState(false);
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
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
            <nav className="mx-auto w-full max-w-full flex h-14 items-center justify-between rounded-full bg-white border border-zinc-200 px-4 sm:px-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                
                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-5">
                    <Link href="/" className="flex items-center justify-center transition hover:scale-105">
                        <ApplicationLogo className="h-8 w-auto object-contain" />
                    </Link>
                    
                    <div className="hidden sm:block h-5 w-px bg-zinc-200 dark:bg-zinc-800"></div>

                    <div className="hidden sm:flex items-center gap-4">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </NavLink>
                        <NavLink href={route('meetings.index')} active={(route().current('meetings.index') || route().current('meetings.show')) && !isEndedDetail}>
                            Rapat
                        </NavLink>
                        <NavLink href={route('meetings.history')} active={route().current('meetings.history') || isEndedDetail}>
                            Riwayat
                        </NavLink>
                        <NavLink href={route('briefings.index')} active={route().current('briefings.index') || route().current('briefings.show')}>
                            Briefing
                        </NavLink>
                        <NavLink href={route('briefings.history')} active={route().current('briefings.history')}>
                            Riwayat Briefing
                        </NavLink>

                    </div>
                </div>

                {/* Right: Auth / User */}
                <div className="hidden sm:flex items-center gap-5">
                    {/* Dark Mode Pull Switcher */}
                    <LightPullThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
                    <div className="relative">
                        <button
                            onClick={() => setShowingUserDropdown(!showingUserDropdown)}
                            className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition focus:outline-none flex items-center gap-1.5 py-2"
                        >
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-black">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                            <span>{user.name}</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showingUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {showingUserDropdown && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setShowingUserDropdown(false)}
                                />
                                
                                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30 dark:bg-zinc-900 dark:border-zinc-800">
                                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-850">
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Masuk sebagai</p>
                                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{user.name}</p>
                                    </div>
                                    <Link
                                        href={route('profile.edit')}
                                        onClick={() => setShowingUserDropdown(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 transition"
                                    >
                                        <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Edit Profil
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition"
                                    >
                                        <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                        </svg>
                                        Log Out
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile hamburger */}
                <div className="flex sm:hidden">
                    <button
                        onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                        className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none transition"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden mt-2 border border-zinc-200 rounded-2xl bg-white shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800'}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                        Dashboard
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('meetings.index')}
                        active={(route().current('meetings.index') || route().current('meetings.show')) && !isEndedDetail}
                    >
                        Rapat
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('meetings.history')}
                        active={route().current('meetings.history') || isEndedDetail}
                    >
                        Riwayat
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('briefings.index')}
                        active={route().current('briefings.index') || route().current('briefings.show')}
                    >
                        Briefing
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('briefings.history')}
                        active={route().current('briefings.history')}
                    >
                        Riwayat Briefing
                    </ResponsiveNavLink>

                    {/* Mobile Toggle Mode */}
                    <button
                        onClick={toggleTheme}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white transition"
                    >
                        <span>Mode Gelap</span>
                        <span>{theme === 'dark' ? 'Aktif' : 'Nonaktif'}</span>
                    </button>
                </div>
                <div className="border-t border-zinc-100 px-4 py-3 space-y-1 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3 mb-3">
                        {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white text-xs font-black dark:bg-white dark:text-zinc-900">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                        </div>
                    </div>
                    <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                    <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                </div>
            </div>
        </div>
    );
}
