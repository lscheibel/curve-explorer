import React, { useState } from 'react';
import { Point } from '../../utils/geo/Point';
import { CornerCuttingCurve } from '../../utils/curves/CornerCuttingCurve';
import { Segment } from '../../utils/geo/Segment';
import ControlPoint from './ControlPoint';
import HtmlForeignObject from '../App/HtmlForeignObject/HtmlForeignObject';
import range from 'lodash/range';
import ControlSegment from './ControlSegment';
import DeleteZone from '../DeleteZone/DeleteZone';
import { call } from '../../utils/call';
import { BSplineCurve } from '../../utils/curves/BSplineCurve';
import Controls from './Controls';
import { notAllowedShake } from '../../utils/animations/notAllowedShake';

export interface ChaikinCurveOptions {
    showBSpline: boolean;
    showDots: boolean;
    closedShape: boolean;
    factor: number;
    iterations: number;
    dynamicResolution: boolean;
    maxAngle: number;
    maxIterations: number;
    showNextStep: boolean;
}

export interface ChaikinCurveProps {
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
    svgDimensions: { width: number; height: number };
    controlPoints: Point[];
    onChange: (controlPoints: Point[]) => void;
    selected: number | null;
    onSelect: (selectedIndex: number | null) => void;
}

export const initialValues: ChaikinCurveOptions = {
    showBSpline: true,
    showDots: false,
    closedShape: false,
    factor: 0.25,
    iterations: 2,
    dynamicResolution: false,
    maxAngle: 3,
    maxIterations: 10,
    showNextStep: false,
};

const ChaikinCurve = ({ svgRef, svgDimensions, controlPoints, onChange, selected, onSelect }: ChaikinCurveProps) => {
    const [options, _setOptions] = useState<ChaikinCurveOptions>(initialValues);

    const chaikinCurve = new CornerCuttingCurve(controlPoints, options.factor);
    const previewIterations = options.dynamicResolution ? [] : range(0, options.iterations);
    const bbox = chaikinCurve.controlPoints.boundingBox;

    const interpolate = (i = options.iterations) => {
        if (options.dynamicResolution) {
            return chaikinCurve.interpolateDynamic(options.maxAngle, options.maxIterations, options.closedShape);
        } else {
            return options.closedShape ? chaikinCurve.interpolateClosed(i) : chaikinCurve.interpolateOpen(i);
        }
    };

    const interpolatedPoints = interpolate();
    const toSegments = options.closedShape ? Segment.fromPointsClosed : Segment.fromPoints;

    const bspline = new BSplineCurve([controlPoints[0], ...controlPoints, controlPoints.at(-1)!], 2);

    return (
        <>
            {selected != null && (
                <DeleteZone
                    svgDimensions={svgDimensions}
                    onDelete={() => {
                        const nextPoints = controlPoints.filter((_, i) => i !== selected);
                        if (nextPoints.length >= 2) {
                            onChange?.(nextPoints);
                        } else {
                            if (svgRef.current) notAllowedShake(svgRef.current);
                        }
                    }}
                />
            )}

            {call(() => {
                if (!options.showBSpline) return null;

                const d = bspline.interpolate(100).map((point, index) => {
                    if (index === 0) return `M ${point.x} ${point.y}`;
                    return `L ${point.x} ${point.y}`;
                });

                return (
                    <path
                        d={d.join(' ')}
                        fill={'none'}
                        strokeWidth={'var(--stroke-width)'}
                        stroke={'var(--light-grey)'}
                        strokeLinecap={'round'}
                        strokeOpacity={1}
                        strokeDasharray={'var(--stroke-dash)'}
                    />
                );
            })}

            {/*{Segment.fromBoundingBox(chaikinCurve.controlPoints.boundingBox).map((seg, index) => {*/}
            {/*    return (*/}
            {/*        <line*/}
            {/*            key={`bbox:${index}`}*/}
            {/*            x1={seg.from.x}*/}
            {/*            y1={seg.from.y}*/}
            {/*            x2={seg.to.x}*/}
            {/*            y2={seg.to.y}*/}
            {/*            strokeWidth={'0.2'}*/}
            {/*            stroke={'#ff0'}*/}
            {/*            strokeLinecap={'round'}*/}
            {/*            strokeOpacity={1}*/}
            {/*        />*/}
            {/*    );*/}
            {/*})}*/}

            {toSegments(controlPoints).map((seg, index) => {
                return (
                    <line
                        key={`seg-viz:${index}`}
                        x1={seg.from.x}
                        y1={seg.from.y}
                        x2={seg.to.x}
                        y2={seg.to.y}
                        strokeWidth={'var(--stroke-width)'}
                        stroke={'var(--light-grey)'}
                        strokeLinecap={'round'}
                        strokeOpacity={1}
                        strokeDasharray={'var(--stroke-dash)'}
                    />
                );
            })}

            {call(() => {
                if (!options.showNextStep) return null;

                const currentSegments = toSegments(interpolatedPoints);

                return currentSegments.map((seg, index) => {
                    const pointA = Point.lerp(options.factor, seg.a, seg.b);
                    const pointB = Point.lerp(1 - options.factor, seg.a, seg.b);

                    const normal = seg.vector.normal.normalized.multiply(4);

                    const pointAStart = normal.multiply(-1).add(pointA);
                    const pointAEnd = normal.add(pointA);
                    const pointBStart = normal.multiply(-1).add(pointB);
                    const pointBEnd = normal.add(pointB);

                    return (
                        <g key={index} style={{ pointerEvents: 'none' }}>
                            <line
                                x1={pointAStart.x}
                                y1={pointAStart.y}
                                x2={pointAEnd.x}
                                y2={pointAEnd.y}
                                stroke={'var(--grey)'}
                                strokeWidth={'var(--stroke-width)'}
                                strokeLinecap={'round'}
                            />
                            <line
                                x1={pointBStart.x}
                                y1={pointBStart.y}
                                x2={pointBEnd.x}
                                y2={pointBEnd.y}
                                stroke={'var(--grey)'}
                                strokeWidth={'var(--stroke-width)'}
                                strokeLinecap={'round'}
                            />
                        </g>
                    );
                });
            })}

            {previewIterations.map((previewIteration) =>
                toSegments(interpolate(previewIteration)).map((seg, index, all) => {
                    const pointA = Point.lerp(options.factor, seg.a, seg.b);
                    const pointB = Point.lerp(1 - options.factor, seg.a, seg.b);

                    const normal = seg.vector.normal.normalized.multiply(4);

                    const pointAStart = normal.multiply(-1).add(pointA);
                    const pointAEnd = normal.add(pointA);
                    const pointBStart = normal.multiply(-1).add(pointB);
                    const pointBEnd = normal.add(pointB);

                    return (
                        <g key={`${previewIteration}:${index}`} style={{ pointerEvents: 'none' }}>
                            {previewIteration > 0 && (
                                <line
                                    key={`prev-seg:${index}`}
                                    x1={seg.from.x}
                                    y1={seg.from.y}
                                    x2={seg.to.x}
                                    y2={seg.to.y}
                                    strokeWidth={'var(--stroke-width)'}
                                    stroke={'var(--grey)'}
                                    strokeLinecap={'round'}
                                />
                            )}
                            <line
                                x1={pointAStart.x}
                                y1={pointAStart.y}
                                x2={pointAEnd.x}
                                y2={pointAEnd.y}
                                stroke={'var(--grey)'}
                                strokeWidth={'var(--stroke-width)'}
                                strokeLinecap={'round'}
                            />
                            <line
                                x1={pointBStart.x}
                                y1={pointBStart.y}
                                x2={pointBEnd.x}
                                y2={pointBEnd.y}
                                stroke={'var(--grey)'}
                                strokeWidth={'var(--stroke-width)'}
                                strokeLinecap={'round'}
                            />
                        </g>
                    );
                })
            )}

            {options.showDots &&
                interpolatedPoints.map((point, index) => {
                    return (
                        <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={3}
                            fill={'var(--black)'}
                            style={{ pointerEvents: 'none' }}
                        />
                    );
                })}

            {toSegments(interpolatedPoints).map((seg, index) => {
                return (
                    <line
                        key={`final:${index}`}
                        x1={seg.from.x}
                        y1={seg.from.y}
                        x2={seg.to.x}
                        y2={seg.to.y}
                        strokeWidth={'var(--stroke-width)'}
                        stroke={'var(--black)'}
                        strokeLinecap={'round'}
                        style={{ pointerEvents: 'none' }}
                    />
                );
            })}

            {toSegments(controlPoints).map((seg, index) => {
                return (
                    <ControlSegment
                        seg={seg}
                        key={`control:${index}`}
                        onInsertPoint={(point) => {
                            const nextPoints = [...controlPoints];
                            nextPoints.splice(index + 1, 0, point);
                            if (onChange) {
                                onChange(nextPoints);
                                onSelect(index + 1);
                            }
                        }}
                    />
                );
            })}

            {controlPoints.map((p, i) => {
                return (
                    <ControlPoint
                        key={i}
                        position={p}
                        selected={selected === i}
                        onSelect={() => onSelect(i)}
                        onPositionChange={(delta) => {
                            const nextPoints = chaikinCurve.controlPoints.movePoint(i, delta);
                            onChange?.(nextPoints.toArray());
                        }}
                    />
                );
            })}

            <HtmlForeignObject
                position={new Point(bbox.center.x, bbox.top)}
                anchorX={'center'}
                anchorY={'bottom'}
                style={{ width: 'max-content', color: 'var(--black)', pointerEvents: 'none' }}
            >
                <Controls options={options} onChange={_setOptions} />
            </HtmlForeignObject>
        </>
    );
};

export default ChaikinCurve;
