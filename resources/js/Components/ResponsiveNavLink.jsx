import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 '
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white ') +
                className
            }
        >
            {children}
        </Link>
    );
}
