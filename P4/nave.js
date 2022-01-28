const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.width = 600;
ctx.height = 900;

var nome = navigator.userAgent;
var direita = 39;
var esquerda = 37;

if (nome.indexOf('Chrome') != -1) {
    direita = 100;
    esquerda = 97;
}

var fundo = new (function () {
    this.img = new Image();
    this.img.src = 'fundo.png';
    this.iniframe = 0;
    this.w = 200;
    this.h = 30;
    this.length = 10;
})();

var fundo2 = new (function () {
    this.img = new Image();
    this.img.src = 'nuvem.png';
    this.iniframe = 0;
    this.w = 2160;
    this.h = 480;
    this.length = 10;
})();

var nave = new (function () {
    this.x = 88;
    this.y = 220;
    this.w = 24;
    this.h = 24;
    this.frame = 1;
    this.img = new Image();
    this.img.src = './player.png';
})();

function limpa() {
    ctx.fillStyle = '#d0e7f9';
    ctx.rect(0, 0, ctx.width, ctx.height);
    ctx.fill();
}

function desenha() {
    desenhaFundo();
    ctx.drawImage(
        nave.img,
        nave.w * nave.frame,
        0,
        nave.w,
        nave.h,
        nave.x,
        nave.y,
        nave.w,
        nave.h
    );
}

function desenhaFundo() {
    for (let i = 0; i < fundo2.length; i++) {
        posicaoOrigemY =
            (fundo2.w / 20) * ((fundo2.iniframe + i) % fundo2.length);
        y = (fundo2.h / 20) * (fundo2.length - i);
        ctx.drawImage(
            fundo2.img,
            posicaoOrigemY,
            0,
            fundo2.w,
            fundo2.h,
            y,
            0,
            fundo2.w,
            fundo2.h
        );
    }
    fundo2.iniframe = (fundo2.iniframe + 1) % fundo2.length;
}

var GameLoop = function () {
    desenha();
    setTimeout(GameLoop, 100);
};

GameLoop();
