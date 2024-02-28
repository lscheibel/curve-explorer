import { approxEq, degToRad, mapRange, wrap } from '../math';
import { Point } from '../geo/Point';
import { Segment } from '../geo/Segment';
import { BoundingBox } from '../geo/BoundingBox';
import { template } from 'lodash';
import ChaikinCurve from '../../components/ChaikinCurve/ChaikinCurve';

export class ControlPoints extends Array<Point> {
    movePoint(index: number, delta: Point) {
        return new ControlPoints(...this.map((p, i) => (i === index ? p.move(delta) : p)));
    }

    get boundingBox() {
        return BoundingBox.fromPoints(this);
    }

    toArray() {
        return [...this];
    }

    closestPoint(point: Point): Point | null {
        let closest: Point | null = null;

        const segments = Segment.fromPoints(this);
        segments.forEach((seg) => {
            const closestPoint = seg.nearestPoint(point, 'strict');
            if (!closestPoint) return;
            if (!closest) {
                closest = closestPoint;
                return;
            }

            if (closestPoint.sub(point).magnitude < closest.sub(point).magnitude) {
                closest = closestPoint;
            }
        });

        return closest;
    }
}

export class CornerCuttingCurve {
    controlPoints: ControlPoints;
    ratio: number;

    constructor(controlPoints: Point[], factor = 0.25) {
        this.controlPoints = new ControlPoints(...controlPoints);
        this.ratio = factor;
    }

    static cutCornersClosed(points: Point[], factor = 0.25) {
        const result: Point[] = [];

        points.forEach((point, index, all) => {
            const nextPoint = all[wrap(index + 1, all.length)];
            result.push(Point.lerp(factor, point, nextPoint));
            result.push(Point.lerp(1 - factor, point, nextPoint));
        });

        return result;
    }

    static cutSingleCornerClosed(points: Point[], ratio: number, index: number) {
        const prevPoint = points[wrap(index - 1, points.length)];
        const point = points[index];
        const nextPoint = points[wrap(index + 1, points.length)];

        return [Point.lerp(ratio, point, prevPoint), Point.lerp(ratio, point, nextPoint)];
    }

    interpolateDynamic(maxAngleDeg: number, maxIterations = 10, closed = false) {
        let result: Point[] = this.controlPoints;

        let isResultStable = false;
        let iteration = 0;

        while (!isResultStable && iteration < maxIterations) {
            // Let's assume that nothing will change.
            isResultStable = true;

            const tmpResult: Point[] = [];

            result.forEach((point, index, all) => {
                const prevPoint = closed ? all[wrap(index - 1, all.length)] : all[index - 1];
                const nextPoint = closed ? all[wrap(index + 1, all.length)] : all[index + 1];

                if (prevPoint && nextPoint) {
                    const angle = Point.angle(Point.fromTo(point, prevPoint), Point.fromTo(point, nextPoint));

                    // If the segments meet at a shallow angle don't subdivide.
                    if (approxEq(angle, Math.PI, degToRad(maxAngleDeg))) {
                        tmpResult.push(point);
                        return;
                    }
                }

                // Otherwise, let's smoothen the curve.
                if (prevPoint) tmpResult.push(Point.lerp(this.ratio, point, prevPoint));
                if (nextPoint) tmpResult.push(Point.lerp(this.ratio, point, nextPoint));

                // Okay we changed something. Let's do one more round, just to make sure.
                isResultStable = false;
            });

            result = tmpResult;
            iteration++;
        }

        return result;
    }

    interpolateDynamicClosed(maxAngleDeg: number) {
        let result: Point[] = this.controlPoints;

        const MAX_ITERATIONS = 5;

        let isResultStable = false;
        let iteration = 0;

        while (!isResultStable && iteration < MAX_ITERATIONS) {
            // Let's assume that nothing will change.
            isResultStable = true;

            const tmpResult: Point[] = [];

            result.forEach((point, index, all) => {
                const prevPoint = all[wrap(index - 1, all.length)];
                const nextPoint = all[wrap(index + 1, all.length)];

                const angle = Point.angle(Point.fromTo(point, prevPoint), Point.fromTo(point, nextPoint));

                // If the segments meet at a shallow angle don't subdivide.
                if (approxEq(angle, Math.PI, degToRad(maxAngleDeg))) {
                    tmpResult.push(point);
                    return;
                }

                // Otherwise, let's smoothen the curve.
                tmpResult.push(Point.lerp(0.25, point, prevPoint));
                tmpResult.push(Point.lerp(0.25, point, nextPoint));

                // Okay we changed something. Let's do one more round, just to make sure.
                isResultStable = false;
            });

            result = tmpResult;
            iteration++;
        }

        return result;
    }

    static cutCornersOpen(points: Point[], factor = 0.25) {
        const result: Point[] = [];

        points.forEach((point, index, all) => {
            if (index === all.length - 1) return;
            const nextPoint = all[index + 1];
            result.push(Point.lerp(factor, point, nextPoint));
            result.push(Point.lerp(1 - factor, point, nextPoint));
        });

        return result;
    }

    interpolateClosed(subdivisions: number) {
        let result: Point[] = this.controlPoints;
        for (let i = 0; i < subdivisions; i++) {
            result = CornerCuttingCurve.cutCornersClosed(result, this.ratio);
        }
        return result;
    }

    interpolateOpen(subdivisions: number) {
        let result: Point[] = this.controlPoints;
        for (let i = 0; i < subdivisions; i++) {
            result = CornerCuttingCurve.cutCornersOpen(result, this.ratio);
        }
        return result;
    }

    toOpenSegments(subdivisions: number) {
        return Segment.fromPoints(this.interpolateOpen(subdivisions));
    }

    toClosedSegments(subdivisions: number) {
        return Segment.fromPoints(this.interpolateClosed(subdivisions));
    }

    insertControlPoint(index: number, point: Point) {
        return new CornerCuttingCurve([...this.controlPoints].splice(index, 0, point), this.ratio);
    }
}
