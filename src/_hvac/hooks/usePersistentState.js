import { useEffect, useState } from 'react';

/*
useState that survives a reload. Someone planning ductwork
will close the laptop halfway through, and losing the
worksheet would make the app useless for real work.

Storage failures are ignored on purpose — private browsing
and full quotas should degrade to a normal, working app
rather than a blank screen.
*/
export function usePersistentState(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = window.localStorage.getItem(key);
            return stored ? { ...initialValue, ...JSON.parse(stored) } : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            /* nothing useful to do here */
        }
    }, [key, value]);

    const reset = () => setValue(initialValue);

    return [value, setValue, reset];
}
