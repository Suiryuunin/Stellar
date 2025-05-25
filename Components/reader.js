import { Input, inputTypes, typeIndex } from "../Engine/input.js";
import { AccuracyFX } from "./FX.js";
import { Pos, TRect } from "./transform.js";

export class Reader
{
    constructor(rr, chart, speed = 4)
    {
        this.score = 0;
        this.pts =
        {
            0:1000000/chart.chart.length,
            1:1000000/chart.chart.length*0.5,
            2:1000000/chart.chart.length*0.2
        }
        this.time = 0;
        this.clearedNoteType = "";

        this.rr = rr;
        this.toY = 0;
        this.y = 0;

        // Speed is defined by how many seconds it takes to go from the right side of the screen to the left
        this.speed = speed;
        this.hitpos = 0.2;
        this.input = new Input();

        this.perfectDelay = 0.05;
        this.goodDelay = 0.1;
        this.badDelay = 0.2;

        this.accuracyUI = [];

        this.chart = chart;
        this.lastI = 0;
        this.closestI = 0;
    }

    start()
    {
        this.chart.play();
    }

    end()
    {

    }

    miss(note)
    {
        note.active = false;
        this.accuracyUI.push(new AccuracyFX(-1, this.timeToX(this.chart.track.currentTime), this.y));
        if (note.type == 2) this.toY = 1;
        else if (note.type == 3) this.toY = -1;
    }

    getNote(index)
    {
        return this.chart.chart[index];
    }

    timeToX(time)
    {
        return ( (this.speed*this.hitpos)+(time-this.chart.track.currentTime) ) / this.speed * this.rr.ctx[0].canvas.width;
    }

    updateLastIndex()
    {
        let i = this.lastI;
        while (this.getNote(i) != undefined && this.getNote(i).time < this.chart.track.currentTime-(this.speed*this.hitpos))
            i++;
        this.lastI = i;
    }
    updateClosestIndex()
    {
        let i = this.closestI;
        if (this.getNote(i) != undefined) this.getNote(i).closest = false;
        while (this.getNote(i) != undefined && (this.getNote(i).time < this.chart.track.currentTime-this.goodDelay || !this.getNote(i).active))
            i++;
        if (this.getNote(i) != undefined) this.getNote(i).closest = true;

        if (this.closestI != i && this.getNote(this.closestI).active)
        {
            this.miss(this.getNote(this.closestI));
        }

        this.closestI = i;
    }

    checkAccuracy(type = 0)
    {
        if (this.chart.chart[this.closestI].type != type) return -1;
        const delay = Math.abs(this.chart.track.currentTime-this.chart.chart[this.closestI].time)
        if (delay > this.badDelay) return -1;
        if (delay > this.goodDelay) return 2;
        if (delay > this.perfectDelay) return 1;
        return 0;
    }

    resolveInput()
    {
        for (const type of inputTypes)
        {
            if (this.input.checkInput(type))
            {
                const accuracy = this.checkAccuracy(typeIndex[type]);
                if (accuracy >= 0)
                {
                    this.score+=this.pts[accuracy];
                    this.chart.chart[this.closestI].active = false;
                    this.accuracyUI.push(new AccuracyFX(accuracy, this.timeToX(this.chart.chart[this.closestI].time),this.y));
                    this.clearedNoteType = type;
                }
            }
        }
    }

    update(y)
    {
        // update the index
        this.time = this.chart.track.currentTime;
        this.clearedNoteType = "";
        this.toY = 0;
        this.y = y;

        this.updateLastIndex();
        
        if (this.chart.chart[this.lastI] == undefined)
        {
            this.end();
            return;
        }

        this.updateClosestIndex();

        this.resolveInput();
    }

    renderType(x, note)
    {
        const stroke = note.closest ? "gray" : "black";
        note.y += ((note.time-this.chart.track.currentTime > 0.5) ? 0.2 : 0.5)*(this.y-note.y)
        const T = new TRect(x, note.y, 32,32);
        switch(note.type)
        {
            case 0:
                this.rr.fillRect(T, "red");
                this.rr.strokeRect(T, stroke,0,false,4);
                break;
            case 1:
                this.rr.fillRect(T, "gold");
                this.rr.strokeRect(T, stroke,0,false,4);
                break;
            case 2:
                this.rr.fillRect(T, "green");
                this.rr.strokeRect(T, stroke,0,false,4);
                break;
            case 3:
                this.rr.fillRect(T, "blue");
                this.rr.strokeRect(T, stroke,0,false,4);
                break;
            default:
                console.log("WHAT");
                break;
        }
    }

    renderNoteAt(note)
    {
        this.renderType(this.timeToX(note.time), note);
    }

    setY(index)
    {
        this.getNote(index).y = 1080*0.5;
    }

    iterateActiveNotes(callback)
    {
        for (let i = this.lastI; this.getNote(i) != undefined && this.getNote(i).time < this.chart.track.currentTime + (this.speed*(1-this.hitpos)); i++)
        {
            if (this.getNote(i).y == undefined) this.setY(i);
            if (this.getNote(i).active)
            {
                callback(this.getNote(i));
            }
        }
    }

    render()
    {
        this.iterateActiveNotes((e) => this.renderNoteAt(e));

        for (let i = 0; i < this.accuracyUI.length; i++)
        {
            if (this.accuracyUI[i]!= undefined) this.accuracyUI[i].render(this.rr);
            if (this.accuracyUI[i] != undefined && !this.accuracyUI[i].active) delete this.accuracyUI[i];
        }

        let s = ("000000" + Math.ceil(this.score)).slice(-7);
        s = s.substring(0,1)+""+s.substring(1,4)+""+s.substring(4,7);
        this.rr.write([s], "white", new Pos(1920-64,64), 64, new Pos(-1,-1));
    }
}