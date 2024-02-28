import { useLayoutEffect } from 'react';
import { useStableCallback } from './useStableCallback';

export const useResizeObserver = <HTMLElementType extends HTMLElement | SVGElement>(
    ref: React.MutableRefObject<HTMLElementType | null>,
    onResize: (entry: ResizeObserverEntry) => void
) => {
    const _onResize = useStableCallback((entry: ResizeObserverEntry) => onResize(entry));

    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) return;

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(_onResize);
        });

        resizeObserver.observe(node);

        return () => resizeObserver?.disconnect();
    }, []);
};
