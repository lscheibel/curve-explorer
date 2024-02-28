import { useEffect, useState } from 'react';
import { Point } from '../../utils/geo/Point';
import { useStableCallback } from '../../utils/useStableCallback';

export const useCursorPosition = (svgRef: React.MutableRefObject<SVGSVGElement | null>) => {
    const [cursorWorldSpacePosition, setCursorWorldSpacePosition] = useState(new Point(0, 0));

    const handler = useStableCallback((e: PointerEvent) => {
        const svg = svgRef.current;
        if (!svg) return;

        const screenSpacePos = new Point(e.clientX, e.clientY);
        const rect = svg.getBoundingClientRect();

        const offset = new Point(rect.left + rect.width / 2, rect.top + rect.height / 2);
        setCursorWorldSpacePosition(screenSpacePos.add(offset.multiply(-1)));
    });

    useEffect(() => {
        window.addEventListener('pointermove', handler);
        return () => window.removeEventListener('pointermove', handler);
    }, [handler]);

    return cursorWorldSpacePosition;
};
