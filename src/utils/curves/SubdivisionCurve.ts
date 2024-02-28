import { Point } from '../geo/Point';
import { Segment } from '../geo/Segment';

export class SubdivisionCurve {
    controlPoints: Point[];

    constructor(controlPoints: Point[]) {
        this.controlPoints = controlPoints;
    }

    static subdivide(points: Point[]) {
        const result: Point[] = [];

        points.forEach((point, index, all) => {
            const nextPoint = all[index + 1];
            const prevPoint = all[index - 1];

            // Last vertex.
            if (!nextPoint) {
                result.push(point);
                return;
            }

            // First vertex.
            if (!prevPoint) {
                result.push(point);
                const nextEdgeMidpoint = Point.halfwayBetween(point, nextPoint);
                result.push(nextEdgeMidpoint);
                return;
            }

            const nextEdgeMidpoint = Point.halfwayBetween(point, nextPoint);
            const prevEdgeMidpoint = Point.halfwayBetween(point, prevPoint);

            const averageEdgeMidpoint = Point.halfwayBetween(nextEdgeMidpoint, prevEdgeMidpoint);
            const nextControlPoint = Point.halfwayBetween(averageEdgeMidpoint, point);

            result.push(nextControlPoint);
            result.push(nextEdgeMidpoint);
        });

        return result;
    }

    interpolateOpen(subdivisions: number) {
        let result = this.controlPoints;

        for (let i = 0; i < subdivisions; i++) {
            result = SubdivisionCurve.subdivide(result);
        }

        return result;
    }

    toOpenSegments(subdivisions: number) {
        return Segment.fromPoints(this.interpolateOpen(subdivisions));
    }
}
