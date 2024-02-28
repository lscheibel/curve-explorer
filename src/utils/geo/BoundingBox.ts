import { Point } from './Point';

export class BoundingBox {
    left: number;
    top: number;
    right: number;
    bottom: number;

    constructor(left: number, top: number, right: number, bottom: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    get center() {
        return new Point(this.left + this.width / 2, this.top + this.height / 2);
    }

    get width() {
        return this.right - this.left;
    }

    get height() {
        return this.bottom - this.top;
    }

    static fromPoints(points: Point[]) {
        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);
        return new BoundingBox(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
    }
}
