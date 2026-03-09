'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        Tawk_API?: any;
        Tawk_LoadStart?: Date;
    }
}

export default function TawkToWidget() {
    useEffect(() => {
        // Configure Tawk.to before script loads
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        // Hide the "We are here" attention grabber text
        window.Tawk_API.onLoad = function () {
            window.Tawk_API.hideWidget();
            setTimeout(() => {
                window.Tawk_API.showWidget();
            }, 100);
        };

        // Override the attention bubble via CSS
        const style = document.createElement('style');
        style.textContent = `
            .tawk-min-container .tawk-bubble { display: none !important; }
            [class*="tawk-text-attention"] { display: none !important; }
            .tawk-min-chat-icon .tawk-text-truncate { display: none !important; }
        `;
        document.head.appendChild(style);

        // Tawk.to Live Chat Script
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://embed.tawk.to/69ab3b300ea4001c38e67766/1jj2dudn5';
        s.charset = 'UTF-8';
        s.setAttribute('crossorigin', '*');
        document.body.appendChild(s);

        return () => {
            document.body.removeChild(s);
            document.head.removeChild(style);
            const tawkElements = document.querySelectorAll('[id^="tawk-"]');
            tawkElements.forEach(el => el.remove());
        };
    }, []);

    return null;
}
