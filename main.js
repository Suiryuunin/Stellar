import { Chart } from "./Components/chart.js";
import { Reader } from "./Components/reader.js";
import { TRect } from "./Components/transform.js";
import { Engine } from "./Engine/engine.js";
import { Renderer } from "./Engine/renderer.js";

const rr = new Renderer(document.querySelector("canvas"), 1);
const chart = new Chart("Heiliges Requiem");
await chart.FetchChart("HeiligesRequiem");
const reader = new Reader(rr, chart, 2)

function update(dt)
{
    reader.update(dt);
}

function render()
{
    rr.fillBackground("white");
    reader.render();
    rr.fillRect(new TRect(( (4*0.2) ) / 4 * rr.canvas.width, 0, 4, rr.canvas.height));
    rr.render();
}

const engine = new Engine(60, update, render);
engine.start();

const ratio = 9/16;
window.addEventListener("load", () => rr.resize(window.innerWidth, window.innerHeight, ratio));
rr.resize(window.innerWidth, window.innerHeight, ratio);
window.addEventListener("resize", () => rr.resize(window.innerWidth, window.innerHeight, ratio));

window.addEventListener("click", () => chart.start());