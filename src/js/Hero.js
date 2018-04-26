import Human from './Human.js';
import UserInputController from './UserInputController.js';

export default class Hero extends Human {
    constructor(...args) {
        super(...args);

        this.inputController = new UserInputController(this);

        this.inputController.on('downArrowRight', this.turnRight, this);
        this.inputController.on('downArrowLeft', this.turnLeft, this);
        this.inputController.on('downArrowDown', this.turnForward, this);

        this.inputController.on('downArrowRight', this.move, this);
        this.inputController.on('downArrowLeft', this.move, this);
        this.inputController.on('downArrowDown', this.move, this);

        this.inputController.on('upArrowDown', this.idle, this);
        this.inputController.on('upArrowRight', this.idle, this);
        this.inputController.on('upArrowLeft', this.idle, this);
    }

    destroy() {
        this.inputController.destroy();
        super.destroy();
    }
}
