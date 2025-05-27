import { rr } from "../main.js";
import { Pos, TRect } from "./transform.js";

export class Word
{
    constructor(word,P, size = 64, border = false)
    {
        this.word = word;
        this.size = size;
        this.P = P;
        this.border = border;
    }

    render(rr)
    {
        rr.write(this.word, "white", this.P, this.size, new Pos(0,-0.5), 0, this.border);
    }
}

function pointCollideRect(point, T)
{
    return (point.x <= T.right() && point.x >= T.left() && point.y <= T.bottom() && point.y >= T.top());
}

export class Button
{
    constructor(action = () =>{console.log("FOOL! This button doesn't do jack shit!!")}, word = [""], T, size = 64)
    {
        this.word = word;
        this.T = T,
        this.size = size;
        this.offset = new Pos(-0.5,-0.5);

        this.action = this.action;

        this.event = (e) =>
        {
            const coords = rr.toCanvasCoords(e.pageX, e.pageY);

            const tt = new TRect(this.T.x-this.T.w*0.5, this.T.y-this.T.h*0.5, this.T.w, this.T.h);
            if (pointCollideRect(coords, tt))
            {
                action(this);
            }
        };
        this.activate();
    }

    activate()
    {
        window.addEventListener("mousedown", this.event);
    }

    deactivate()
    {
        window.removeEventListener("mousedown", this.event);
    }

    render(rr)
    {
        rr.write(this.word, "white", this.T, this.size, this.offset);
    }
}

export class LevelSlot
{
    constructor(level)
    {
        this.oy = 0;
        this.play = false;
        this.level = level;
        this.active = false;
        this.content = [];

        this.i = 0;
    }

    setActive()
    {
        this.active = true;
        if (this.content[3] != undefined) this.content[3].deactivate();
        this.content = [new Word([this.level.chartName], new Pos(288,16+this.oy)),new Word([this.level.composer], new Pos(320,16+this.oy+48),48), new Word([`[${this.level.score}]`], new Pos(1184,42+this.oy)), new Button(()=>{this.play = true;}, ">", new TRect(1616, 42+this.oy, 64,64), 64)];
    }

    setBack()
    {
        this.active = false;
        if (this.content[3] != undefined) this.content[3].deactivate();
        this.content = [new Word([this.level.chartName], new Pos(288,16+this.oy)), new Word([`[${this.level.score}]`], new Pos(1184,16+this.oy))];
    }

    update()
    {
        this.oy = 540+this.i*(this.i == 1 ? 144 : 96);
        if (this.i == 0)
            this.setActive();
        else
            this.setBack();
    }

    render(rr)
    {
        for (const e of this.content)
        {
            e.render(rr);
        }
        if (this.active) rr.strokeRect(new TRect(256, this.oy-36, 1408, 144), "white");
    }
}