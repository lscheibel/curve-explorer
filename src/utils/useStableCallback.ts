import { useCallback, useLayoutEffect, useRef } from 'react';

/** @description User-land implementation of Reacts upcoming useEvent hook. Read here for all caveats: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md */
export const useStableCallback = <CB extends (...args: Parameters<CB>) => ReturnType<CB>>(handler: CB) => {
    const handlerRef = useRef<null | CB>(null);

    // In a real implementation, this would run before layout effects
    useLayoutEffect(() => {
        handlerRef.current = handler;
    });

    return useCallback((...args: Parameters<CB>) => {
        // In a real implementation, this would throw if called during render
        const fn = handlerRef.current;
        if (!fn) throw new Error('Callbacks from useStableCallback must not be called during render.');
        return fn(...args);
    }, []);
};
