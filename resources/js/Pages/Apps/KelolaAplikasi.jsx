import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function KelolaAplikasi({ applications }) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        slug: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.applications.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Aplikasi" />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="flex items-center justify-center h-8 w-8 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition flex-shrink-0 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Kelola Aplikasi</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Daftar aplikasi terintegrasi</p>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950/40 dark:border-zinc-800">
                                <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-3">Tambah Aplikasi Baru</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Nama Aplikasi"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-all dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="slug-aplikasi"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-all dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Deskripsi (opsional)"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-all dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50"
                                        >
                                            {processing ? '...' : 'Simpan'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {applications.length === 0 ? (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada aplikasi.</p>
                            ) : (
                                <div className="space-y-3">
                                    {applications.map((app) => (
                                        <div key={app.id} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950/40 dark:border-zinc-800">
                                            <div>
                                                <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{app.name}</h3>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">/{app.slug}</p>
                                            </div>
                                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                                                {app.user_applications_count} pengguna
                                            </span>
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
