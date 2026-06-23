export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label
            {...props}
            className={`block text-[11px] font-extrabold text-zinc-500 uppercase tracking-[0.15em] ` + className}
        >
            {value ? value : children}
        </label>
    );
}
