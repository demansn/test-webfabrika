import Human from './Human.js';

export default class NPC extends Human {
    constructor(...args) {
        super(...args);

        this.move();
    }

    update(dt) {
        super.update(dt);

        if (this.y >= 300 && this.direction.x === 0) {
            this.idle();
            this.turnRight();
            this.move();
        }
    }
}
