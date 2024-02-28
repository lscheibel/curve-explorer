import React, { useState } from 'react';
import { Segment } from '../../utils/geo/Segment';
import { Point } from '../../utils/geo/Point';

export interface ControlSegmentProps {
    seg: Segment;
    onInsertPoint?: (point: Point) => void;
}

const ControlSegment = ({ seg, onInsertPoint }: ControlSegmentProps) => {
    const [previewPos, setPreviewPos] = useState<Point | null>(null);

    const plusRadius = 3;

    return (
        <>
            <line
                x1={seg.a.x}
                y1={seg.a.y}
                x2={seg.b.x}
                y2={seg.b.y}
                stroke={'transparent'}
                strokeWidth={12}
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
                        x1={previewPos.x - plusRadius}
                        x2={previewPos.x + plusRadius}
                        y1={previewPos.y}
                        y2={previewPos.y}
                        stroke={'var(--white)'}
                        strokeWidth={2}
                    />
                    <line
                        x1={previewPos.x}
                        x2={previewPos.x}
                        y1={previewPos.y - plusRadius}
                        y2={previewPos.y + plusRadius}
                        stroke={'var(--white)'}
                        strokeWidth={2}
                    />
                </g>
            )}
        </>
    );
};

export default ControlSegment;
