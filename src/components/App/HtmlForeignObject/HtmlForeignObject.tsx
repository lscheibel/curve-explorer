import React, { useRef } from 'react';
import { Point } from '../../../utils/geo/Point';
import { useDomNodeDimensions } from '../../../utils/useDomNodeDimensions';

export interface HtmlForeignObjectProps extends React.HTMLAttributes<HTMLDivElement> {
    position: Point;
    children: React.ReactNode;
    anchorX?: 'left' | 'center' | 'right';
    anchorY?: 'top' | 'center' | 'bottom';
}

const HtmlForeignObject = ({
    position,
    children,
    anchorX = 'left',
    anchorY = 'top',
    ...props
}: HtmlForeignObjectProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const dimensions = useDomNodeDimensions(ref);

    const posX =
        anchorX === 'right'
            ? position.x - (dimensions?.width || 0)
            : anchorX === 'center'
            ? position.x - (dimensions?.width || 0) / 2
            : position.x;
    const posY =
        anchorY === 'bottom'
            ? position.y - (dimensions?.height || 0)
            : anchorY === 'center'
            ? position.y - (dimensions?.height || 0) / 2
            : position.y;

    return (
        <foreignObject x={posX} y={posY} {...dimensions}>
            <div ref={ref} {...props}>
                {children}
            </div>
        </foreignObject>
    );
};

export default HtmlForeignObject;
