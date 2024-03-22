import {useEffect} from 'react';
import {useStableCallback} from './useStableCallback';

export const useWindowEvent = <K extends keyof WindowEventMap | string>(
    type: K,
    listener: K extends keyof WindowEventMap
        ? (event: WindowEventMap[K]) => void
        : (event: CustomEvent) => void,
    options?: boolean | AddEventListenerOptions
) => {
    const _eventCallback = useStableCallback(listener as any);

    useEffect(() => {
        window.addEventListener(type, _eventCallback, options);
        return () => window.removeEventListener(type, _eventCallback, options);
    }, [_eventCallback, options, type]);
};
