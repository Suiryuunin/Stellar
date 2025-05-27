import { Level } from "./Components/level.js";
import { LevelSlot } from "./Components/levelSlot.js";

export class LevelSelection {
    constructor()
    {
        this.i = 0;
        this.levelSlots =
        [
            new LevelSlot(new Level("Kirakira Noel Story", "Roku Mochizuki", "HeiligesRequiem")),
            new LevelSlot(new Level("neurosis", "awe", "neurosis"))
        ];
        for (let i = 0; i < this.levelSlots.length; i++)
        {
            this.levelSlots[i].i = i;
            this.levelSlots[i].oy = 540+i*64;
            this.levelSlots[i].update();
        }
        
        this.browse = (dy) =>
        {
            if ((this.i == 0 && dy < 0) || (this.i > (this.levelSlots.length-2) && dy > 0)) return;
            this.i+=dy;
            this.updateIndex();
        }

        this.scroll = (e) =>
        {
            this.browse(Math.sign(e.deltaY));
        }
        this.oldY = 0;
        this.dir = 0;
        this.mousedown = (e) =>
        {
            this.oldY = e.pageY;
            window.addEventListener("mousemove", this.pan);
        }
        this.mouseup = (e) =>
        {
            this.dir = 0;
            window.removeEventListener("mousemove", this.pan);
        }
        this.pan = (e) =>
        {
            if (this.dir != Math.sign(e.movementY)) this.oldY = e.pageY;
            const dy = (this.oldY-e.pageY) / window.innerHeight;
            if (Math.abs(dy) > 0.05)this.browse(Math.sign(dy));
            this.dir = Math.sign(e.movementY);
        }
    }

    activate()
    {
        window.addEventListener("wheel", this.scroll);
        window.addEventListener("mousedown", this.mousedown);
        window.addEventListener("mouseup", this.mouseup);
        this.updateIndex();
    }
    deactivate()
    {
        window.removeEventListener("wheel", this.scroll);
        window.removeEventListener("mousedown", this.mousedown);
        window.removeEventListener("mouseup", this.mouseup);
        window.removeEventListener("mousemove", this.pan);
    }

    updateIndex()
    {
        for (let i = 0; i < this.levelSlots.length; i++)
        {
            this.levelSlots[i].i = i-this.i;
            this.levelSlots[i].oy = 540+i*64;
            this.levelSlots[i].update();
        }
    }

    check()
    {
        if (this.levelSlots[this.i].play)
        {
            this.levelSlots[this.i].play = false;
            for (let i = 0; i < this.levelSlots.length; i++)
            {
                this.levelSlots[i].setBack();
            }
            return true;
        }
        return false;
    }

    render(rr)
    {
        for (const level of this.levelSlots)
        {
            level.render(rr);
        }
    }
}
    