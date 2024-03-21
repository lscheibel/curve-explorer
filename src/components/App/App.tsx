import React, { useRef, useState } from 'react';
import styles from './App.module.scss';
import { useDomNodeDimensions } from '../../utils/useDomNodeDimensions';
import { Point } from '../../utils/geo/Point';
import ChaikinCurve from '../ChaikinCurve/ChaikinCurve';
import Credits from '../Credits/Credits';

const App = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const dimensions = useDomNodeDimensions(ref);

    const [chaikinCurvePoints, setChaikinCurvePoints] = useState(() => {
        const h = window.innerWidth / 2 - window.innerWidth * 0.1;
        const v = window.innerHeight / 2 - window.innerHeight * 0.1;

        return [
            new Point(-h, -v),
            new Point(-h, v),
            new Point(0, v),
            new Point(0, -v),
            new Point(h, -v),
            new Point(h, v),
        ];
    });
    const [selectedCurvePoint, setSelectedCurvePoint] = useState<number | null>(null);

    return (
        <div className={styles.wrapper} ref={ref}>
            {dimensions && (
                <svg
                    ref={svgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    viewBox={`${-dimensions.width / 2} ${-dimensions.height / 2} ${dimensions.width} ${
                        dimensions.height
                    }`}
                >
                    <ChaikinCurve
                        svgRef={svgRef}
                        svgDimensions={dimensions}
                        controlPoints={chaikinCurvePoints}
                        onChange={setChaikinCurvePoints}
                        selected={selectedCurvePoint}
                        onSelect={(index) => setSelectedCurvePoint(index)}
                    />
                </svg>
            )}

            <Credits />
        </div>
    );
};

export default App;
