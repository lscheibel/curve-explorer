import { Curve } from './Curve';
import { Point } from '../geo/Point';
import { Segment } from '../geo/Segment';

export class BezierCurve {
    controlPoints: Point[];

    constructor(controlPoints: Point[]) {
        this.controlPoints = controlPoints;
    }

    get start() {
        return this.controlPoints[0];
    }

    get startHandle() {
        return this.controlPoints[1];
    }

    get end() {
        return this.controlPoints[this.controlPoints.length - 1];
    }

    get endHandle() {
        return this.controlPoints[this.controlPoints.length - 2];
    }

    interpolate(resolution: number) {
        const points: Point[] = [];

        const lerped = (t: number, points: Point[]) => {
            const result: Point[] = [];

            points.forEach((point, index, all) => {
                if (index === all.length - 1) return;
                result.push(Point.lerp(t, point, all[index + 1]));
            });

            return result;
        };

        const lerpRecursive = (t: number, points: Point[]): Point => {
            if (points.length === 1) return points[0];
            return lerpRecursive(t, lerped(t, points));
        };

        for (let i = 0; i < resolution; i++) {
            const t = i / (resolution - 1);
            points.push(lerpRecursive(t, this.controlPoints));
        }

        return points;
    }

    toSegments(resolution: number) {
        return Segment.fromPoints(this.interpolate(resolution));
    }

    setControlPoint(index: number, point: Point) {
        return new BezierCurve(this.controlPoints.map((p, i) => (i === index ? point : p)));
    }
}
