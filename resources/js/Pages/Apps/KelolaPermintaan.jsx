import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function KelolaPermintaan({ requests }) {
    const { auth } = usePage().props;

    const handleToggle = (userId, applicationId) => {
        router.patch(route('applications.toggle'), {
            user_id: userId,
            application_id: applicationId,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Permintaan" />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="flex items-center justify-center h-8 w-8 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition flex-shrink-0 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Kelola Permintaan</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Setujui atau tolak permintaan akses pengguna</p>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="p-6">
                            {requests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-950 mb-3">
                                        <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Tidak ada permintaan</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Belum ada pengguna yang mengajukan akses.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {requests.map((req) => (
                                        <div key={req.id} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950/40 dark:border-zinc-800">
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-white text-sm">{req.user?.name}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    Meminta akses ke <span className="font-semibold">{req.application?.name}</span>
                                                </p>
                                                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                                                    {new Date(req.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleToggle(req.user_id, req.application_id)}
                                                className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                                            >
                                                Setujui
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
