const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('spaceship','assets/spaceship.png');
    this.load.image('bullet','assets/bullet.png');
    this.load.image('enemy','assets/enemy.png');

}

var player;
var controls;

var fireKey;
var restartkey;

var bullets;

function create() {

    player = this.physics.add.sprite(400, 500, 'spaceship').setScale(1.5);

    controls = this.input.keyboard.createCursorKeys();

    fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });
}

function update() {

        // Move player
        player.setVelocity(0);

        if (controls.left.isDown) {
            player.setVelocityX(-200);
        } else if (controls.right.isDown) {
            player.setVelocityX(200);
        }

        // Fire bullets
        if (Phaser.Input.Keyboard.JustDown(fireKey)) {
            fireBullet();
        }
}

function fireBullet() {

    var bullet = bullets.get();

    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setPosition(player.x, player.y - 50);
        bullet.setVelocityY(-400);
    }
}
