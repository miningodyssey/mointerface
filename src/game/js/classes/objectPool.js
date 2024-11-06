export class ObjectPool {
    constructor(createFn = null, initialSize = 0) {
        this.createFn = createFn;
        this.pool = [];
        if (createFn && initialSize > 0) {
            this.initialize(initialSize);
        }
    }

    setCreateFunction(createFn) {
        this.createFn = createFn;
    }

    initialize(size) {
        for (let i = 0; i < size; i++) {
            const obj = this.createFn();
            if (obj) {
                this.pool.push(obj);
            } else {
                console.error(`Failed to create object for pool at index ${i}.`);
                break;
            }
        }
    }

    acquire() {
        if (this.pool.length === 0) {
            const newObj = this.createFn();
            if (newObj) {
                newObj.setEnabled(true)
                return newObj;
            } else {
                console.error("Failed to create a new object when pool was empty.");
                return null;
            }
        }
        const obj = this.pool.pop();
        if (obj) {
            obj.setEnabled(true);
            return obj;
        } else {
            console.error("Failed to acquire object from the pool.");
            return null;
        }
    }

    release(obj) {
        if (obj) {
            obj.setEnabled(false);
            this.pool.push(obj);
        } else {
            console.error("Cannot release a null object.");
        }
    }

    length() {
        console.log(this.pool.length);
    }

    resetAllObjects() {
        this.pool.forEach((obj) => {
            obj.setEnabled(false); // Отключение объекта
        });
    }
}
