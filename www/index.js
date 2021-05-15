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

const printInfo = (index) =>{
    let x1 = pv.item_x1(index);
    let y1 = -1 * pv.item_y1(index);
    let x2 = pv.item_x2(index);
    let y2 = -1 * pv.item_y2(index);
    
    pxy(x1, y1, x2, y2);
}


const drawInd = (index) => {
    if (paint_background) {
        ctx.fillStyle = WHITE;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    ctx.fillStyle = pv.item_bob_color(index);
    ctx.strokeStyle = pv.item_line_color(index);
    
    let x1 = pv.item_x1(index);
    let y1 = -1 * pv.item_y1(index);
    let x2 = pv.item_x2(index);
    let y2 = -1 * pv.item_y2(index);
    
    printInfo(index);
    
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

    for(let i = 0; i<pv.size(); i++){
        pv.item_motion(i);
        drawInd(i);
    }

    requestAnimationFrame(renderLoop);

};

createobject();
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

document.getElementById('volume').addEventListener('change', createobject);