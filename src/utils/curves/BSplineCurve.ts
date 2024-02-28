import { Point } from '../geo/Point';
import { invLerp } from '../math';
import { Segment } from '../geo/Segment';

const BSpline = (t: number, index: number, knots: number[], degree: number): number => {
    if (degree === 0) {
        return knots[index] <= t && t < knots[index] ? 1 : 0;
    }

    const currWeight = (t - knots[index]) / (knots[index + degree] - knots[index]);
    const curr = BSpline(t, index, knots, degree - 1);

    const nextWeight = (knots[index + degree + 1] - t) / (knots[index + degree + 1] - knots[index + 1]);
    const next = BSpline(t, index + 1, knots, degree - 1);

    return currWeight * curr + nextWeight * next;
};

export class BSplineCurve {
    controlPoints: Point[];
    degree: number;
    knots: number[];

    constructor(controlPoints: Point[], degree: number) {
        this.controlPoints = [...controlPoints];

        this.degree = degree;
        this.knots = BSplineCurve.generateUniformKnots(this.controlPoints.length, degree);
    }

    getPointByKnotValue(t: number) {
        let knotIndex = 0;
        const parameterSpaceKnotIndexEnd = this.knots.length - this.degree - 1;
        if (t >= this.knots[parameterSpaceKnotIndexEnd]) {
            knotIndex = parameterSpaceKnotIndexEnd - 1;
        } else {
            this.knots.forEach((knot, i, all) => {
                if (knot <= t && t < all[i + 1]) {
                    knotIndex = i;
                }
            });
        }
        return this.sample(knotIndex, t);
    }

    sample(index: number, t: number) {
        const buffer: Point[] = [];

        // Populate buffer with relevant control points range.
        for (let i = 0; i < this.degree + 1; i++) {
            buffer[i] = this.controlPoints[i + index - this.degree];
        }

        // Reduce points until only one is left: https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/de-boor-ex-1.jpg
        // Implementation stolen from https://github.com/FreyaHolmer/Mathfs/blob/master/Runtime/Splines/Multi-Segment%20Splines/BSpline2D.cs
        // But inspired by https://en.wikipedia.org/wiki/De_Boor%27s_algorithm
        for (let r = 1; r < this.degree + 1; r++) {
            for (let j = this.degree; j > r - 1; j--) {
                const weight =
                    (t - this.knots[j + index - this.degree]) /
                    (this.knots[j + 1 + index - r] - this.knots[j + index - this.degree]);
                buffer[j] = Point.lerp(weight, buffer[j - 1], buffer[j]);
            }
        }

        return buffer[this.degree];
    }

    static generateUniformKnots(controlPointsCount: number, degree: number) {
        const knots: number[] = [];

        for (let i = 0; i < degree; i++) {
            knots.push(0);
        }

        for (let i = 0; i <= controlPointsCount - degree; i++) {
            knots.push(i / (controlPointsCount - degree));
        }

        for (let i = 0; i < degree; i++) {
            knots.push(1);
        }

        return knots;
    }

    interpolate(resolution: number) {
        const result: Point[] = [];

        for (let i = 0; i < resolution; i++) {
            const t = i / (resolution - 1);
            result.push(this.getPointByKnotValue(t));
        }

        return result;
    }

    toSegments(resolution: number) {
        return Segment.fromPoints(this.interpolate(resolution));
    }
}
