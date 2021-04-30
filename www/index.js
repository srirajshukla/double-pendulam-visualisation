import * as dp from "dp-vis";

/*
Webpage specific constants.
*/
const WIDTH = 600;
const HEIGHT = 500;
const BLACK = "#FFFFFF";    
const WHITE = "rgba(0, 0, 0, 1)";
const LINE = "rgba(0, 255, 255, 1)";
const BOB = "rgba(165, 55, 253, 1)";

/*
Pendulam Constants
*/
const m1 = 7.5;
const m2 = 10;
const a1 = Math.PI/3;
const a2 = 2*Math.PI/3;
const l1 = 150;
const l2 = 100;
const damp_factor = 0.01;


let p = dp.Pendulam.new(m1, m2, a1, a2, l1, l2, damp_factor);

const canvas = document.getElementById('pendulam');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext('2d');
/*
Priting info using a pre element.
*/
let info = document.getElementById('info');
const pxy = (x1, y1, x2, y2) => {
    let s = `Fixed Constants: \nM1: ${m1}\t M2: ${m2}\nL1: ${l1}\tL2: ${l2}\n`;
    s += `Dampening Constant: ${damp_factor}\n`;
    s += "(x1, y1) :  ("
    s += x1;
    s += ", ";
    s += y1;
    s += ")\n";
    s += "(x2, y2) :  ("
    s += x2;
    s += ", ";
    s += y2;
    s += ")\n\n";
    
    info.textContent = s;
};

/*
constants related to drawing of pendulam motion
*/

let originX = WIDTH / 2 - WIDTH / 10;
let originY = 150;
let paint_background = false;

/*
function that draws on each frame
It draws:
    1. Pivot to joint
    2. First bob
    3. Joint to end
    4. Second Bob
*/

const draw = () => {
    if (paint_background) {
        ctx.fillStyle = WHITE;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    ctx.fillStyle = BOB;
    ctx.strokeStyle = LINE;
    
    let x1 = p.x1();
    let y1 = -1 * p.y1();
    let x2 = p.x2();
    let y2 = -1 * p.y2();
    
    pxy(x1, y1, x2, y2);
    
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + x1, originY + y1);
    ctx.stroke();
    ctx.closePath();
    
    let lastposX = originX + x1;
    let lastposY = originY + y1;
    
    ctx.arc(lastposX, lastposY, m1, 0, Math.PI * 2, true);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(lastposX, lastposY);
    ctx.lineTo(originX + x2, originY + y2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.arc(originX + x2, originY + y2, m2, 0, Math.PI * 2, true);
    ctx.fill();
};

const renderLoop = () => {
    p.motion();
    draw();
    requestAnimationFrame(renderLoop);
};
requestAnimationFrame(renderLoop);

/*
    Changing the background paint status
*/

document.getElementById('change_backgound').onclick = function (){
    if (paint_background)
    paint_background = false;
    else
        paint_background = true;
}