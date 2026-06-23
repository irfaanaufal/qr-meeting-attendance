import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-zinc-900" />

            {/* Navbar */}
            <Navbar user={user} />

            <main className="w-full">{children}</main>
        </div>
    );
}
