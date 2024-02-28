import React, { useRef, useState } from 'react';
import styles from './App.module.scss';
import { useDomNodeDimensions } from '../../utils/useDomNodeDimensions';
import { BezierCurve } from '../../utils/curves/BezierCurve';
import { Point } from '../../utils/geo/Point';
import ChaikinCurve from '../ChaikinCurve/ChaikinCurve';

const App = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const dimensions = useDomNodeDimensions(ref);
    const [cornerCuttingFactor, setCornerCuttingFactor] = useState(0.25);

    const [bezierCurve, setBezierCurve] = useState(
        new BezierCurve([new Point(0, 0), new Point(0, 100), new Point(100, 100), new Point(100, 0)])
    );

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

    // const cornerCuttingCurve = new CornerCuttingCurve(bezierCurve.controlPoints, cornerCuttingFactor);
    // const subdivisionCurve = new SubdivisionCurve(bezierCurve.controlPoints);
    // const bSpline = new BSplineCurve(chaikinCurvePoints, 2);

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
                    {/*<BezierSpline*/}
                    {/*    controlPoints={bezierCurve.controlPoints}*/}
                    {/*    onChange={(controlPoints) => setBezierCurve(new BezierCurve(controlPoints))}*/}
                    {/*/>*/}

                    <ChaikinCurve
                        svgRef={svgRef}
                        svgDimensions={dimensions}
                        controlPoints={chaikinCurvePoints}
                        onChange={setChaikinCurvePoints}
                        selected={selectedCurvePoint}
                        onSelect={(index) => setSelectedCurvePoint(index)}
                    />

                    {/*{[chaikinCurve.toOpenSegments(0), chaikinCurve.toOpenSegments(1)].map((curveSegments, curveIndex) =>*/}
                    {/*    curveSegments.map((seg, index) => {*/}
                    {/*        return (*/}
                    {/*            <line*/}
                    {/*                key={`${curveIndex}:${index}`}*/}
                    {/*                x1={seg.from.x}*/}
                    {/*                y1={seg.from.y}*/}
                    {/*                x2={seg.to.x}*/}
                    {/*                y2={seg.to.y}*/}
                    {/*                strokeWidth={'2'}*/}
                    {/*                stroke={'#f0f'}*/}
                    {/*                strokeLinecap={'round'}*/}
                    {/*                strokeOpacity={curveIndex + 1 / curveSegments.length}*/}
                    {/*            />*/}
                    {/*        );*/}
                    {/*    })*/}
                    {/*)}*/}

                    {/*{subdivisionCurve.toOpenSegments(2).map((seg, index) => {*/}
                    {/*    return (*/}
                    {/*        <line*/}
                    {/*            key={`subdiv:${index}`}*/}
                    {/*            x1={seg.from.x}*/}
                    {/*            y1={seg.from.y}*/}
                    {/*            x2={seg.to.x}*/}
                    {/*            y2={seg.to.y}*/}
                    {/*            strokeWidth={'2'}*/}
                    {/*            stroke={'#0ff'}*/}
                    {/*            strokeOpacity={0.8}*/}
                    {/*            strokeLinecap={'round'}*/}
                    {/*        />*/}
                    {/*    );*/}
                    {/*})}*/}

                    {/*{bSpline.toSegments(50).map((seg, index) => {*/}
                    {/*    return (*/}
                    {/*        <line*/}
                    {/*            key={`bSpline:${index}`}*/}
                    {/*            x1={seg.from.x}*/}
                    {/*            y1={seg.from.y}*/}
                    {/*            x2={seg.to.x}*/}
                    {/*            y2={seg.to.y}*/}
                    {/*            strokeWidth={'4'}*/}
                    {/*            stroke={'#d01a99'}*/}
                    {/*            strokeOpacity={1}*/}
                    {/*            strokeLinecap={'round'}*/}
                    {/*        />*/}
                    {/*    );*/}
                    {/*})}*/}
                </svg>
            )}
        </div>
    );
};

export default App;
