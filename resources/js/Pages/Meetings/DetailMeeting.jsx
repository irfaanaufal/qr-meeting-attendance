import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

export default function DetailMeeting({ meeting, publicAbsenUrl: propPublicAbsenUrl, flash }) {
    const { auth } = usePage().props;
    const currentUser = auth.user;
    const canManage = currentUser.role === 'superadmin' || meeting.user_id === currentUser.id;

    const [searchQuery, setSearchQuery] = useState('');
    const [isToggling, setIsToggling] = useState(false);
    const [isEditingSummary, setIsEditingSummary] = useState(false);
    const [summaryText, setSummaryText] = useState(meeting.ringkasan || '');

    const handleSaveSummary = (e) => {
        e.preventDefault();
        router.patch(route('meetings.update', meeting.id), { ringkasan: summaryText }, {
            preserveScroll: true,
            onSuccess: () => setIsEditingSummary(false),
        });
    };

    const publicAbsenUrl = propPublicAbsenUrl || `${window.location.origin}/absen/meeting/${meeting.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicAbsenUrl)}`;

    const toggleMeetingStatus = () => {
        setIsToggling(true);
        router.post(route('meetings.toggle', meeting.id), {}, {
            preserveScroll: true,
            onFinish: () => setIsToggling(false),
        });
    };

    const endMeeting = () => {
        if (confirm('Apakah Anda yakin ingin mengakhiri rapat ini secara permanen? Rapat akan masuk ke mode Read Only.')) {
            setIsToggling(true);
            router.post(route('meetings.end', meeting.id), {}, {
                preserveScroll: true,
                onFinish: () => setIsToggling(false),
            });
        }
    };

    const canDeleteAbsen = canManage && meeting.status !== 'Ended';

    const handleDeleteAbsen = (absenId, namaKaryawan) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kehadiran untuk ${namaKaryawan || 'karyawan ini'}?`)) {
            router.delete(route('meetings.absensi.destroy', [meeting.id, absenId]), {
                preserveScroll: true,
            });
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        router.post(route('meetings.upload-berkas', meeting.id), {
            berkas: file,
        }, {
            preserveScroll: true,
        });
    };

    const handleDeleteFile = () => {
        if (confirm('Apakah Anda yakin ingin menghapus berkas rapat ini?')) {
            router.delete(route('meetings.delete-berkas', meeting.id), {
                preserveScroll: true,
            });
        }
    };

    const filteredAbsensi = meeting.absensi.filter(item => {
        const karyawan = item.karyawan || {};
        const term = searchQuery.toLowerCase();
        return (
            (karyawan.nama_karyawan || '').toLowerCase().includes(term) ||
            (karyawan.divisi || '').toLowerCase().includes(term) ||
            (karyawan.jabatan || '').toLowerCase().includes(term) ||
            (item.karyawan_fid || '').toLowerCase().includes(term)
        );
    });

    const formatDateTime = (dateStr) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateStr).toLocaleDateString('id-ID', options);
    };

    const formatTime = (timeStr) => {
        return new Date(timeStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicAbsenUrl);
        alert('Tautan absensi berhasil disalin ke clipboard!');
    };

    const isActive = meeting.status === 'On-Progress';
    const isClosed = meeting.status === 'Closed';
    const isEnded = meeting.status === 'Ended';

    return (
        <AuthenticatedLayout>
            <Head title={`Rapat: ${meeting.judul_rapat}`} />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Back + title */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="flex items-center justify-center h-8 w-8 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition flex-shrink-0 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Detail Rapat & Live Absensi</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate max-w-sm">{meeting.judul_rapat}</p>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="rounded-xl bg-white border border-zinc-200 p-4 flex items-center gap-3 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-xl bg-white border border-red-200 p-4 flex items-center gap-3 shadow-sm dark:bg-zinc-900 dark:border-red-950/30">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{flash.error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* Left: Meeting Info + Attendees */}
                        <div className="space-y-6 lg:col-span-2">

                            {/* Meeting Info Card */}
                            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                                {/* Status bar */}
                                <div className={`h-1.5 w-full ${isActive ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-800'}`} />
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="space-y-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${
                                                isActive
                                                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white'
                                                    : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-750'
                                            }`}>
                                                {isActive && (
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-zinc-950 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white dark:bg-zinc-950"></span>
                                                    </span>
                                                )}
                                                {isActive ? 'Pendaftaran Dibuka' : isClosed ? 'Absensi Ditutup' : 'Rapat Selesai (Read-Only)'}
                                            </span>
                                            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                                                {meeting.judul_rapat}
                                            </h1>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                            {canManage && !isEnded && (
                                                <>
                                                    {isActive ? (
                                                        <button
                                                            onClick={toggleMeetingStatus}
                                                            disabled={isToggling}
                                                            className="flex-shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 bg-zinc-100 hover:bg-amber-50 text-zinc-700 hover:text-amber-700 border border-zinc-200 hover:border-amber-200 dark:bg-zinc-800 dark:hover:bg-amber-950/20 dark:text-zinc-300 dark:hover:text-amber-400 dark:border-zinc-700 dark:hover:border-amber-900"
                                                        >
                                                            {isToggling ? 'Memproses...' : '⏹ Tutup Absensi'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={endMeeting}
                                                            disabled={isToggling}
                                                            className="flex-shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white"
                                                        >
                                                            {isToggling ? 'Memproses...' : '🛑 End Meeting'}
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {(isClosed || isEnded) && (
                                                <a
                                                    href={route('meetings.print', meeting.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm bg-zinc-900 hover:bg-zinc-700 text-white border border-zinc-900 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 dark:border-white"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                                    </svg>
                                                    Cetak PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-[0.15em]">Pemateri / Host</p>
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{meeting.user?.name}</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500">{meeting.user?.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-[0.15em]">Divisi Pemateri</p>
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{meeting.divisi_pemateri || 'Umum'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-[0.15em]">Tanggal & Waktu Mulai</p>
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{formatDateTime(meeting.tanggal_jam)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-[0.15em]">Berkas Rapat / Dokumen</p>
                                            {meeting.berkas ? (
                                                <div className="flex items-center justify-between gap-3 p-2 bg-zinc-50 border border-zinc-200 rounded-xl dark:bg-zinc-950/20 dark:border-zinc-800">
                                                    <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                                                        <svg className="w-5 h-5 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                        </svg>
                                                        <div className="truncate">
                                                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate" title={meeting.berkas.split('/').pop()}>
                                                                {meeting.berkas.split('/').pop()}
                                                            </p>
                                                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Tersedia untuk diunduh</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                        <a
                                                            href={`/storage/${meeting.berkas}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 flex items-center justify-center border border-zinc-200 dark:border-zinc-750"
                                                            title="Lihat Berkas"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        </a>
                                                        <a
                                                            href={`/storage/${meeting.berkas}`}
                                                            download
                                                            className="p-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-850 transition dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 flex items-center justify-center"
                                                            title="Unduh Berkas"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                            </svg>
                                                        </a>
                                                        {canManage && !isEnded && (
                                                            <button
                                                                onClick={handleDeleteFile}
                                                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 border border-red-100 dark:border-red-900/30 flex items-center justify-center"
                                                                title="Hapus Berkas"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                canManage && !isEnded ? (
                                                    <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-zinc-300 hover:border-zinc-400 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-950/10 dark:hover:bg-zinc-950/20 dark:text-zinc-400 dark:hover:text-white">
                                                        <svg className="w-4 h-4 text-zinc-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                        Pilih Berkas
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                                                            onChange={handleFileUpload}
                                                        />
                                                    </label>
                                                ) : (
                                                    <p className="text-xs text-zinc-400 italic mt-1">Belum ada berkas rapat.</p>
                                                )
                                            )}
                                        </div>
                                        <div className="sm:col-span-2 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[11px] font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-[0.15em]">Notulensi / Ringkasan</p>
                                                {!isEditingSummary && canManage && (!isEnded || currentUser.role === 'superadmin') && (
                                                    <button
                                                        onClick={() => setIsEditingSummary(true)}
                                                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 21.75a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                                        </svg>
                                                        {meeting.ringkasan ? 'Edit' : 'Tulis Notulensi'}
                                                    </button>
                                                )}
                                            </div>

                                            {isEditingSummary ? (
                                                <form onSubmit={handleSaveSummary} className="space-y-3">
                                                    <textarea
                                                        value={summaryText}
                                                        onChange={(e) => setSummaryText(e.target.value)}
                                                        placeholder="Masukkan ringkasan rapat / notulensi..."
                                                        rows="4"
                                                        className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-all resize-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSummaryText(meeting.ringkasan || ''); setIsEditingSummary(false); }}
                                                            className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:border-zinc-700"
                                                        >Batal</button>
                                                        <button
                                                            type="submit"
                                                            className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white hover:bg-zinc-700 transition shadow-sm dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                                                        >Simpan</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 dark:bg-zinc-950 dark:border-zinc-800">
                                                    {meeting.ringkasan ? (
                                                        <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{meeting.ringkasan}</p>
                                                    ) : (
                                                        <p className="text-xs text-zinc-400 dark:text-zinc-550 italic">Belum ada notulensi. Tambahkan setelah rapat selesai.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendees Table */}
                            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white flex-shrink-0 dark:bg-zinc-850 dark:text-zinc-100">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
                                                    Daftar Kehadiran
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[9px] font-extrabold uppercase tracking-wider">
                                                        {meeting.absensi.length} Orang
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Karyawan yang sudah absen</p>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-64">
                                            <input
                                                type="text"
                                                placeholder="Cari nama, divisi, FID..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm shadow-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-all dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    {filteredAbsensi.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-950 mb-3 animate-pulse">
                                                <svg className="h-7 w-7 text-zinc-400 dark:text-zinc-650" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Belum ada karyawan hadir</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-550 mt-1">Bagikan QR Code atau link untuk mulai absensi.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                                            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                                                <thead className="bg-zinc-50 dark:bg-zinc-950">
                                                    <tr>
                                                        {['No.', 'FID', 'Nama Karyawan', 'Divisi', 'Jabatan', 'Jam Absen'].map(h => (
                                                            <th key={h} scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">
                                                                {h}
                                                            </th>
                                                        ))}
                                                        {canDeleteAbsen && (
                                                            <th scope="col" className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-450 whitespace-nowrap">
                                                                Aksi
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-white dark:bg-zinc-900">
                                                    {filteredAbsensi.map((item, index) => (
                                                        <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition">
                                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                                                #{item.karyawan_fid}
                                                            </td>
                                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                                {item.karyawan?.nama_karyawan || 'N/A'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                                                                {item.karyawan?.divisi || '-'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400 dark:text-zinc-500">
                                                                {item.karyawan?.jabatan || '-'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950">
                                                                {formatTime(item.jam_absen)}
                                                            </td>
                                                            {canDeleteAbsen && (
                                                                <td className="whitespace-nowrap px-5 py-4 text-sm">
                                                                    <button
                                                                        onClick={() => handleDeleteAbsen(item.id, item.karyawan?.nama_karyawan)}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider transition border border-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 dark:border-red-900/30"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                        </svg>
                                                                        Hapus
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: QR Code */}
                        <div>
                            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden sticky top-6 dark:bg-zinc-900 dark:border-zinc-800">
                                <div className="bg-zinc-900 px-6 py-4 text-center dark:bg-zinc-950">
                                    <h3 className="font-extrabold text-white text-sm tracking-wide uppercase">QR Code Kehadiran</h3>
                                    <p className="text-xs text-zinc-400 mt-1 font-medium">Scan untuk absen via HP</p>
                                </div>
                                <div className="p-6 text-center space-y-5">
                                    <div className="mx-auto flex justify-center bg-white p-3 rounded-2xl border-2 border-zinc-200 w-fit shadow-inner dark:border-zinc-850 dark:bg-white">
                                        <img
                                            src={qrCodeUrl}
                                            alt="QR Code Absensi Rapat"
                                            className="h-56 w-56 object-contain"
                                        />
                                    </div>

                                    <div className="bg-zinc-50 rounded-xl border border-zinc-200 px-4 py-3 dark:bg-zinc-950 dark:border-zinc-800">
                                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest mb-1">Link Absen Publik</p>
                                        <p className="text-xs font-mono text-zinc-700 dark:text-zinc-350 truncate">{publicAbsenUrl}</p>
                                    </div>

                                    <div className="space-y-2.5">
                                        <button
                                            onClick={copyToClipboard}
                                            className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-750"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Salin Tautan
                                        </button>

                                        <a
                                            href={publicAbsenUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900"
                                        >
                                            Buka Link Absen
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-100 px-6 py-3 text-center dark:border-zinc-800">
                                    <p className="text-[9px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-[0.25em]">
                                        FID Absensi v2.0 &bull; Laravel + React
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
