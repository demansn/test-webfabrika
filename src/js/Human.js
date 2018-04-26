const RIGHT_DIRECTION  = {x: 1, y: 0};
const LEFT_DIRECTION  = {x: -1, y: 0};
const FORWARD_DIRECTION   = {x: 0, y: 1};
const MOVE_SPEED  = 0.5;
const IDLE_SPEED  = 0;

const STATE = {
    IDLE: 'idle',
    MOVE: 'move',
    DEATH: 'death',
    TURN_FORWARD: 'turn_forward',
    TURN_RIGHT  : 'turn_right',
    TURN_LEFT   : 'turn_left'
};

export default class Human extends PIXI.Container {
    constructor(forwardTextures, rightTextures, deathTextures) {
        super();

        this.forwardFrames = forwardTextures;
        this.rightFrames = rightTextures;
        this.deathFrames = deathTextures;

        this.speed = IDLE_SPEED;
        this.direction = FORWARD_DIRECTION;
        this.sprite = new PIXI.extras.AnimatedSprite(forwardTextures);
        this.sprite.anchor.set(0.5);

        this.addChild(this.sprite);

        this.transitions = [
            {from: STATE.IDLE, to: STATE.MOVE, enter: this.onMove.bind(this) },
            {from: STATE.MOVE, to: STATE.IDLE, enter: this.onIdle.bind(this) },
            {from: STATE.TURN_FORWARD, to: STATE.IDLE, enter: this.onIdle.bind(this) },
            {from: STATE.TURN_RIGHT, to: STATE.IDLE, enter: this.onIdle.bind(this) },
            {from: STATE.TURN_LEFT, to: STATE.IDLE, enter: this.onIdle.bind(this) },
            {from: STATE.IDLE, to: STATE.TURN_FORWARD, enter: this.onTurnForward.bind(this) },
            {from: STATE.IDLE, to: STATE.TURN_RIGHT, enter: this.onTurnRight.bind(this) },
            {from: STATE.IDLE, to: STATE.TURN_LEFT, enter: this.onTurnLeft.bind(this) },
            {from: STATE.IDLE, to: STATE.DEATH, enter: this.onDead.bind(this) },
            {from: STATE.MOVE, to: STATE.DEATH, enter: this.onDead.bind(this) }
        ];

        this.state = STATE.IDLE;

        PIXI.ticker.shared.add(this.update, this);
    }

    idle() {
        this.setState(STATE.IDLE);
    }

    move() {
        this.setState(STATE.MOVE);
    }

    turnRight() {
        if (this.direction !== RIGHT_DIRECTION) {
            this.setState(STATE.TURN_RIGHT);
        }
    }

    turnLeft() {
        if (this.direction !== LEFT_DIRECTION) {
            this.setState(STATE.TURN_LEFT);
        }
    }

    turnForward() {
        if (this.direction !== FORWARD_DIRECTION) {
            this.setState(STATE.TURN_FORWARD);
        }
    }

    death() {
        this.setState(STATE.DEATH);
    }

    update(dt) {
        this.x += this.speed * this.direction.x * dt;
        this.y += this.speed * this.direction.y * dt;
    }

    destroy() {
        PIXI.ticker.shared.remove(this.update, this);
        this.emit('died', this);
        super.destroy();
    }

    setState(nextState) {

        if (this.state === nextState) {
            return;
        }

        let transition = this.transitions.find( tr => tr.to === nextState && tr.from === this.state );

        if (transition) {
            this.state = nextState;
            transition.enter();
        }
    }

    onTurnRight() {
        this.direction = RIGHT_DIRECTION;
        this.sprite.textures = this.rightFrames;
        this.sprite.scale.x = 1;
        this.setState(STATE.IDLE);
    }

    onTurnLeft() {
        this.direction = LEFT_DIRECTION;
        this.sprite.textures = this.rightFrames;
        this.sprite.scale.x = -1;
        this.setState(STATE.IDLE);
    }

    onTurnForward() {
        this.direction = FORWARD_DIRECTION;
        this.sprite.textures = this.forwardFrames;
        this.setState(STATE.IDLE);
    }

    onMove() {
        this.speed = MOVE_SPEED;
        this.sprite.loop = true;
        this.sprite.gotoAndPlay(0);
    }

    onIdle() {
        this.speed = IDLE_SPEED;
        this.sprite.gotoAndStop(0);
    }

    onDead() {
        this.speed = IDLE_SPEED;
        this.sprite.textures = this.deathFrames;
        this.sprite.loop = false;
        this.sprite.gotoAndPlay(0);
        this.sprite.onComplete = this.destroy.bind(this);
    }
}
