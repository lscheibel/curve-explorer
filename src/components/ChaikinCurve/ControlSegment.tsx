import React, { useState } from 'react';
import { Segment } from '../../utils/geo/Segment';
import { Point } from '../../utils/geo/Point';

export interface ControlSegmentProps {
    seg: Segment;
    onInsertPoint?: (point: Point) => void;
}

const ControlSegment = ({ seg, onInsertPoint }: ControlSegmentProps) => {
    const [previewPos, setPreviewPos] = useState<Point | null>(null);

    return (
        <>
            <line
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
            <line
                x1={seg.a.x}
                y1={seg.a.y}
                x2={seg.b.x}
                y2={seg.b.y}
                stroke={'transparent'}
                strokeWidth={10}
                onPointerMove={(e) => {
                    const screenPos = new Point(e.clientX, e.clientY);
                    const svg = e.currentTarget.closest('svg')!;
                    const svgRect = svg.getBoundingClientRect();
                    const offset = new Point(svgRect.left + svgRect.width / 2, svgRect.top + svgRect.height / 2);
                    const worldPos = screenPos.sub(offset);

                    const nearestToSeg = seg.nearestPoint(worldPos);
                    if (!nearestToSeg) return;

                    setPreviewPos(nearestToSeg);
                }}
                onPointerLeave={() => setPreviewPos(null)}
                onClick={() => {
                    if (previewPos) onInsertPoint?.(previewPos);
                }}
            />
            {previewPos && (
                <g style={{ pointerEvents: 'none' }}>
                    <circle cx={previewPos.x} cy={previewPos.y} r={6} fill={'var(--blue)'} />
                    <line
                        x1={previewPos.x - 4}
                        x2={previewPos.x + 4}
                        y1={previewPos.y}
                        y2={previewPos.y}
                        stroke={'var(--white)'}
                        strokeWidth={2}
                    />
                    <line
                        x1={previewPos.x}
                        x2={previewPos.x}
                        y1={previewPos.y - 4}
                        y2={previewPos.y + 4}
                        stroke={'var(--white)'}
                        strokeWidth={2}
                    />
                </g>
            )}
        </>
    );
};

export default ControlSegment;
