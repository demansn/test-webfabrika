export default class UserInputController extends PIXI.utils.EventEmitter {
    constructor() {
        super();

        window.document.addEventListener('keydown', this.onDownKeyboard.bind(this));
        window.document.addEventListener('keypress', this.onPressKeyboard.bind(this));
        window.document.addEventListener('keyup', this.onUpKeyboard.bind(this));
    }

    destroy() {
        window.document.removeEventListener('keydown', this.onDownKeyboard.bind(this));
        window.document.removeEventListener('keypress', this.onPressKeyboard.bind(this));
        window.document.removeEventListener('keyup', this.onUpKeyboard.bind(this));
    }

    onDownKeyboard({key}) {
        this.emitEvent(key, 'down');
    }

    onPressKeyboard({key}) {
        this.emitEvent(key, 'press');
    }

    onUpKeyboard({key}) {
        this.emitEvent(key, 'up');
    }

    emitEvent(key, prefics) {
        if(key === 'ArrowDown' || key === 'ArrowRight' || key === 'ArrowLeft') {
            this.emit(`${prefics}${key}`);
        }
    }
}
