import { useCallback, useEffect, useState } from 'react';

/*
Routing, all of it. The app has one page and a dozen views,
so the URL hash is enough — no router dependency, no server
rewrites, and every view is still linkable and bookmarkable.
*/

const readHash = () => window.location.hash.replace(/^#\/?/, '') || null;

export function useHashRoute(fallback) {
    const [route, setRoute] = useState(() => readHash() ?? fallback);

    useEffect(() => {
        const sync = () => setRoute(readHash() ?? fallback);
        window.addEventListener('hashchange', sync);
        return () => window.removeEventListener('hashchange', sync);
    }, [fallback]);

    const navigate = useCallback((next) => {
        window.location.hash = `#/${next}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return [route, navigate];
}
