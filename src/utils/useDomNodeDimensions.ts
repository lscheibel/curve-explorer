import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { useResizeObserver } from './useResizeObserver';

export const useDomNodeDimensions = <E extends HTMLElement | SVGElement>(ref: React.MutableRefObject<E | null>) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

    useResizeObserver<E>(ref, (entry) => {
        const { width, height } = entry.contentRect;
        flushSync(() => setDimensions({ width, height }));
    });

    return dimensions;
};
