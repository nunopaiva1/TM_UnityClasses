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
    this.load.image('background','assets/background.png');
}

var player;
var controls;

var fireKey;
var restartKey;

var background;

var enemies;

var score = 0;
var lives = 3;
var scoreText;
var livesText;

function create() {

    background = this.add.image(400, 300, 'background');

    player = this.physics.add.sprite(400, 500, 'spaceship').setScale(1.5);
    player.setCollideWorldBounds(true);

    controls = this.input.keyboard.createCursorKeys();

    fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    enemies = this.physics.add.group({
        defaultKey: 'enemy',
        maxSize: 20,
        runChildUpdate: true
    });

    this.time.addEvent({
        delay: 1000, // 1 second in milliseconds
        loop: true,
        callback: spawnEnemy
    });

    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
    livesText = this.add.text(625, 20, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });
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

        // Restart game
        if (Phaser.Input.Keyboard.JustDown(restartKey)) {
            score = 0;
            lives = 3;
            this.scene.restart();
        }

        // Gets all enemies that are active and checks if they are off the screen
        Phaser.Actions.Call(enemies.getChildren(), function(enemy) {
        if (enemy.active && enemy.y > game.config.height) {
            enemy.destroy();
            lives -= 1;
            livesText.setText('Lives: ' + lives);
            if (lives <= 0) {
                this.physics.pause();
                player.setTint(0xff0000);
                this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5);
            }
            }
        }, this);

        Phaser.Actions.Call(bullets.getChildren(), function(bullet) {
            if (bullet.active && bullet.y < 0) {
                bullet.destroy();
            }
        }, this);

        this.physics.overlap(bullets, enemies, bulletHitEnemy, null, this);
        this.physics.overlap(player, enemies, playerHitEnemy, null, this);
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

function spawnEnemy() {
    var enemy = enemies.get();

    if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.setRandomPosition(0, 0, game.config.width, 0); //minimum x, minimum y, maximum x, maximum y
        enemy.setVelocityY(100);
    }
}

function bulletHitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    
    score += 10;
    scoreText.setText('Score: ' + score);
}

function playerHitEnemy(player, enemy) {
    enemy.destroy();

    lives -= 1;
    livesText.setText('Lives: ' + lives);

    if(lives <= 0) {
        this.physics.pause();

        player.setTint(0xff0000);
        this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5);
    }
}
