import React from 'react';

export default function ApplicationLogo(props) {
    const getLogoUrl = () => {
        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname;
            let basePath = '';
            const markers = ['/public.index.php', '/public/index.php', '/public'];
            for (const marker of markers) {
                const idx = pathname.indexOf(marker);
                if (idx !== -1) {
                    basePath = pathname.substring(0, idx + marker.length).replace(/\/?index\.php$/, '');
                    break;
                }
            }
            if (basePath) {
                return `${window.location.origin}${basePath}/images/logo.png`;
            }
        }
        return '/images/logo.png';
    };

    return (
        <img
            src={getLogoUrl()}
            alt="Logo"
            {...props}
        />
    );
}
