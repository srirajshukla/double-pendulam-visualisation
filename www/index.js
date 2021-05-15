import * as dp from "dp-vis";

/*
Webpage specific constants.
*/
const WIDTH = 700;
const HEIGHT = 600;
const BLACK = "rgba(0, 0, 0, 1)";
const WHITE = "rgba(255, 255, 255, 1)";
/*
Pendulam Constants
*/

const m2 = 10;
const a1 = Math.PI/3;
const a2 = 2*Math.PI/3;
const l1 = 100;
const l2 = 100;
const damp_factor = (0.001+0.0001)/2;

let pv = dp.PendulamVector.new();

let m1;

const createobject = () =>{
    
    m1 = document.getElementById('volume').value;

    for(let i = 0; i<850; i++){
        let lc = dp.Colors.new(i, (102+i), 230-5*i, 1.0);
        let bc = dp.Colors.new(i, 202-i, 130-5*i, 1.0);
        pv.add(dp.Pendulam.new_with_color(m1+i*5, m2, a1-0.05*i, a2+0.05*i, l1+0.1*i, l2, damp_factor, lc, bc));
    }
};
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

let originX = WIDTH / 2;
let originY = 300;
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