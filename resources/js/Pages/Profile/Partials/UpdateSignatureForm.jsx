import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import SignaturePad from '@/Components/SignaturePad';

export default function UpdateSignatureForm() {
    const { auth } = usePage().props;
    const user = auth.user;
    const karyawanFid = user.fid;

    const [signatureUrl, setSignatureUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!karyawanFid) {
            setIsLoading(false);
            return;
        }
        axios.get(route('signatures.show', karyawanFid))
            .then(res => setSignatureUrl(res.data.signature_url))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [karyawanFid]);

    const handleSaved = () => {
        window.location.reload();
    };

    const handleDeleted = () => {
        window.location.reload();
    };

    if (!karyawanFid) {
        return (
            <section>
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 flex-shrink-0 dark:bg-zinc-800 dark:text-zinc-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">Tanda Tangan Digital</h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Akun Anda belum memiliki FID yang terhubung ke data karyawan.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 flex-shrink-0 dark:bg-zinc-800 dark:text-zinc-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>
                <div>
                    <h2 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">Tanda Tangan Digital</h2>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Tanda tangan akan otomatis tercantum di cetak absensi rapat & briefing.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            ) : (
                <SignaturePad
                    karyawanFid={karyawanFid}
                    existingUrl={signatureUrl}
                    onSaved={handleSaved}
                    onDeleted={handleDeleted}
                />
            )}
        </section>
    );
}
