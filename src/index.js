import Hero from './js/Hero.js';
import NPC from './js/NPC.js';

const gameCanvas = document.getElementById('game-canvas');
const app        = new PIXI.Application(1024, 768, {backgroundColor:0x1099bb, view: gameCanvas});
const gameObjects = [];
const spritesData = {
	moveForward: 'sniper_move_cam_180_000\\d+',
	moveRight: 'sniper_move_cam_270_000\\d+',
	death: 'sniper_death_000\\d+'
};


const initTest = function() {

	spritesData.moveForward = getSpriteFrames(spritesData.moveForward);
	spritesData.moveRight = getSpriteFrames(spritesData.moveRight);
	spritesData.death = getSpriteFrames(spritesData.death);

	PIXI.ticker.shared.add(collisionTest, this);

	spawnHero();
	spawnNPC();
};

const spawnHuman = function(HumanClass) {

	const human = new HumanClass(
		spritesData.moveForward,
		spritesData.moveRight,
		spritesData.death
	);

	addGameObject(human);

	return human;
};

const spawnHero = function() {

	const hero = spawnHuman(Hero);

	hero.position.set(200, 100);
	hero.on('died', () => spawnHero(), this);
};

const spawnNPC = function() {

	const npc = spawnHuman(NPC);

	npc.position.set(300, 100);
	npc.on('died', () => spawnNPC(), this);
};

const addGameObject = function(gameObject) {

	PIXI.ticker.shared.add(gameObject.update, gameObject);
	app.stage.addChild(gameObject);

	gameObjects.push(gameObject);

	gameObject.on('died', () => removeGameObject(gameObject) );
};

const removeGameObject = function(gameObject) {

	let index = gameObjects.indexOf(gameObject);

	if (index > -1) {
		gameObjects.splice(index, 1);
	}
};

const collisionTest = function() {

	gameObjects.forEach( go => {

		const isLeftCollision   = go.x - go.width / 2 <= 0;
		const isRightCollision  = go.x + go.width / 2 >= app.screen.width;
		const isBottomCollision = go.y + go.height / 2 >= app.screen.height;

		if (isLeftCollision || isRightCollision || isBottomCollision) {
			go.death();
		}
	});
};

const getSpriteFrames = function(regExpData) {

	let regExp = new RegExp(regExpData);

	return Object.keys(PIXI.utils.TextureCache)
				.filter(i => regExp.test(i))
				.sort((a, b) => a.localeCompare(b))
				.map(i => PIXI.utils.TextureCache[i]);
};

PIXI.loader
		.add('./assets/spritesheet.json')
		.load(initTest);
