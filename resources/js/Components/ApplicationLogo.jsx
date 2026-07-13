import React from 'react';

export default function ApplicationLogo(props) {
    const getLogoUrl = () => {
        const basePath = import.meta.env.VITE_APP_BASE_PATH || '';
        return `${basePath}/images/logo.png`;
    };

    return (
        <img
            src={getLogoUrl()}
            alt="Logo"
            {...props}
        />
    );
}
