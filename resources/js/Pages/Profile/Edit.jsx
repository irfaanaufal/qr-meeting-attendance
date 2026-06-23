import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-3xl space-y-5">

                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 sm:p-8 dark:bg-zinc-900 dark:border-zinc-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 sm:p-8 dark:bg-zinc-900 dark:border-zinc-800">
                        <UpdatePasswordForm />
                    </div>

                    <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-6 sm:p-8 dark:bg-zinc-900 dark:border-red-950/20">
                        <DeleteUserForm />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
