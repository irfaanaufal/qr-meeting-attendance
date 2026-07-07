import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar_url || null);
    const [uploading, setUploading] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2048 * 1024) {
            alert('Ukuran file maksimal 2MB');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format file harus jpeg, png, jpg, atau webp');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => setAvatarPreview(event.target.result);
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        axios.post('/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((res) => {
            setAvatarPreview(res.data.avatar_url);
            router.reload({ only: ['auth'] });
        }).catch((err) => {
            alert(err.response?.data?.message || 'Gagal mengupload avatar');
            setAvatarPreview(user.avatar_url || null);
        }).finally(() => setUploading(false));
    };

    return (
        <section className={className}>
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 flex-shrink-0 dark:bg-zinc-800 dark:text-zinc-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h2 className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">Informasi Profil</h2>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Perbarui foto, nama, username, dan email akun Anda.</p>
                </div>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-4 mb-6">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="relative group"
                >
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-zinc-100 dark:ring-zinc-800 shadow-md transition-all group-hover:brightness-90" />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-2xl font-black ring-4 ring-zinc-100 dark:ring-zinc-800 shadow-md transition-all group-hover:brightness-90">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        {uploading ? (
                            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </div>
                </button>
                <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Foto Profil</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Klik untuk mengubah foto. Maks 2MB.</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        className="mt-1.5 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="username" value="Username" />
                    <TextInput
                        id="username"
                        className="mt-1.5 block w-full"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError message={errors.username} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1.5 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-300">
                        Email Anda belum diverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-bold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-200 transition"
                        >
                            Kirim ulang email verifikasi.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-green-700 dark:text-green-400">
                                Link verifikasi baru telah dikirim ke email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
