import { Input } from "../Engine/input.js";
import { AccuracyFX } from "./FX.js";
import { TRect } from "./transform.js";

export class Reader
{
    constructor(rr, chart, speed = 4)
    {
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
        this.lastI =
        {
            lead:0,
            bass:0
        }
        this.closestI =
        {
            lead:0,
            bass:0
        }
    }

    start()
    {
        this.chart.play();
    }

    end()
    {

    }

    timeToX(time)
    {
        return ( (this.speed*this.hitpos)+(time-this.chart.track.currentTime) ) / this.speed * this.rr.canvas.width;
    }

    updateLastIndex(type = "lead")
    {
        let i = this.lastI[type];
        while (this.chart[type][i] != undefined && this.chart[type][i].time < this.chart.track.currentTime-(this.speed*this.hitpos))
            i++;
        this.lastI[type] = i;
    }
    updateClosestIndex(type = "lead")
    {
        let i = this.closestI[type];
        if (this.chart[type][i] != undefined) this.chart[type][i].closest = false;
        while (this.chart[type][i] != undefined && (this.chart[type][i].time < this.chart.track.currentTime-this.goodDelay || !this.chart[type][i].active))
            i++;
        if (this.chart[type][i] != undefined) this.chart[type][i].closest = true;
        this.closestI[type] = i;
    }

    checkAccuracy(type = 0, category = "lead")
    {
        if (this.chart[category][this.closestI[category]].type != type) return -1;
        const delay = Math.abs(this.chart.track.currentTime-this.chart[category][this.closestI[category]].time)
        if (delay > this.badDelay) return -1;
        if (delay > this.goodDelay) return 2;
        if (delay > this.perfectDelay) return 1;
        return 0;
    }

    resolveInput()
    {
        if (this.input.checkInput("slash"))
        {
            const accuracy = this.checkAccuracy(0, "lead");
            if (accuracy >= 0)
            {
                this.chart["lead"][this.closestI["lead"]].active = false;
                this.accuracyUI.push(new AccuracyFX(accuracy, this.timeToX(this.chart["lead"][this.closestI["lead"]].time)));
            }
        }
        if (this.input.checkInput("parry"))
        {
            const accuracy = this.checkAccuracy(1, "lead");
            if (accuracy >= 0)
            {
                this.chart["lead"][this.closestI["lead"]].active = false;
                this.accuracyUI.push(new AccuracyFX(accuracy, this.timeToX(this.chart["lead"][this.closestI["lead"]].time)));
            }
        }
        if (this.input.checkInput("up"))
        {
            const accuracy = this.checkAccuracy(2, "bass");
            if (accuracy >= 0)
            {
                this.chart["bass"][this.closestI["bass"]].active = false;
                this.accuracyUI.push(new AccuracyFX(accuracy, this.timeToX(this.chart["bass"][this.closestI["bass"]].time)));
            }
        }
        if (this.input.checkInput("down"))
        {
            const accuracy = this.checkAccuracy(3, "bass");
            if (accuracy >= 0)
            {
                this.chart["bass"][this.closestI["bass"]].active = false;
                this.accuracyUI.push(new AccuracyFX(accuracy, this.timeToX(this.chart["bass"][this.closestI["bass"]].time)));
            }
        }
    }

    update()
    {
        // update the index
        this.updateLastIndex("lead");
        this.updateLastIndex("bass");
        
        if (this.chart.lead[this.lastI.lead] == undefined && this.chart.bass[this.lastI.bass] == undefined)
        {
            this.end();
            return;
        }

        this.updateClosestIndex("lead");
        this.updateClosestIndex("bass");

        this.resolveInput();

        this.input.clear();
    }

    renderType(x, note)
    {
        const stroke = note.closest ? "hotpink" : "black";
        const T = new TRect(x, this.y*this.rr.canvas.height, 32,32);
        switch(note.type)
        {
            case 0:
                this.rr.fillRect(T, "red");
                this.rr.strokeRect(T, stroke,0,true,4);
                break;
            case 1:
                this.rr.fillRect(T, "gold");
                this.rr.strokeRect(T, stroke,0,true,4);
                break;
            case 2:
                this.rr.fillRect(T, "emerald");
                this.rr.strokeRect(T, stroke,0,true,4);
                break;
            case 3:
                this.rr.fillRect(T, "blue");
                this.rr.strokeRect(T, stroke,0,true,4);
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

    iterateActiveNotes(type, callback)
    {
        for (let i = this.lastI[type]; this.chart[type][i] != undefined && this.chart[type][i].time < this.chart.track.currentTime + (this.speed*(1-this.hitpos)); i++)
        {
            if (this.chart[type][i].active)
            {
                callback(this.chart[type][i]);
            }
        }
    }

    render()
    {
        this.iterateActiveNotes("lead", (e) => this.renderNoteAt(e));
        this.iterateActiveNotes("bass", (e) => this.renderNoteAt(e));
    }
}