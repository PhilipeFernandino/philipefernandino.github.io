const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.width = 400;
ctx.height = 225;

const intervalo = 10;
let tempo = 0;
let maxtempo = 10000;
const imgSize = {
    min: 0,
    max: 961,
};

function Personagem(imagem, x, y, h, w) {
    this.x = x;
    this.y = y;
    this.estado = 0;
    this.img = new Image();
    this.img.src = imagem;
    this.width = w;
    this.height = h;

    /*
     * Calcula como desenhar o n-esimo frame de um sprite
     */
    this.desenha = function (n) {
        let posX = this.x - fundo.sx;
        let sx = this.width * n;
        let sy = 0;
        if (sx > this.img.width - this.width) {
            sy = this.height * Math.floor(sx / this.img.width);
            sx = sx % this.img.width;
        }
        try {
            ctx.drawImage(
                this.img,
                sx,
                sy,
                this.width,
                this.height,
                posX,
                this.y,
                this.width,
                this.height
            );
        } catch (e) {
            alert(e.toString());
        }
    };
}

function Estado(ini, fini, sx, sy, vel, personagem) {
    this.frameIni = ini;
    this.frameFim = fini;
    this.num = ini;
    this.sx = sx;
    this.sy = sy;
    this.velocidade = vel;
    this.personagem = personagem;
    this.complemento;

    this.prox = function () {
        if (this.num === this.frameFim) {
            this.num = this.frameIni;
        } else {
            this.num = this.num + 1;
            this.trans();
        }
    };
    this.muda = function () {
        let x = tempo / this.velocidade;
        if (x - Math.floor(x) > 0) return false;
        else return true;
    };
    this.trans = function () {
        if (this.complemento !== undefined) {
            this.complemento();
        }
    };
}

var fundo = new (function () {
    this.img = new Image();
    this.img.src = 'fundo.png';
    this.sx = 200;
    this.desenha = function () {
        ctx.drawImage(this.img, this.sx, 0, 400, 225, 0, 0, 400, 225);
    };
})();

var heroi = new (function () {
    this.agente = new Personagem('heroi.png', 400, 45, 95, 50);
    this.corrente = 0;
    this.estados = new Array();
    this.estados[0] = new Estado(4, 12, 0, 0, 500, this);
    this.estados[1] = new Estado(0, 4, 0, 0, 200, this);
    this.estados[2] = new Estado(13, 18, 0, 0, 200, this);
    this.estados[3] = new Estado(18, 25, 0, 0, 500, this);

    this.move = (dir) => {
        if (dir == 'left') {
            this.corrente = 1;
            this.agente.x = Math.max(0, this.agente.x - 2);
        }
        if (dir == 'right') {
            this.corrente = 2;
            this.agente.x = Math.min(imgSize.max, this.agente.x + 2);
        }
    };

    this.reseta = function () {
        if (this.corrente == 1) {
            this.corrente = 0;
        } else if (this.corrente == 2) {
            this.corrente = 3;
        }
    };

    this.desenha = function () {
        if (this.estados[this.corrente].muda())
            this.estados[this.corrente].prox();
        this.agente.desenha(this.estados[this.corrente].num);
    };
})();

function desenha() {
    acertaJanela();
    fundo.desenha();
    heroi.desenha();
}

function acertaJanela() {
    if (heroi.agente.x - fundo.sx < 0) fundo.sx = heroi.agente.x;
    else if (heroi.agente.x > fundo.sx + canvas.width)
        fundo.sx = heroi.agente.x - canvas.width;
}

var GameLoop = function () {
    desenha();
    setTimeout(GameLoop, intervalo);

    if (teclas['ArrowLeft']) heroi.move('left');
    else if (teclas['ArrowRight']) heroi.move('right');
    else heroi.reseta();

    tempo = tempo + intervalo;
    if (tempo > maxtempo) tempo = 0;
};

//Controla as teclas pressionadas / levantadas
let teclas = {};

const teclaPressionada = (event) => {
    teclas[event.code] = event.type === 'keydown';
};

const teclaLevantada = (event) => {
    teclas[event.code] = event.type === 'keydown';
};

addEventListener('keydown', teclaPressionada);
addEventListener('keyup', teclaLevantada);
// --------------------------------------------------

GameLoop();
