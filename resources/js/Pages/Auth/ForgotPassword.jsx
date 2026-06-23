import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="mb-6">
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">Lupa Password?</h2>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                    Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-xl bg-zinc-50 border border-zinc-200 p-3.5 text-sm font-medium text-zinc-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="you@example.com"
                    />
                    <InputError message={errors.email} />
                </div>

                <PrimaryButton className="w-full py-3 text-sm justify-center" disabled={processing}>
                    {processing ? 'Mengirim...' : 'Kirim Link Reset Password'}
                </PrimaryButton>

                <p className="text-center text-sm text-zinc-500">
                    <Link href={route('login')} className="font-bold text-zinc-900 hover:underline underline-offset-2 transition">
                        &larr; Kembali ke Login
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
