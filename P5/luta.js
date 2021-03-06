var config = {
    type: Phaser.WEBGL,
    width: 675,
    height: 353,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 }, debug: false },
    },
    scene: { preload: preload, create: create, update: update },
};

var game = new Phaser.Game(config);

var cursors;
var plataformas;
var lutA;
var lutB;
var chao = 277;
var cont = 0;
var actionsA = ['idleA', 'kickA', 'punchA', 'lowpunchA', 'blockA', 'mortalA'];
var statesA = ['aliveA', 'fall1A', 'fall2A', 'dyingA', 'deadA'];
var valorVidaA = 100;
var valorVidaB = 100;
var vidaA, vidaB;
var particles;

function preload() {
    this.load.spritesheet('lutadorA', 'karatea.png', {
        frameWidth: 75,
        frameHeight: 75,
    });
    this.load.spritesheet('lutadorB', 'karateb.png', {
        frameWidth: 75,
        frameHeight: 75,
    });
    this.load.image('fundo', 'fundonoite.png');
    this.load.image('plata', 'plataforma.png');
}

let keyX;
let keyC;

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

    this.add.image(0, 0, 'fundo').setOrigin(0, 0);

    plataformas = this.physics.add.staticGroup();
    plataformas
        .create(18, chao, 'plata')
        .setOrigin(0, 0)
        .setScale(1)
        .refreshBody();

    vidaA = this.add
        .rectangle(560, 320, valorVidaA, 10, 0x6666ff)
        .setOrigin(0, 0);
    vidaB = this.add
        .rectangle(20, 320, valorVidaB, 10, 0xff33cc)
        .setOrigin(0, 0);

    //*******************
    // Cria a lutador A *
    //*******************
    lutA = this.physics.add.sprite(530, 180, 'lutadorA').setOrigin(0, 0);
    lutA.setBounce(0.2);
    lutA.setCollideWorldBounds(true);
    lutA.body.setGravityY(300);

    this.anims.create({
        key: 'idleA',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 8,
            end: 9,
        }),
        frameRate: 2,
        repeat: -1,
    });

    this.anims.create({
        key: 'kickA',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 0,
            end: 6,
        }),
        frameRate: 5,
    });

    this.anims.create({
        key: 'punchA',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 17,
            end: 19,
        }),
        frameRate: 5,
    });

    this.anims.create({
        key: 'lowpunchA',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 11,
            end: 13,
        }),
        frameRate: 5,
    });

    this.anims.create({
        key: 'blockA',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 9,
            end: 10,
        }),
        frameRate: 5,
    });

    this.anims.create({
        key: 'mortalA',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 40,
            end: 49,
        }),
        frameRate: 5,
    });

    this.anims.create({
        key: 'dyingA',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 20,
            end: 23,
        }),
        frameRate: 10,
    });

    this.anims.create({
        key: 'fall1A',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 20,
            end: 29,
        }),
        frameRate: 5,
    });

    this.anims.create({
        key: 'deadA',
        frames: this.anims.generateFrameNumbers('lutadorA', {
            start: 23,
            end: 23,
        }),
        frameRate: 10,
    });

    lutA.anims.play('idleA', true);

    //*******************
    // Cria a lutador B *
    //*******************
    lutB = this.physics.add.sprite(230, 180, 'lutadorB').setOrigin(0, 0);
    lutB.setBounce(0.2);
    lutB.setCollideWorldBounds(true);
    lutB.body.setGravityY(300);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('lutadorB', {
            start: 0,
            end: 3,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('lutadorB', {
            start: 0,
            end: 3,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('lutadorB', {
            start: 0,
            end: 1,
        }),
        frameRate: 2,
        repeat: -1,
    });

    this.anims.create({
        key: 'kick',
        frames: this.anims.generateFrameNumbers('lutadorB', {
            start: 4,
            end: 10,
        }),
        frameRate: 20,
    });

    this.anims.create({
        key: 'punch',
        frames: this.anims.generateFrameNumbers('lutadorB', {
            start: 17,
            end: 19,
        }),
        frameRate: 5,
    });

    this.anims.create({
        key: 'lowPunch',
        frames: this.anims.generateFrameNumbers('lutadorB', {
            start: 11,
            end: 13,
        }),
        frameRate: 5,
    });

    lutB.anims.play('idle', true);

    this.physics.add.collider(lutA, plataformas);
    this.physics.add.collider(lutB, plataformas);

    var collider = this.physics.add.collider(
        lutA,
        lutB,
        function (lutA, lutB) {
            if (lutB.anims.currentAnim.key == 'kick') {
                lutA.anims.play('fall1A', true);
            }
            if (lutB.anims.currentAnim.key == 'punch') {
                lutA.anims.play('fall1A', true);
            }
            if (lutB.anims.currentAnim.key == 'lowPunch') {
                lutA.anims.play('fall1A', true);
            }
            lutB.x -= 5;
        },
        null,
        this
    );
}

function update() {
    if (
        lutA.anims.getProgress() == 1 &&
        lutA.anims.currentAnim.key != 'deadA'
    ) {
        let n = Math.floor(Math.random() * 100);
        if (n < 90) {
            lutA.anims.play('idleA', true);
        } else {
            n = Math.floor(Math.random() * 100) % 6;
            lutA.anims.play(actionsA[n], true);
        }
    }

    if (lutB.anims.currentAnim.key != 'idle') {
        if (lutB.anims.getProgress() == 1) {
            lutB.anims.play('idle', true);
        }
    }

    lutB.setVelocity(0);
    if (cursors.left.isDown) {
        lutB.setVelocityX(-100);
        lutB.anims.play('left', true);
    } else if (cursors.right.isDown) {
        lutB.setVelocityX(100);
        lutB.anims.play('right', true);
    } else if (cursors.up.isDown) {
        lutB.x += 2;
        lutB.anims.play('kick', true);
    } else if (keyC.isDown) {
        lutB.anims.play('punch', true);
    } else if (keyX.isDown) {
        lutB.anims.play('lowPunch', true);
    }
}
