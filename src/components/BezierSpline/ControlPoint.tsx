import React from 'react';
import { Point } from '../../utils/geo/Point';
import { useDrag } from '@use-gesture/react';

export interface ControlPointProps {
    position: Point;
    onPositionChange?: (newPosition: Point) => void;
}

const ControlPoint = ({ position, onPositionChange }: ControlPointProps) => {
    const bind = useDrag(
        ({ delta }) => {
            onPositionChange?.(new Point(delta[0], delta[1]));
        },
        {
            filterTaps: true,
        }
    );

    return <circle {...bind()} cx={position.x} cy={position.y} r={5} fill={'#fff'} style={{ touchAction: 'none' }} />;
};

export default ControlPoint;
