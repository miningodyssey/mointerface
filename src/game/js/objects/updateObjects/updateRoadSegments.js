import {createRoadSegments} from "../addingObjects/createRoadSegments.js";

export function updateRoadSegments(scene, heroBaseY, hero, roadBox, roadSegmentPool, roadInPath, segmentLength) {
    const heroZ = hero.position.z;

    // Проверка, нужно ли создать новые сегменты
    if (roadInPath.length === 0 || roadInPath[roadInPath.length - 1].position.z < heroZ + 30) {
        createRoadSegments(
            scene,
            heroBaseY,
            roadInPath.length > 0 ? roadInPath[roadInPath.length - 1].position.z + segmentLength : heroZ,
            1, // Создаем 1 новый сегмент за раз
            roadSegmentPool,
            roadInPath,
            segmentLength
        );
    }

    // Удаление сегментов, которые вышли за пределы видимости
    for (let i = roadInPath.length - 1; i >= 0; i--) {
        const segment = roadInPath[i];
        if (segment.position.z < -1) {
            roadInPath.splice(i, 1);
            roadSegmentPool.release(segment);
        }
    }
}
