import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center gap-2 px-2 py-2 text-sm font-bold transition-all duration-200 focus:outline-none ' +
                (active
                    ? 'text-zinc-900 dark:text-white '
                    : 'text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
