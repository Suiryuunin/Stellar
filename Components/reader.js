import { Input, inputTypes, typeIndex } from "../Engine/input.js";
import { AccuracyFX } from "./FX.js";
import { TRect } from "./transform.js";

export class Reader
{
    constructor(rr, chart, speed = 4)
    {
        this.time = 0;
        this.clearedNoteType = "";

        this.rr = rr;
        this.y = 1;

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
                console.log(type)
                const accuracy = this.checkAccuracy(typeIndex[type]);
                if (accuracy >= 0)
                {
                    this.chart.chart[this.closestI].active = false;
                    this.accuracyUI.push(new AccuracyFX(accuracy, this.timeToX(this.chart.chart[this.closestI].time)));
                    this.clearedNoteType = type;
                }
            }
        }
        this.clearedNoteType = "";
    }

    update()
    {
        // update the index
        this.time = this.chart.track.currentTime;
        this.clearedNoteType = "";

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
        const T = new TRect(x, note.y*(this.rr.ctx[0].canvas.height-32), 32,32);
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
        switch(this.getNote(index).type)
        {
            case 2:
            {
                this.getNote(index).y = this.getNote(index-1).y;
                this.getNote(index+1).y = 0;
                break;
            }
            case 3:
            {
                this.getNote(index).y = this.getNote(index-1).y;
                this.getNote(index+1).y = 1;
                break;
            }
            default:
            {
                this.getNote(index).y = this.getNote(index-1).y;
                break;
            }
        }
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
    }
}