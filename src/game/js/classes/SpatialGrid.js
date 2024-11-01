export class SpatialGrid {
    constructor(gridSize = 1) {
        this.gridSize = gridSize;
        this.occupiedZones = new Map();
    }

    // Генерация ключа для позиции
    generateKey(x, z) {
        const gridX = Math.floor(x / this.gridSize);
        const gridZ = Math.floor(z / this.gridSize);
        return `${gridX}_${gridZ}`;
    }

    // Проверка, свободна ли зона
    isAreaFree(x, z, radius) {
        const startX = x - radius;
        const endX = x + radius;
        const startZ = z - radius;
        const endZ = z + radius;

        for (let gx = startX; gx <= endX; gx += this.gridSize) {
            for (let gz = startZ; gz <= endZ; gz += this.gridSize) {
                const key = this.generateKey(gx, gz);
                if (this.occupiedZones.has(key)) {
                    return false;
                }
            }
        }
        return true;
    }

    // Пометка зоны как занятой
    markAreaAsOccupied(x, z, radius) {
        const startX = x - radius;
        const endX = x + radius;
        const startZ = z - radius;
        const endZ = z + radius;

        for (let gx = startX; gx <= endX; gx += this.gridSize) {
            for (let gz = startZ; gz <= endZ; gz += this.gridSize) {
                const key = this.generateKey(gx, gz);
                this.occupiedZones.set(key, true);
            }
        }
    }

    // Очистка старых зон (например, если объекты прошли мимо)
    clearZone(x, z, radius) {
        const startX = x - radius;
        const endX = x + radius;
        const startZ = z - radius;
        const endZ = z + radius;

        for (let gx = startX; gx <= endX; gx += this.gridSize) {
            for (let gz = startZ; gz <= endZ; gz += this.gridSize) {
                const key = this.generateKey(gx, gz);
                this.occupiedZones.delete(key);  // Удаляем зону из занятых
            }
        }
    }

    // Полная очистка карты
    clearAll() {
        this.occupiedZones.clear();
    }
}
