const game = new Phaser.Game(800, 600, Phaser.AUTO, "game", {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.load.tilemap(
    "test",
    "./assets/test.json",
    null,
    Phaser.Tilemap.TILED_JSON
  );
  game.load.atlas(
    "hero",
    `./assets/hero.png`,
    `./assets/hero.json`,
    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
  );
  game.load.spritesheet(
    "arcade-slopes-16",
    `./assets/arcade-slopes-16.png`,
    16,
    16
  );
}

var map;
var ground;
var hero;
var controls;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 1500;
  game.plugins.add(Phaser.Plugin.ArcadeSlopes);
  game.slopes.preferY = true;
  // Prefer the minimum Y offset globally
  game.slopes.preferY = true;

  //map
  map = game.add.tilemap("test");
  map.addTilesetImage("arcade-slopes-16");
  ground = map.createLayer("Tile Layer 1");
  map.setCollisionBetween(1, 38, true, ground);
  game.slopes.convertTilemapLayer(ground, "arcadeslopes");
  ground.debug = true;

  //hero
  hero = game.add.sprite(10, 0, "hero", 'idle-right-00-1.3');
  game.physics.arcade.enable(hero);
  hero.body.bounce.y = 0.3;
  hero.body.collideWorldBounds = true;
  hero.body.setSize(
    hero.body.halfWidth - 10,
    hero.body.height - 5,
    18,
    3
  );
  hero.inputEnabled = true;
  hero.hitArea = hero.body.width * hero.body.height;
  //enable hero for slopes
  game.slopes.enable(hero);
  // Prefer the minimum Y offset for this physics body
  hero.body.slopes.preferY = true;
  // Pull the player into downwards collisions with a velocity of 50
  hero.body.slopes.pullDown = 50;

  //anims
  //idle
  hero.animations.add(
    "idle-right",
    Phaser.Animation.generateFrameNames("idle-right-", 0, 3, "-1.3", 2),
    2,
    true,
    false
  );
  hero.animations.add(
    "idle-left",
    Phaser.Animation.generateFrameNames("idle-left-", 0, 3, "-1.3", 2),
    2,
    true,
    false
  );
  //run
  hero.animations.add(
    "run-right",
    Phaser.Animation.generateFrameNames("run-right-", 0, 5, "-1.3", 2),
    10,
    true,
    false
  );
  hero.animations.add(
    "run-left",
    Phaser.Animation.generateFrameNames("run-left-", 0, 5, "-1.3", 2),
    10,
    true,
    false
  );
  hero.animations.play("idle-right");
  //controls
  controls = game.input.keyboard.createCursorKeys();
  //set world bounds
  game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  game.camera.setBoundsToWorld();
  game.camera.follow(hero, Phaser.Camera.FOLLOW_PLATFORMER);
  game.camera.focusOn(hero);
}

function update() {
  game.physics.arcade.collide(hero, ground);

  hero.body.velocity.x = 0;
    
    //Running anims
    if (controls.left.isDown && !controls.right.isDown && !controls.up.isDown) {
        hero.body.velocity.x -= 150;
        hero.animations.play("run-left");
        
    } else if (controls.right.isDown && !controls.left.isDown && !controls.up.isDown) {
        hero.body.velocity.x += 150;
        hero.animations.play("run-right");
    } 

    if (controls.up.isDown) {
        hero.body.velocity.y -=150;
    }
}

function render() {
  game.debug.body(hero);
}
