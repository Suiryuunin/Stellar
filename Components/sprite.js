import { Ani, GenerateSet } from "./animator.js";


export class Sprite
{
    constructor(T, folderName, w, h, folderSize, loop, looping = true, active = true, startTime = 0)
    {
        this.T = T;
        this.active = active;
        this.looping = looping;

        this.animation = new Ani(GenerateSet(folderName, w, h, folderSize));
        this.animation.init(loop, startTime);
    }

    play(time)
    {
        this.active = true;
        this.animation.startTime = time;
        this.animation.update(time);
    }

    updatePos(P)
    {
        this.T.x = P.x;
        this.T.y = P.y;
    }

    update(time, P)
    {
        this.updatePos(P);
        this.animation.update(time);
        if (!this.looping && this.animation.loop.length-1 == this.animation.currentIndex) this.active = false;
    }

    render(rr)
    {
        if (this.active) rr.drawImg(this.T, this.animation.currentImg);
    }
}