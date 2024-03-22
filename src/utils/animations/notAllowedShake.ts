export const notAllowedShake = (node: Element) => {
    const translateXKeyframe = (n: number) => ({ transform: `translateX(${n}px)` });
    node.animate(
        [
            translateXKeyframe(0),
            translateXKeyframe(5),
            translateXKeyframe(-4),
            translateXKeyframe(3),
            translateXKeyframe(-2),
            translateXKeyframe(1),
            translateXKeyframe(0),
        ],
        200
    );
};
