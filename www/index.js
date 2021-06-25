import * as dp from "dp-vis";
// dp = require("dp-vis")
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

// Constants for the Pendulams that we draw initially.
const m1_def = 15;
const m2_def = 10;
const a1 = Math.PI / 3;
const a2 = 2 * Math.PI / 3;
const l1_def = 100;
const l2_def = 100;
const damp_factor = 0.01;

const starting_number_of_pendulums = 7;

let pv = dp.PendulumVector.new();

const createobject = (number_of_pendulums) => {
    for (let i = 0; i < number_of_pendulums; i++) {
        let ch = dp.Colors.new_hsla(((number_of_pendulums - 1- i)/number_of_pendulums ), 0.80,0.50, 0.4);
        let ch2 = dp.Colors.new_hsla(((number_of_pendulums - 1- i)/number_of_pendulums), 0.80,0.50, 1.0);
        pv.add(dp.Pendulum.new_with_color(m1_def + i*0.00001, m2_def, a1 - 0.005 * i, a2 + 0.005 * i, l1_def + 0.001 * i, l2_def, damp_factor, ch, ch2));
    }
};

const canvas = document.getElementById('pendulam');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext('2d');

/*
constants related to drawing of pendulam motion
*/
let originX = 350;
let originY = 300;
let paint_background = false;
let pause = false;
let print_info = true;

/*
function that draws on each frame
It draws:
    1. Pivot to joint
    2. First bob
    3. Joint to end
    4. Second Bob
*/
const drawInd = (index) => {
    /**
     * param: `index`: Index of pendulam to draw on canvas
     */

    // set the fill and stroke style according to pendulams configs
    ctx.fillStyle = pv.item_bob_color(index);
    ctx.strokeStyle = pv.item_line_color(index);

    // (x1, y1) -- Position of first bob
    // (x2, y2) -- Position of second bob
    // m1, m2 -- mass of bob1 and bob2 respectively
    let x1 = pv.item_x1(index);
    let y1 = -1 * pv.item_y1(index);
    let x2 = pv.item_x2(index);
    let y2 = -1 * pv.item_y2(index);
    let m1 = pv.item_m1(index);
    let m2 = pv.item_m2(index);


    // drawing the line from origin to coordinates of first bob
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + x1, originY + y1);
    ctx.stroke();
    ctx.closePath();

    // save this position as center of first bob, we will 
    // need to move here as drawing the circular bob will move
    // the pointer on the circumference
    let lastposX = originX + x1;
    let lastposY = originY + y1;

    // draw the first bob, with the radius being proportional to its mass
    ctx.arc(lastposX, lastposY, m1, 0, Math.PI * 2, true);
    ctx.fill();

    // draw the line from center of bob1 to bob2 position (x2, y2).
    ctx.beginPath();
    ctx.moveTo(lastposX, lastposY);
    ctx.lineTo(originX + x2, originY + y2);
    ctx.stroke();
    ctx.closePath();

    // draw the second bob, with its radius proportional to m2
    ctx.arc(originX + x2, originY + y2, m2, 0, Math.PI * 2, true);
    ctx.fill();
};

const renderLoop = () => {
    // at the start of each frame, check if we want a clear background
    // or a background that wants to store previous frames
    if (paint_background) {
        ctx.fillStyle = WHITE;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    // clear the info so that a new set can be drawn
    info.textContent = "";
    for (let i = 0; i < pv.size(); i++) {
        pv.item_motion(i);
        drawInd(i);
        if (print_info)
            printInfo(i);
    }
    // if the animation is not pasued, then continue, else stop here.
    if (!pause)
        requestAnimationFrame(renderLoop);
};

// creates the first set of pendulams
createobject(starting_number_of_pendulums);
// creates the first instance of rendering, which later calls itself
// to continue the animation. 
requestAnimationFrame(renderLoop);

/*
    Changing the background paint status
*/
document.getElementById('change_backgound').onclick = function () {
    console.log('Button pressed');
    if (paint_background) {
        paint_background = false;
    } else
        paint_background = true;
}

const hextorgb = function(hexcolor) {
    let red = parseInt(hexcolor.slice(1, 3), 16);
    let green = parseInt(hexcolor.slice(3, 5), 16);
    let blue = parseInt(hexcolor.slice(5, 7), 16);

    return [red, green, blue];
}


document.getElementById('new_pendulam').onclick = function () {
    let m1 = parseInt(document.getElementById('m1cntrl').value );
    let m2 = parseInt(document.getElementById('m2cntrl').value );
    let l1 = parseInt(document.getElementById('l1cntrl').value );
    let l2 = parseInt(document.getElementById('l2cntrl').value );

    let linecol = hextorgb(document.getElementById('lcolor').value);
    let bobcol  = hextorgb(document.getElementById('bcolor').value);

    let linec = dp.Colors.new(linecol[0], linecol[1], linecol[2], 1.0);
    let bobc = dp.Colors.new(bobcol[0], bobcol[1], bobcol[2], 1.0);

    pv.add(dp.Pendulum.new_with_color(m1, m2, a1 - 0.05, a2 + 0.05, l1, l2, damp_factor, linec, bobc));
}

document.getElementById('pause_background').onclick = function(){
    if (pause == true){
        pause = false;
        renderLoop();
    } else{
        pause = true;
    }
}

document.getElementById('gen_new_bg').onclick = function(){
    var cnt = parseInt(document.getElementById('new_random_gen').value);
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    while(pv.size()){
        pv.remove(0);
    }
    createobject(cnt);
}

/*
Printing Info
*/

document.getElementById('toggle_info_text').onclick = function(){
    if (print_info){
        print_info = false;
    } else{
        print_info = true;
    }
}

let info = document.getElementById('info');
const printInfo = (index) => {
    let x1 = pv.item_x1(index);
    let y1 = -1 * pv.item_y1(index);
    let x2 = pv.item_x2(index);
    let y2 = -1 * pv.item_y2(index);

    let m1 = pv.item_m1(index);
    let m2 = pv.item_m2(index);
    let l1 = pv.item_l1(index);
    let l2 = pv.item_l2(index);
    let s = `
Pendulum ${index+1} <br>
Fixed Constants: <br>m1: ${m1}\tm2: ${m2}    l1: ${l1}\tl2: ${l2}<br><br>
Dampening Constant: ${damp_factor}<br>(x1, y1) :  (${x1.toFixed(5)}, ${y1.toFixed(5)})<br>(x2, y2) :  (${x2.toFixed(5)}, ${y2.toFixed(5)})<br><br><br>`;

    let infoobj = document.createElement('p');
    infoobj.innerHTML = s;
    info.appendChild(infoobj)
};

