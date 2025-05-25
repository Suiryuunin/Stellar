import { Frame } from "./Components/animator.js";
import { Chart } from "./Components/chart.js";
import { Player } from "./Components/player.js";
import { Reader } from "./Components/reader.js";
import { Sprite } from "./Components/sprite.js";
import { Pos, TRect } from "./Components/transform.js";
import { Engine } from "./Engine/engine.js";
import { Renderer } from "./Engine/renderer.js";

const rr = new Renderer(document.querySelector("canvas"), 1);
const chart = new Chart("Heiliges Requiem");
await chart.FetchChart("HeiligesRequiem");
const reader = new Reader(rr, chart, 2);

const player = new Player(new Pos(176,rr.ctx[0].canvas.height-256-64));

const stars = new Sprite(new TRect(0,0,1920,1080), "Stars", 256,144, 4,
[
    new Frame(0,4),
    new Frame(2,4),
    new Frame(1,4),
    new Frame(3,4)
], true, true);

function update(dt)
{
    reader.update(player.y);
    player.update(reader);
    stars.update(reader.time);
    stars.alpha = (0.5-Math.abs((reader.time*0.25)-(Math.floor(reader.time*0.25)+0.5)));
    reader.invert = player.invert;
    
    reader.input.clear();
}

function render()
{
    rr.fillBackground("black");
    stars.render(rr);
    reader.render();
    rr.fillRect(new TRect(( (4*0.2) ) / 4 * rr.ctx[0].canvas.width, 0, 4, 1080), "white", 0, 0.2);
    player.render(rr);
    rr.render();
}

const engine = new Engine(60, update, render);
engine.start();

const ratio = 9/16;
window.addEventListener("load", () => rr.resize(window.innerWidth, window.innerHeight, ratio));
rr.resize(window.innerWidth, window.innerHeight, ratio);
window.addEventListener("resize", () => rr.resize(window.innerWidth, window.innerHeight, ratio));

window.addEventListener("click", () => chart.start());