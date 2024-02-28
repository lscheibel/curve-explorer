import React from 'react';
import { Point } from '../../utils/geo/Point';
import { useDrag } from '@use-gesture/react';

export interface ControlPointProps {
    position: Point;
    onPositionChange?: (newPosition: Point) => void;
    selected?: boolean;
    onSelect?: () => void;
}

const ControlPoint = ({ position, onPositionChange, selected, onSelect }: ControlPointProps) => {
    const bind = useDrag(
        ({ delta }) => {
            onPositionChange?.(new Point(delta[0], delta[1]));
        },
        {
            filterTaps: true,
        }
    );

    return (
        <>
            <circle
                {...bind()}
                cx={position.x}
                cy={position.y}
                r={10}
                fill={'transparent'}
                onClick={onSelect}
                style={{ touchAction: 'none' }}
            />
            <circle
                cx={position.x}
                cy={position.y}
                r={4}
                fill={'var(--white)'}
                stroke={selected ? 'var(--blue)' : 'var(--black)'}
                strokeWidth={'var(--stroke-width)'}
                style={{ pointerEvents: 'none' }}
            />
        </>
    );
};

export default ControlPoint;
