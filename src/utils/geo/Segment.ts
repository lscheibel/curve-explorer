import { Point } from './Point';
import { BoundingBox } from './BoundingBox';
import { clamp } from '../math';

export class Segment {
    a: Point;
    b: Point;

    constructor(from: Point, to: Point) {
        this.a = from;
        this.b = to;
    }

    get from() {
        return this.a;
    }

    get to() {
        return this.b;
    }

    get vector() {
        return new Point(this.b.x - this.a.x, this.b.y - this.a.y);
    }

    /*
     * The mode describes the behavior when the perpendicular point would lie outside the segment.
     *
     * Example:
     *
     *  x = Target point
     *  a = Point A of segment
     *  b = Point B of segment
     *  e = Point returned in 'extend' mode
     *  c = Point returned in 'clamp' mode
     *
     *  'strict' mode would return null, because the target point is not perpendicular to the segment.
     *
     *     e     ca—————————————b
     *     |
     *     |
     *     x
     */
    nearestPoint(p: Point, mode: 'extend' | 'clamp' | 'strict' = 'strict') {
        const { a, b } = this;
        const length = this.vector.magnitude;
        if (length === 0) return null;

        const aToB = b.sub(a);
        const aToP = p.sub(a);
        let t = (aToP.x * aToB.x + aToP.y * aToB.y) / (aToB.x ** 2 + aToB.y ** 2);

        if (mode === 'strict' && (t < 0 || t > 1)) return null;
        if (mode === 'clamp') t = clamp(t, 0, 1);
        if (t === 0) return a;
        if (t === 1) return b;

        return a.add(aToB.multiply(t));
    }

    static fromPoints(points: Point[]) {
        const segments: Segment[] = [];

        points.forEach((point, index, all) => {
            if (index === all.length - 1) return;
            segments.push(new Segment(point, all[index + 1]));
        });

        return segments;
    }

    static fromPointsClosed(points: Point[]) {
        const segments: Segment[] = [];

        points.forEach((point, index, all) => {
            segments.push(new Segment(point, all[(index + 1) % all.length]));
        });

        return segments;
    }

    static fromBoundingBox(bbox: BoundingBox) {
        const points = [
            new Point(bbox.left, bbox.top),
            new Point(bbox.right, bbox.top),
            new Point(bbox.right, bbox.bottom),
            new Point(bbox.left, bbox.bottom),
        ];

        return Segment.fromPointsClosed(points);
    }
}
