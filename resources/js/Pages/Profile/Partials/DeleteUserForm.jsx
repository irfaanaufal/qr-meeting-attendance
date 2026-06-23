import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-5 ${className}`}>
            <div className="flex items-center gap-3 pb-5 border-b border-red-100 dark:border-red-950/30">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <div>
                    <h2 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">Hapus Akun</h2>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                Setelah akun dihapus, semua data dan resource akan dihapus secara permanen. Pastikan Anda sudah menyimpan data penting sebelum melanjutkan.
            </p>

            <button
                onClick={confirmUserDeletion}
                className="inline-flex items-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:border-red-900 dark:text-red-450"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus Akun
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 space-y-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-extrabold text-zinc-900 dark:text-white text-base tracking-tight">
                                Hapus akun Anda?
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                                Semua data akan dihapus secara permanen. Masukkan password untuk konfirmasi.
                            </p>
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full"
                            isFocused
                            placeholder="Masukkan password Anda"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="inline-flex items-center rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition disabled:opacity-50"
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
