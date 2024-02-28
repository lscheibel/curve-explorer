export const incrementalRound = (n: number, increment: number, offset = 0) => {
    return Math.round((n - offset) / increment) * increment + offset;
};

export const wrap = (x: number, m: number) => {
    return ((x % m) + m) % m;
};

export const clamp = (n: number, min: number, max: number) => {
    return Math.max(min, Math.min(n, max));
};

export const approxEq = (a: number, b: number, epsilon = Number.EPSILON) => {
    return a === b ? true : Math.abs(a - b) < epsilon;
};

export const logBase = (n: number, base: number) => Math.log(n) / Math.log(base);

export const mapRange = (value: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

export const invLerp = (t: number, a: number, b: number) => {
    if (b - a === 0) return 0;
    return (t - a) / b - a;
};

export const exponent = (n: number, base = 10) => Math.floor(logBase(n, base));

export const degToRad = (angle: number) => {
    return angle * (Math.PI / 180);
};
export const radToDeg = (angle: number) => {
    return angle * (180 / Math.PI);
};
