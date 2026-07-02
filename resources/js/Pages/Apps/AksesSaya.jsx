import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AksesSaya({ applications }) {
    const { auth, errors } = usePage().props;

    const handleRequestAccess = (applicationId) => {
        router.post(route('applications.request'), { application_id: applicationId }, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Akses Saya" />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
                    {errors.message && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400">
                            {errors.message}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="flex items-center justify-center h-8 w-8 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition flex-shrink-0 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Akses Saya</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Kelola akses aplikasi terintegrasi</p>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="p-6">
                            {applications.length === 0 ? (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada aplikasi tersedia.</p>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map((app) => {
                                        const userApp = app.user_application;
                                        const isActive = userApp?.is_active;
                                        const hasRequested = !!userApp;

                                        return (
                                            <div key={app.id} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950/40 dark:border-zinc-800">
                                                <div>
                                                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{app.name}</h3>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{app.description || 'Tidak ada deskripsi'}</p>
                                                    {isActive && (
                                                        <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-lg bg-zinc-900 text-white text-[10px] font-extrabold uppercase tracking-wider dark:bg-white dark:text-zinc-950">
                                                            Aktif
                                                        </span>
                                                    )}
                                                    {hasRequested && !isActive && (
                                                        <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider dark:bg-amber-950/20 dark:text-amber-400">
                                                            Menunggu Persetujuan
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    {!hasRequested && (
                                                        <button
                                                            onClick={() => handleRequestAccess(app.id)}
                                                            className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                                                        >
                                                            Request Access
                                                        </button>
                                                    )}
                                                    {isActive && (
                                                        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Tersambung</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
