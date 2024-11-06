export function getObjectPositionKey(lane, z) {
    return `${lane}:${Math.round(z * 10)}`;
}