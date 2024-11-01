import {getObjectPositionKey} from "./getObjectPositionKey.js";

export function markPositionAsOccupied(occupiedPositions, lane, z, width) {
    const resolution = 0.1;
    for (let pos = z; pos < z + width; pos += resolution) {
        occupiedPositions.add(getObjectPositionKey(lane, pos));
    }
}