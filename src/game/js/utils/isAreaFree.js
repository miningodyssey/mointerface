import {getObjectPositionKey} from "./getObjectPositionKey.js";

export function isAreaFree(occupiedPositions, lane, positionZ, length) {
    for (let i = 0; i < length; i += 0.05) {
        const key = getObjectPositionKey(lane, positionZ + i);
        if (occupiedPositions.has(key)) {
            return false;
        }
    }
    return true;
}