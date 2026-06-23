export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'text-xs font-semibold text-red-600 mt-1 ' + className}>
            {message}
        </p>
    ) : null;
}
