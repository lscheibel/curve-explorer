import React from 'react';
import { Segment } from '../../utils/geo/Segment';
import { Point } from '../../utils/geo/Point';
import { BezierCurve } from '../../utils/curves/BezierCurve';
import ControlPoint from './ControlPoint';
import { call } from '../../utils/call';

export interface BezierSplineProps {
    controlPoints: Point[];
    onChange: (controlPoints: Point[]) => void;
}

const BezierSpline = ({ controlPoints, onChange }: BezierSplineProps) => {
    const bezierCurve = new BezierCurve(controlPoints);

    const startHandle = new Segment(bezierCurve.start, bezierCurve.startHandle);

    const handles = [
        new Segment(bezierCurve.start, bezierCurve.startHandle),
        new Segment(bezierCurve.end, bezierCurve.endHandle),
    ];

    // Todo: Expose handles. Move 'startHandle' when 'start' moves.

    return (
        <g>
            {bezierCurve.toSegments(50).map((seg, index) => {
                return (
                    <line
                        key={index}
                        x1={seg.from.x}
                        y1={seg.from.y}
                        x2={seg.to.x}
                        y2={seg.to.y}
                        strokeWidth={'2'}
                        stroke={'#ff0'}
                        strokeLinecap={'round'}
                    />
                );
            })}

            {/* Start Handle */}
            <line
                x1={bezierCurve.start.x}
                y1={bezierCurve.start.y}
                x2={bezierCurve.startHandle.x}
                y2={bezierCurve.startHandle.y}
                strokeWidth={'2'}
                stroke={'#aaa'}
            />
            <ControlPoint
                position={bezierCurve.startHandle}
                onPositionChange={(delta) => {
                    const newCurve = bezierCurve.setControlPoint(1, bezierCurve.startHandle.move(delta));
                    onChange(newCurve.controlPoints);
                }}
            />
            <ControlPoint
                position={bezierCurve.start}
                onPositionChange={(delta) => {
                    const newCurve = bezierCurve
                        .setControlPoint(0, bezierCurve.start.move(delta))
                        .setControlPoint(1, bezierCurve.startHandle.move(delta));

                    onChange(newCurve.controlPoints);
                }}
            />

            {/* End Handle */}
            <line
                x1={bezierCurve.end.x}
                y1={bezierCurve.end.y}
                x2={bezierCurve.endHandle.x}
                y2={bezierCurve.endHandle.y}
                strokeWidth={'2'}
                stroke={'#aaa'}
            />
            <ControlPoint
                position={bezierCurve.endHandle}
                onPositionChange={(delta) => {
                    const newCurve = bezierCurve.setControlPoint(
                        bezierCurve.controlPoints.length - 2,
                        bezierCurve.endHandle.move(delta)
                    );
                    onChange(newCurve.controlPoints);
                }}
            />
            <ControlPoint
                position={bezierCurve.end}
                onPositionChange={(delta) => {
                    const newCurve = bezierCurve
                        .setControlPoint(bezierCurve.controlPoints.length - 1, bezierCurve.end.move(delta))
                        .setControlPoint(bezierCurve.controlPoints.length - 2, bezierCurve.endHandle.move(delta));

                    onChange(newCurve.controlPoints);
                }}
            />
        </g>
    );
};

export default BezierSpline;
