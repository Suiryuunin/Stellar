import { Ani, GenerateSet } from "./animator.js";


export class Sprite
{
    constructor(T, folderName, w, h, folderSize, loop, looping = true, startTime = 0)
    {
        this.T = T;
        this.active = true;
        this.looping = looping;

        this.animation = new Ani(GenerateSet(folderName, w, h, folderSize));
        this.animation.init(loop, startTime);
    }

    play(time)
    {
        this.animation.startTime = time;
        this.animation.update(time);
    }

    update(time)
    {
        this.animation.update(time);
        if (this.animation.loop.length-1 == this.animation.currentIndex) this.active = false;
    }

    render(rr)
    {
        if (this.active) rr.drawImg(this.T, this.animation.currentImg);
    }
}