export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition duration-150 ease-in-out hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 active:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:bg-zinc-200 dark:focus:ring-white dark:active:bg-zinc-300 dark:focus:ring-offset-zinc-900 ${
                    disabled && 'opacity-40 pointer-events-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
