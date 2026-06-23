export default function SecondaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-zinc-300 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-700 shadow-sm transition duration-150 ease-in-out hover:bg-zinc-50 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:border-zinc-600 dark:focus:ring-white dark:focus:ring-offset-zinc-900 ${
                    disabled && 'opacity-40 pointer-events-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
