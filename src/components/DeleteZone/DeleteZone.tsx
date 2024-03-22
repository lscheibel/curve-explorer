import React from 'react';

export interface DeleteZoneProps {
    onDelete?: () => void;
    svgDimensions: { width: number; height: number };
}

const DeleteZone = ({ svgDimensions: { width: svgWidth, height: svgHeight }, onDelete }: DeleteZoneProps) => {
    const height = 50;
    const width = 200;
    const marginY = 16;

    const x = -width / 2;
    const y = svgHeight / 2 - height - marginY;

    const centerX = 0;
    const centerY = svgHeight / 2 - height / 2 - marginY;

    return (
        <g onClick={onDelete} style={{ cursor: 'pointer' }}>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={'var(--faint-red)'}
                onPointerUp={() => onDelete?.()}
                rx={8}
                // stroke={'var(--red)'}
                strokeWidth={2}
            />
            <text x={centerX} y={centerY} textAnchor={'middle'} fill={'var(--red)'} dominantBaseline={'middle'}>
                Remove selected node
            </text>
        </g>
    );
};

export default DeleteZone;
