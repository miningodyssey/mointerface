
export function createRoadSegments(scene, heroBaseY, startZ, segmentCount, pool, roadInPath, segmentLength) {
    let lastZ = startZ;
    for (let i = 0; i < segmentCount; i++) {
        const segment = pool.acquire();

        // Устанавливаем позицию сегмента
        segment.position = new BABYLON.Vector3(0, heroBaseY, lastZ);

        // Добавляем сегмент в массив сегментов дороги
        roadInPath.push(segment);

        // Обновляем позицию последнего сегмента
        lastZ += segmentLength;

        // Применяем к сегменту физику, если необходимо
        if (segment.physicsImpostor) {
            segment.physicsImpostor.position = segment.position;
        }

        // Визуально отображаем сегмент
        segment.visibility = 1;
    }
}
