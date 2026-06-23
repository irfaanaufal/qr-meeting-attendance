export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-zinc-300 bg-white text-zinc-900 shadow-sm focus:ring-1 focus:ring-zinc-900 focus:ring-offset-0 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-offset-zinc-900 ' +
                className
            }
        />
    );
}
