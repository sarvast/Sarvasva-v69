import { useEffect } from 'react';

export function useNativeApp() {
    useEffect(() => {
        // Hide address bar on mobile
        const hideAddressBar = () => {
            if (window.innerHeight < window.outerHeight) {
                window.scrollTo(0, 1);
            }
        };

        // Prevent pull-to-refresh
        document.body.style.overscrollBehavior = 'none';
        
        // Hide address bar after load
        window.addEventListener('load', hideAddressBar);
        window.addEventListener('orientationchange', hideAddressBar);
        


        return () => {
            window.removeEventListener('load', hideAddressBar);
            window.removeEventListener('orientationchange', hideAddressBar);
        };
    }, []);
}