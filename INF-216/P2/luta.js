const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.width = 675;
ctx.height = 353;

alert(
    'Seta esquerda e direita para mover o lutador. Q para fazer a lutadora morrer.'
);

const intervalo = 10;
var tempo = 0;
const maxtempo = 10000;

const somMove = new Audio('chute.ogg');
const somPancada = new Audio('pancada.ogg');
const somAh = new Audio('ah.ogg');

function Personagem(imagem, x, y, h, w) {
    this.x = x;
    this.y = y;
    this.estado = 0;
    this.img = new Image();
    this.img.src = imagem;
    this.width = w;
    this.height = h;
}

function Estado(ini, fini, sx, sy, vel) {
    this.frameIni = ini;
    this.frameFim = fini;
    this.num = ini;
    this.sx = sx;
    this.sy = sy;
    this.velocidade = vel;
    this.transx = 0;
    this.transy = 0;
    this.tabelatrans;

    this.prox = function () {
        if (this.num === this.frameFim) {
            this.num = this.frameIni;
        } else {
            this.num = this.num + 1;
            this.trans();
        }
    };
    this.muda = function () {
        var x = tempo / this.velocidade;
        if (x - Math.floor(x) > 0) return false;
        else return true;
    };
    this.trans = function () {
        if (this.tabelatrans == undefined) {
            this.transx = 0;
            this.transy = 0;
        } else {
            this.transx = this.tabelatrans[this.num].x;
            this.transy = this.tabelatrans[this.num].y;
        }
    };
}

var fundo = new (function () {
    this.img = new Image();
    this.img.src = 'fundonoite.png';
    this.desenha = function () {
        ctx.drawImage(this.img, 0, 0);
    };
})();

var lutador = new (function () {
    this.agente = new Personagem('lutador.gif', 230, 120, 132, 125);
    this.frames = 6;
    this.corrente = 0;
    this.estados = new Array();
    this.estados[0] = new Estado(0, 1, 0, 0, 500);

    this.estados[1] = new Estado(0, 6, 0, 0, 100);
    this.estados[1].tabelatrans = new Array();
    this.estados[1].tabelatrans[0] = new Object({ x: 0, y: 0 });
    this.estados[1].tabelatrans[1] = new Object({ x: 0, y: -20 });
    this.estados[1].tabelatrans[2] = new Object({ x: 0, y: -40 });
    this.estados[1].tabelatrans[3] = new Object({ x: 0, y: -40 });
    this.estados[1].tabelatrans[4] = new Object({ x: 0, y: -20 });
    this.estados[1].tabelatrans[5] = new Object({ x: 0, y: -10 });
    this.estados[1].tabelatrans[6] = new Object({ x: 0, y: 0 });

    this.desenha = function () {
        var sx =
            this.agente.width * this.estados[this.corrente].num +
            this.estados[this.corrente].sx;
        if (this.estados[this.corrente].muda())
            this.estados[this.corrente].prox();
        try {
            ctx.save();
            ctx.translate(
                this.estados[this.corrente].transx,
                this.estados[this.corrente].transy
            );
            ctx.drawImage(
                this.agente.img,
                sx,
                0,
                this.agente.width,
                this.agente.height,
                this.agente.x,
                this.agente.y,
                this.agente.width,
                this.agente.height
            );
            ctx.restore();
        } catch (e) {
            alert(e.toString());
        }
        this.calculaProxEstado();
    };

    this.iniciaEstado = function (n) {
        this.corrente = n;
        if (n === 1) {
            this.estados[lutador.corrente].num =
                lutador.estados[lutador.corrente].frameIni;
            somMove.play();
        }
    };

    this.calculaProxEstado = function () {
        switch (this.corrente) {
            case 1:
                if (
                    this.estados[this.corrente].num ===
                    this.estados[this.corrente].frameFim
                ) {
                    this.corrente = 0;
                }
                break;
            case 0:
                break;
        }
    };

    this.move = (dir) => {
        if (dir == 'left') {
            this.agente.x -= 2;
        }
        if (dir == 'right') {
            this.agente.x += 2;
        }
    };
})();

function desenha() {
    fundo.desenha();
    lutador.desenha();
}

var lutadora = new (function () {
    this.agente = new Personagem('lutadora.png', 500, 150, 95, 80);
    this.frames = 5;
    this.frame = 0;
    this.corrente = 0;
    this.estado == 0;
    this.estados = new Array();
    this.estados[0] = new Estado(0, 1, 0, 0, 1000);

    this.estados[1] = new Estado(1, 5, 0, 0, 100);
    this.estados[1].tabelatrans = new Array();
    this.estados[1].tabelatrans[0] = new Object({ x: 0, y: 0 });
    this.estados[1].tabelatrans[1] = new Object({ x: 10, y: -10 });
    this.estados[1].tabelatrans[2] = new Object({ x: 20, y: -20 });
    this.estados[1].tabelatrans[3] = new Object({ x: 30, y: -10 });
    this.estados[1].tabelatrans[4] = new Object({ x: 40, y: 0 });

    this.desenha = function () {
        if (!(this.estado == 1 && this.frame == 3))
            if (this.estados[this.corrente].muda()) {
                this.estados[this.corrente].prox();
                this.frame++;
            }

        var sx =
            this.agente.width * this.estados[this.corrente].num +
            this.estados[this.corrente].sx;

        try {
            ctx.save();
            ctx.translate(
                this.estados[this.corrente].transx,
                this.estados[this.corrente].transy
            );
            ctx.drawImage(
                this.agente.img,
                sx,
                0,
                this.agente.width,
                this.agente.height,
                this.agente.x,
                this.agente.y,
                this.agente.width,
                this.agente.height
            );
            ctx.restore();
        } catch (e) {
            alert(e.toString());
        }
        this.calculaProxEstado();
    };

    this.iniciaEstado = function (n) {
        if (this.estado == 1) return;
        this.corrente = n;
        this.frame = 0;
        if (n === 1) {
            this.estados[lutador.corrente].num =
                lutador.estados[lutador.corrente].frameIni;
            this.estado = 1;
        }
    };

    this.calculaProxEstado = function () {
        switch (this.corrente) {
            case 1:
                if (
                    this.estados[this.corrente].num ===
                    this.estados[this.corrente].frameFim
                ) {
                    // this.corrente = 0;
                    //Queremos que a lutadora continue morta
                }
                break;
            case 0:
                break;
        }
    };
})();

function desenha() {
    fundo.desenha();
    lutador.desenha();
    lutadora.desenha();
}

var GameLoop = function () {
    desenha();
    setTimeout(GameLoop, intervalo);
    if (teclas['KeyQ']) lutadora.iniciaEstado(1);
    if (teclas['ArrowLeft']) lutador.move('left');
    if (teclas['ArrowRight']) lutador.move('right');
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

document.onkeydown = function (e) {
    let keycode;
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
    if (keycode === 40) {
        lutador.iniciaEstado(0);
    } else if (keycode === 38) {
        lutador.iniciaEstado(1);
    }
};

GameLoop();
