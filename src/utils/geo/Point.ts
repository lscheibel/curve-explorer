export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static halfwayBetween(pointA: Point, pointB: Point) {
        return new Point((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2);
    }

    static average(points: Point[]) {
        const x = points.reduce((acc, p) => acc + p.x, 0);
        const y = points.reduce((acc, p) => acc + p.y, 0);
        return new Point(x / points.length, y / points.length);
    }

    static fromTo(from: Point, to: Point) {
        return new Point(to.x - from.x, to.y - from.y);
    }

    // Returns the directed angle between two vectors from 0 to 2*PI
    static angle(a: Point, b: Point) {
        let r = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
        if (r < 0) r += 2 * Math.PI;
        return r;
    }

    static lerp(t: number, pointA: Point, pointB: Point) {
        const x = (1 - t) * pointA.x + t * pointB.x;
        const y = (1 - t) * pointA.y + t * pointB.y;
        return new Point(x, y);
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get normalized() {
        return new Point(this.x / this.magnitude, this.y / this.magnitude);
    }

    get normal() {
        return new Point(-this.y, this.x);
    }

    move(delta: Point) {
        return new Point(this.x + delta.x, this.y + delta.y);
    }

    add(point: Point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    sub(point: Point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    multiply(scalar: number) {
        return new Point(this.x * scalar, this.y * scalar);
    }
}
