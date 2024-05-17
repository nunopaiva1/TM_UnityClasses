// Phaser game configuration
var config = {
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

// Initialize Phaser game
var game = new Phaser.Game(config);

// Preload assets
function preload() {
    this.load.image('spaceship', 'assets/spaceship.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('background', 'assets/background.png');
}

// Global variables
var background;

var player;
var bullets;
var enemies;
var cursors;
var fireKey;
var restartKey;
var shiftKey;

var score = 0;
var scoreText;
var lives = 3;
var livesText;

// Define initial enemy velocity
var initialEnemyVelocity = 100;

// Create game elements
function create() {

    // Create background
    background = this.add.image(400, 300, 'background');

    // Create player spaceship
    player = this.physics.add.sprite(400, 500, 'spaceship');
    player.setCollideWorldBounds(true);

    // Create bullets
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    // Create enemies
    enemies = this.physics.add.group({
        defaultKey: 'enemy',
        maxSize: 20,
        runChildUpdate: true // Enables automatic update of child objects so we don't need
        // to call enemies.getChildren().forEach(function(enemy) { ... }
    });

    // Set up keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // Spawn enemies
    this.time.addEvent({
        delay: 1000, // 1 second in milliseconds
        loop: true,
        callback: spawnEnemy
    });

        // Set up a timer event to increase enemy velocity every 10 seconds
    var increaseVelocityEvent = this.time.addEvent({
        delay: 10000, // 10 seconds
        loop: true,
        callback: increaseEnemyVelocity,
        callbackScope: this
    });

    // Display score
    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    // Display lives
    livesText = this.add.text(625, 20, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });

}

// Update game state
function update() {
    // Move player
    player.setVelocity(0);
    let velocity = 200;

    // Check for dash
    if (shiftKey.isDown) {
        velocity = 400; // Increase velocity when shift is held
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-velocity);
    } else if (cursors.right.isDown) {
        player.setVelocityX(velocity);
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

    // Fire bullets
    if (Phaser.Input.Keyboard.JustDown(fireKey)) {
        fireBullet();
    }

    // Restart game
    if(Phaser.Input.Keyboard.JustDown(restartKey)) {
        this.scene.restart();
    }

    // Check for bullet-enemy collision
    // 'null' is used to specify the default context for the callback function
    // 'this' is used to specify the context in which the overlap check is performed.
    this.physics.overlap(bullets, enemies, bulletHitEnemy, null, this);
    this.physics.overlap(player, enemies, playerHitEnemy, null, this);

}

// Spawn an enemy
function spawnEnemy() {
    var enemy = enemies.get();
    if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.setRandomPosition(0, 0, game.config.width, 0); //minimum x, minimum y, maximum x, maximum y
        enemy.setVelocityY(initialEnemyVelocity);
    }
}

// Fire a bullet
function fireBullet() {
    var bullet = bullets.get();
    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setPosition(player.x, player.y - 20);
        bullet.setVelocityY(-400);
    }
}

// Bullet-enemy collision handler
function bulletHitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

// Player-enemy collision handler
function playerHitEnemy(player, enemy) {
    enemy.destroy();
    lives -= 1;
    livesText.setText('Lives: ' + lives);
    if (lives <= 0) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5);
    }
}

// Function to increase enemy velocity
function increaseEnemyVelocity() {
    initialEnemyVelocity += 50; // Increase velocity by 50 units
}
