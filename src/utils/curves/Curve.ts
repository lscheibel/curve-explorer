import { Point } from '../geo/Point';
import { Segment } from '../geo/Segment';

export class Curve {
    private points: Point[];

    constructor(points: Point[]) {
        this.points = points;
    }

    get start() {
        return this.points[0];
    }

    get end() {
        return this.points[this.points.length - 1];
    }
}
